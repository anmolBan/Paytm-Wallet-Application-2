/*
  Warnings:

  - Added the required column `status` to the `HDFCBank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HDFCBank" ADD COLUMN     "status" "OnRampStatus" NOT NULL;
