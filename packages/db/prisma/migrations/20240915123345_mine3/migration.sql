-- CreateTable
CREATE TABLE "HDFCBank" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "HDFCBank_pkey" PRIMARY KEY ("id")
);
