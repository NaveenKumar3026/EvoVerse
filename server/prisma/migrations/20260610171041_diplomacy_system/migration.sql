-- CreateTable
CREATE TABLE "Diplomacy" (
    "id" TEXT NOT NULL,
    "civilizationAId" TEXT NOT NULL,
    "civilizationBId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL DEFAULT 'Neutral',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diplomacy_pkey" PRIMARY KEY ("id")
);
