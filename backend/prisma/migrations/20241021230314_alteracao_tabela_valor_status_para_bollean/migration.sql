/*
  Warnings:

  - You are about to alter the column `status` on the `valor` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `valor` MODIFY `status` BOOLEAN NOT NULL DEFAULT true;
