/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Pessoa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Pessoa_cpf_key` ON `Pessoa`(`cpf`);
