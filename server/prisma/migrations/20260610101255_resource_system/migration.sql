-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "food" INTEGER NOT NULL DEFAULT 100,
    "wood" INTEGER NOT NULL DEFAULT 100,
    "stone" INTEGER NOT NULL DEFAULT 100,
    "metal" INTEGER NOT NULL DEFAULT 100,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "civilizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resource_civilizationId_key" ON "Resource"("civilizationId");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
