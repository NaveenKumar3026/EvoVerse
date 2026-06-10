-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "era" TEXT NOT NULL DEFAULT 'Stone Age',
    "civilizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Technology_civilizationId_key" ON "Technology"("civilizationId");

-- AddForeignKey
ALTER TABLE "Technology" ADD CONSTRAINT "Technology_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
