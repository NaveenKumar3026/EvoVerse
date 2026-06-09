/*
  Warnings:

  - Added the required column `populationAtFormation` to the `Civilization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Civilization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Civilization" ADD COLUMN     "populationAtFormation" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
