/*
  Warnings:

  - You are about to drop the column `boardId` on the `Bolt` table. All the data in the column will be lost.
  - You are about to drop the column `boardId` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `unitId` to the `Bolt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bolt" DROP CONSTRAINT "Bolt_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_unitId_fkey";

-- DropIndex
DROP INDEX "Bolt_boardId_idx";

-- DropIndex
DROP INDEX "Column_boardId_idx";

-- DropIndex
DROP INDEX "Task_unitId_idx";

-- AlterTable
ALTER TABLE "Bolt" DROP COLUMN "boardId",
ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "boardId",
ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "unitId";

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "branchName" TEXT;

-- CreateIndex
CREATE INDEX "Bolt_unitId_idx" ON "Bolt"("unitId");

-- CreateIndex
CREATE INDEX "Column_unitId_idx" ON "Column"("unitId");

-- AddForeignKey
ALTER TABLE "Bolt" ADD CONSTRAINT "Bolt_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
