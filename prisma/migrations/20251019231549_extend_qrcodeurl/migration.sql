/*
  Warnings:

  - Made the column `qrCodeUrl` on table `Billet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Billet` MODIFY `qrCodeUrl` VARCHAR(191) NOT NULL;
