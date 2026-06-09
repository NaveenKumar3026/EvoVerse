/*
  Warnings:

  - Added the required column `oxygenLevel` to the `World` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planetType` to the `World` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperature` to the `World` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waterLevel` to the `World` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "World" ADD COLUMN     "currentEra" TEXT NOT NULL DEFAULT 'Primitive',
ADD COLUMN     "currentYear" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "disasterFrequency" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "oxygenLevel" INTEGER NOT NULL,
ADD COLUMN     "planetType" TEXT NOT NULL,
ADD COLUMN     "temperature" INTEGER NOT NULL,
ADD COLUMN     "waterLevel" INTEGER NOT NULL;
