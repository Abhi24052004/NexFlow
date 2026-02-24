import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from '@ai-sdk/openai';
import { inngest } from "./client";
import prisma from '@/lib/db';
import { randomFill } from "node:crypto";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("fetch-a-video", "5s");
        await step.sleep("transcribe-video", "5s");
        await step.sleep("send-to-ai", "5s");

        await step.run("create-workflow", () => {
            return prisma.workflow.create({
                data: {
                    name: "workflow-from-inngest",
                },
            });
        });
    }
);
const google=createGoogleGenerativeAI();
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  
});
export const execute = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ event, step }) => {
        await step.sleep("pretend", "5s");
        const {steps:geminiSteps}=await step.ai.wrap(
            "gemini-generate-text",generateText,{
                system:"You are helpful assistant",
                model:google("gemini-2.5-flash"),
                prompt: "what is 2+2 ?"
                
            }
        )
        const {steps:openAiSteps}=await step.ai.wrap(
            "openai-generate-text",generateText,{
                system:"You are helpful assistant",
                model: openrouter("gpt-oss-20b"),
                prompt: "what is 2+2 ?"
                
            }
        )
        return {geminiSteps, openAiSteps};
    }
);