import prisma from '@/lib/db';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { create } from 'node:domain';
import { inngest } from "@/inngest/client";
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { workflowRouter } from '@/features/workflows/server/routers';

export const appRouter = createTRPCRouter({

  workflows:workflowRouter,

  testAi: protectedProcedure
    .mutation(async () => {
      await inngest.send({
        name: "execute/ai",
      });
      return {success:true};
    }),
  getUsers: protectedProcedure
    .query(({ ctx }) => {
      return prisma.user.findMany({
        where: {
          id: ctx.auth.user.id
        }
      });
    }),
  getWorkflows: protectedProcedure
    .query(({ ctx }) => {
      return prisma.workflow.findMany({});
    }),
  createWorkflow: protectedProcedure
    .mutation(async () => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          email: "testUser@example.com",
        },
      });

      // // fetch utube video
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      // // fetch transcription
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      // // generate summary
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      return ({ success: true })
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;