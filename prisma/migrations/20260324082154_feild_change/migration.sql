/*
  Warnings:

  - You are about to drop the column `craetedAt` on the `Workflow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "craetedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
