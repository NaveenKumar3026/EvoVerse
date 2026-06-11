-- CreateTable
CREATE TABLE "Alliance" (
    "id" TEXT NOT NULL,
    "civilizationAId" TEXT NOT NULL,
    "civilizationBId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alliance_pkey" PRIMARY KEY ("id")
);
