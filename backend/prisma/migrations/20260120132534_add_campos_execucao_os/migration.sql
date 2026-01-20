/*
  Warnings:

  - You are about to drop the column `data_fim` on the `Apontamento` table. All the data in the column will be lost.
  - You are about to drop the column `data_inicio` on the `Apontamento` table. All the data in the column will be lost.
  - You are about to drop the column `data_fim_servico` on the `OrdemServico` table. All the data in the column will be lost.
  - You are about to drop the column `data_inicio_servico` on the `OrdemServico` table. All the data in the column will be lost.
  - You are about to drop the column `executanteId` on the `OrdemServico` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrdemServico" DROP CONSTRAINT "OrdemServico_executanteId_fkey";

-- AlterTable
ALTER TABLE "Apontamento" DROP COLUMN "data_fim",
DROP COLUMN "data_inicio",
ADD COLUMN     "fim_trabalho" TIMESTAMP(3),
ADD COLUMN     "inicio_trabalho" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OrdemServico" DROP COLUMN "data_fim_servico",
DROP COLUMN "data_inicio_servico",
DROP COLUMN "executanteId",
ADD COLUMN     "executante" TEXT,
ADD COLUMN     "fim_servico" TIMESTAMP(3),
ADD COLUMN     "inicio_servico" TIMESTAMP(3),
ALTER COLUMN "tempo_total_execucao" DROP NOT NULL;
