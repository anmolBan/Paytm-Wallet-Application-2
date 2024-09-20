/*
  Warnings:

  - Added the required column `status` to the `p2pTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "P2PStatus" AS ENUM ('Success', 'Failure', 'Processing');

-- AlterTable
ALTER TABLE "p2pTransfer" ADD COLUMN     "status" "P2PStatus" NOT NULL;
