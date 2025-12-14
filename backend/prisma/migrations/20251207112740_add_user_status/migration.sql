/*
  Warnings:

  - The primary key for the `_FundAccess` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_FundManagers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_FundAccess` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_FundManagers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "_FundAccess" DROP CONSTRAINT "_FundAccess_AB_pkey";

-- AlterTable
ALTER TABLE "_FundManagers" DROP CONSTRAINT "_FundManagers_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_FundAccess_AB_unique" ON "_FundAccess"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_FundManagers_AB_unique" ON "_FundManagers"("A", "B");
