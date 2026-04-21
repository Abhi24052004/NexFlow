export const generateGoogleSheetScript = (
  webhookUrl: string,
) => `// Configuration
const HEADER_ROW = 1; // Row containing headers
const WEBHOOK_URL = '${webhookUrl}';
const PROCESSED_SCRIPT_PROPERTY = 'processedRows_' + SpreadsheetApp.getActiveSpreadsheet().getId();

// Setup function - run this once to create the trigger
function setupTrigger() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  ScriptApp.getProjectTriggers().forEach(trigger => {
    const handler = trigger.getHandlerFunction();
    if (handler === 'onSheetEdit' || handler === 'onSheetChange' || handler === 'onSheetFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  ScriptApp.newTrigger('onSheetEdit')
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create();

  ScriptApp.newTrigger('onSheetChange')
    .forSpreadsheet(spreadsheet)
    .onChange()
    .create();

  ScriptApp.newTrigger('onSheetFormSubmit')
    .forSpreadsheet(spreadsheet)
    .onFormSubmit()
    .create();
    
  console.log('Google Sheet triggers setup completed (onEdit + onChange + onFormSubmit)');
}

// Main handler function
function onSheetEdit(e) {
  const sheet = e && e.range ? e.range.getSheet() : SpreadsheetApp.getActiveSheet();
  processSheetRows_(sheet);
}

function onSheetChange() {
  const sheet = SpreadsheetApp.getActiveSheet();
  processSheetRows_(sheet);
}

function onSheetFormSubmit(e) {
  const sheet = e && e.range ? e.range.getSheet() : SpreadsheetApp.getActiveSheet();
  processSheetRows_(sheet);
}

function processSheetRows_(sheet) {
  if (!sheet) return;

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow < HEADER_ROW + 1 || lastColumn < 1) return;

  // Get headers
  const headerRange = sheet.getRange(HEADER_ROW, 1, 1, lastColumn);
  const headers = headerRange.getValues()[0];

  // Track processed rows using script properties
  const scriptProperties = PropertiesService.getScriptProperties();
  const processedRowsJson = scriptProperties.getProperty(PROCESSED_SCRIPT_PROPERTY) || '{}';
  const processedRows = JSON.parse(processedRowsJson);

  const sheetName = sheet.getName();
  if (!processedRows[sheetName]) {
    processedRows[sheetName] = [];
  }

  // Get all data rows
  const dataRange = sheet.getRange(HEADER_ROW + 1, 1, lastRow - HEADER_ROW, lastColumn);
  const values = dataRange.getValues();

  // Process new rows
  for (let i = 0; i < values.length; i++) {
    const rowIndex = HEADER_ROW + 1 + i;
    const rowKey = sheetName + '_' + rowIndex;

    if (processedRows[sheetName].includes(rowKey)) {
      continue;
    }

    const rowData = values[i];
    if (rowData.every(cell => !cell || cell === '')) {
      continue;
    }

    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = rowData[j];
    }

    const payload = {
      spreadsheetId: spreadsheet.getId(),
      spreadsheetName: spreadsheet.getName(),
      sheetName: sheetName,
      rowNumber: rowIndex,
      timestamp: new Date().toISOString(),
      row: row,
      headers: headers
    };

    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    };

    try {
      const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
      const status = response.getResponseCode();

      if (status >= 200 && status < 300) {
        processedRows[sheetName].push(rowKey);
      } else {
        console.error('Webhook returned status: ' + status + ' body: ' + response.getContentText());
      }
    } catch (error) {
      console.error('Webhook failed: ' + error);
    }
  }

  scriptProperties.setProperty(PROCESSED_SCRIPT_PROPERTY, JSON.stringify(processedRows));
}

// Helper function to clear processed rows (useful for testing/reset)
function clearProcessedRows() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteProperty(PROCESSED_SCRIPT_PROPERTY);
  console.log('Processed rows cleared');
}

// Manual webhook connectivity test
function testWebhookConnection() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const payload = {
    spreadsheetId: spreadsheet.getId(),
    spreadsheetName: spreadsheet.getName(),
    sheetName: 'test-sheet',
    rowNumber: -1,
    timestamp: new Date().toISOString(),
    row: { test: 'ping' },
    headers: ['test']
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
  console.log('Test webhook URL: ' + WEBHOOK_URL);
  console.log('Test webhook status: ' + response.getResponseCode());
  console.log('Test webhook body: ' + response.getContentText());
}
`;