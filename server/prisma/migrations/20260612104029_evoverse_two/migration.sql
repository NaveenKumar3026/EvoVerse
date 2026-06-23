-- AlterTable
ALTER TABLE "Civilization" ADD COLUMN     "fleetStrength" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "militaryPower" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "technologiesJson" TEXT NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Diplomacy" ADD COLUMN     "embassy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rivalry" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sanctions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "treatyType" TEXT NOT NULL DEFAULT 'None';

-- AlterTable
ALTER TABLE "War" ADD COLUMN     "conquestPlanetId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE "World" ADD COLUMN     "season" TEXT NOT NULL DEFAULT 'Season 1: Rise of Civilizations';

-- CreateTable
CREATE TABLE "Commander" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" TEXT NOT NULL DEFAULT 'Bronze',
    "xp" INTEGER NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 100,
    "userId" TEXT NOT NULL,
    "achievementsJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commander_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarSystem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "worldId" TEXT NOT NULL,

    CONSTRAINT "StarSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "resources" TEXT NOT NULL,
    "starSystemId" TEXT NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "Planet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerDecision" (
    "id" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "optionsJson" TEXT NOT NULL,
    "choiceMade" INTEGER NOT NULL DEFAULT -1,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "PlayerDecision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Commander_userId_key" ON "Commander"("userId");

-- AddForeignKey
ALTER TABLE "Commander" ADD CONSTRAINT "Commander_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarSystem" ADD CONSTRAINT "StarSystem_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planet" ADD CONSTRAINT "Planet_starSystemId_fkey" FOREIGN KEY ("starSystemId") REFERENCES "StarSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planet" ADD CONSTRAINT "Planet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Civilization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerDecision" ADD CONSTRAINT "PlayerDecision_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
