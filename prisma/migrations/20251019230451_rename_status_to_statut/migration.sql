/*
  Warnings:

  - You are about to drop the column `status` on the `Paiement` table. All the data in the column will be lost.
  - Added the required column `statut` to the `Paiement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Paiement` DROP COLUMN `status`,
    ADD COLUMN `statut` VARCHAR(191) NOT NULL;
