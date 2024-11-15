-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roll" (
    "id" TEXT NOT NULL,
    "die1" INTEGER NOT NULL,
    "die2" INTEGER NOT NULL,
    "sum" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,
    "rollNumber" INTEGER NOT NULL,

    CONSTRAINT "Roll_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Roll" ADD CONSTRAINT "Roll_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
