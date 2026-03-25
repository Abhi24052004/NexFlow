import prisma from "@/lib/db";
import {createTRPCRouter, protectedProcedure,premiumProcedure} from "@/trpc/init";
import { z } from "zod";

export const workflowRouter = createTRPCRouter({
    create:premiumProcedure.mutation(async ({ctx, input}) => {
        return prisma.workflow.create({
            data: {
                name: "TODO",
                userId: ctx.auth.user.id,
            }
        })
    }),
    remove:protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ctx, input}) => {
        return prisma.workflow.delete({
            where: {
                id: input.id,
                userId: ctx.auth.user.id,
            }
        })
    }),
    updatedName:protectedProcedure.input(z.object({ id: z.string(), name: z.string() })).mutation(async ({ctx, input}) => {
        return prisma.workflow.updateMany({
            where: {
                id: input.id,
                userId: ctx.auth.user.id,
            },
            data: {
                name: input.name,
            }
        })
    }),
    getOne:protectedProcedure.input(z.object({ id: z.string() })).query(async ({ctx, input}) => {
        return prisma.workflow.findFirst({
            where: {
                id: input.id,
                userId: ctx.auth.user.id,
            }
        })
    }), 
    getMany:protectedProcedure.query(async ({ctx}) => {
        return prisma.workflow.findMany({
            where: {
                userId: ctx.auth.user.id,
            }
        })
    }),
});