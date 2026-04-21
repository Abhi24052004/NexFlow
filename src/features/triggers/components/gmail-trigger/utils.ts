export const generateGmailScript = (
  webhookUrl: string,
) => `function checkForNewEmails() {
  var MAX_THREADS_PER_RUN = 20;
  var MIN_RUN_INTERVAL_MS = 5 * 60 * 1000;
  var WEBHOOK_URL = '${webhookUrl}';
  var scriptProperties = PropertiesService.getScriptProperties();
  var lastCheckedAt = Number(scriptProperties.getProperty('NEXFLOW_LAST_CHECKED_AT') || '0');
  var lastRunAt = Number(scriptProperties.getProperty('NEXFLOW_LAST_RUN_AT') || '0');
  var now = Date.now();
  var sentCount = 0;
  var skippedCount = 0;

  if (lastRunAt > 0 && now - lastRunAt < MIN_RUN_INTERVAL_MS) {
    console.log('Skipping run to avoid quota burst. Last run was ' + (now - lastRunAt) + 'ms ago.');
    return;
  }

  // Search only recent inbox threads, narrowed by checkpoint when available.
  var searchQuery = 'in:inbox newer_than:1d';
  if (lastCheckedAt > 0) {
    var cutoffDate = new Date(lastCheckedAt - 60000);
    searchQuery += ' after:' + formatGmailQueryDate_(cutoffDate);
  }

  var threads = GmailApp.search(searchQuery, 0, MAX_THREADS_PER_RUN);

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      try {
        var message = messages[j];
        var messageDate = message.getDate();
        var messageTime = messageDate ? messageDate.getTime() : 0;

        if (messageTime <= lastCheckedAt) {
          skippedCount++;
          continue;
        }

        var from = message.getFrom() || '';
        var plainBody = message.getPlainBody() || '';

        var payload = {
          id: message.getId(),
          threadId: threads[i].getId(),
          subject: message.getSubject() || '',
          from: from,
          fromEmail: extractEmailAddress(from),
          to: message.getTo() || '',
          cc: message.getCc() || '',
          bcc: message.getBcc() || '',
          date: messageDate,
          snippet: plainBody.slice(0, 200),
          body: plainBody,
          labels: getLabelNames(threads[i]),
          rawHeaders: message.getHeader('Message-ID') || ''
        };

        var options = {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify(payload),
          muteHttpExceptions: true
        };

        var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
        var status = response.getResponseCode();
        if (status >= 200 && status < 300) {
          sentCount++;
        } else {
          console.error('Gmail webhook status: ' + status + ' body: ' + response.getContentText());
        }
      } catch (error) {
        console.error('Failed to process Gmail message in thread ' + threads[i].getId() + ':', error);
      }
    }
  }

  scriptProperties.setProperty('NEXFLOW_LAST_CHECKED_AT', String(now));
  scriptProperties.setProperty('NEXFLOW_LAST_RUN_AT', String(now));
  console.log('Gmail check completed. sent=' + sentCount + ', skipped=' + skippedCount + ', lastCheckedAt=' + lastCheckedAt + ', now=' + now + ', query=' + searchQuery + ', threads=' + threads.length);
}

function resetGmailCheckpoint() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteProperty('NEXFLOW_LAST_CHECKED_AT');
  scriptProperties.deleteProperty('NEXFLOW_LAST_RUN_AT');
  console.log('NEXFLOW_LAST_CHECKED_AT cleared');
}

function testGmailWebhook() {
  var WEBHOOK_URL = '${webhookUrl}';
  var payload = {
    id: 'test-id',
    threadId: 'test-thread',
    subject: 'NexFlow Gmail Trigger Test',
    from: 'Test Sender <test@example.com>',
    fromEmail: 'test@example.com',
    to: 'you@example.com',
    cc: '',
    bcc: '',
    date: new Date().toISOString(),
    snippet: 'Test snippet',
    body: 'Test email body',
    labels: ['INBOX'],
    rawHeaders: 'Message-ID: test'
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
  console.log('Test webhook URL: ' + WEBHOOK_URL);
  console.log('Test webhook status: ' + response.getResponseCode());
  console.log('Test webhook body: ' + response.getContentText());
}

function extractEmailAddress(fromHeader) {
  if (!fromHeader) {
    return '';
  }

  var match = fromHeader.match(/<(.+?)>/);
  if (match && match[1]) {
    return match[1];
  }

  return fromHeader;
}

function getLabelNames(thread) {
  var labels = thread.getLabels();
  var names = [];

  for (var i = 0; i < labels.length; i++) {
    names.push(labels[i].getName());
  }

  return names;
}

function formatGmailQueryDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy/MM/dd');
}`;
