import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/inngest/channels/httprequest";

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);

    return safeString;
});

type HttpRequestData = {
    variableName: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    authToken?: string;
    headers?: Record<string, string>;
    body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    if (!data.endpoint) {
        // TODO: Publish "error" state for http request
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("HTTP Request node: No endpoint configured");

    }
    if (!data.variableName) {
        // TODO: Publish "error" state for http request
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("HTTP Request node: Variable name not configured");
    }

    if (!data.method) {
        // TODO: Publish "error" state for http request
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("HTTP Request node: Method not configured");
    }

    try {
        const result = await step.run("http-request", async () => {
            const endpoint = Handlebars.compile(data.endpoint)(context);
            const method = data.method;
            const headers: Record<string, string> = {};

            if (data.authToken?.trim()) {
                const resolvedToken = Handlebars.compile(data.authToken)(context).trim();
                if (resolvedToken) {
                    headers.Authorization = `Bearer ${resolvedToken}`;
                }
            }

            if (data.headers) {
                for (const key in data.headers) {
                    headers[key] = Handlebars.compile(data.headers[key])(context);
                }
            }

            const options: KyOptions = {
                method,
                headers,
            };

            if (["POST", "PUT", "PATCH"].includes(method)) {
                const resolved = Handlebars.compile(data.body || "{}")(context);
                JSON.parse(resolved);
                options.body = resolved;
                options.headers = {
                    ...headers,
                    "Content-Type": "application/json",
                };
            }

            const response = await ky(endpoint, options);
            const contentType = response.headers.get("content-type");
            const responseData = contentType?.includes("application/json")
                ? await response.json()
                : await response.text();
            const responsePayload = {
                httpResponse: {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData,
                },
            };



            // Fallback to direct httpResponse for backward compatibility
            return {
                ...context,
                [data.variableName]: responsePayload,
            }
        });

    // TODO: Publish "success" state for http request
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "success",
        }),
    );


    return result;
} catch (error) {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error",
        }),
    );
    throw error;
}
};
