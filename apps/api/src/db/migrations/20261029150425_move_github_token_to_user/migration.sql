/*
  Warnings:

  - You are about to drop the column `githubToken` on the `Board` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Board" DROP COLUMN "githubToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubToken" TEXT;
