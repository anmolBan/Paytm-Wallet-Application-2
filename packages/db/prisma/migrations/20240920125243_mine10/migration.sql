/*
  Warnings:

  - You are about to drop the column `phone` on the `p2pTransfer` table. All the data in the column will be lost.
  - Added the required column `fromPhone` to the `p2pTransfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toPhone` to the `p2pTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "p2pTransfer" DROP COLUMN "phone",
ADD COLUMN     "fromPhone" TEXT NOT NULL,
ADD COLUMN     "toPhone" TEXT NOT NULL;
