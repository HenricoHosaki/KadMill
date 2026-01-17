/*
  Warnings:

  - Added the required column `tipo` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidade` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "modelo" TEXT,
ADD COLUMN     "tipo" TEXT NOT NULL,
ADD COLUMN     "unidade" TEXT NOT NULL,
ALTER COLUMN "descricao" DROP NOT NULL;
