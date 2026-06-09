-- CreateTable
CREATE TABLE "MutationEvent" (
    "id" TEXT NOT NULL,
    "trait" TEXT NOT NULL,
    "oldValue" INTEGER NOT NULL,
    "newValue" INTEGER NOT NULL,
    "change" INTEGER NOT NULL,
    "speciesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MutationEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MutationEvent" ADD CONSTRAINT "MutationEvent_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
