-- AlterTable
ALTER TABLE "Apontamento" ADD COLUMN     "data_fim" TIMESTAMP(3),
ADD COLUMN     "data_inicio" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OrdemServico" ADD COLUMN     "data_fim_servico" TIMESTAMP(3),
ADD COLUMN     "data_inicio_servico" TIMESTAMP(3),
ADD COLUMN     "equipamento_utilizado" TEXT,
ADD COLUMN     "executanteId" INTEGER,
ADD COLUMN     "tempo_total_execucao" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_executanteId_fkey" FOREIGN KEY ("executanteId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
