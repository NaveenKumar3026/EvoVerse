-- CreateTable
CREATE TABLE "EvolutionHistory" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvolutionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Civilization" (
    "id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Civilization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Civilization_speciesId_key" ON "Civilization"("speciesId");

-- AddForeignKey
ALTER TABLE "EvolutionHistory" ADD CONSTRAINT "EvolutionHistory_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Civilization" ADD CONSTRAINT "Civilization_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
