/*
  Warnings:

  - Added the required column `token` to the `HDFCBank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HDFCBank" ADD COLUMN     "token" TEXT NOT NULL;
