-- AlterTable
ALTER TABLE "User" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Overcome" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checklistKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Overcome_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Overcome" ADD CONSTRAINT "Overcome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
