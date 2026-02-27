/*
  Warnings:

  - Made the column `categoryId` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_categoryId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
