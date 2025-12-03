-- CreateEnum
CREATE TYPE "UnidadeMedida" AS ENUM ('KG', 'L', 'UN', 'M', 'CAIXA');

-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "observacao" TEXT,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ferramenta" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade_disponivel" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "ultima_manutencao" TIMESTAMP(3),

    CONSTRAINT "Ferramenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriaPrima" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade_disponivel" INTEGER NOT NULL DEFAULT 0,
    "unidade_medida" "UnidadeMedida" NOT NULL,
    "fornecedorId" INTEGER NOT NULL,
    "ultima_entrada" TIMESTAMP(3),
    "valor_unitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "MateriaPrima_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoMateriaPrima" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "materiaPrimaId" INTEGER NOT NULL,
    "quantidadeNecessaria" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProdutoMateriaPrima_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade_estoque" INTEGER NOT NULL DEFAULT 0,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "custo_unitario" DECIMAL(10,2) NOT NULL,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdemServico" (
    "id" SERIAL NOT NULL,
    "numero_os" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "descricao_servico" TEXT NOT NULL,
    "data_abertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fechamento" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ABERTA',
    "valor_total" DECIMAL(10,2) NOT NULL,
    "observacao" TEXT,

    CONSTRAINT "OrdemServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apontamento" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ordemServicoId" INTEGER NOT NULL,
    "ferramentaId" INTEGER,
    "materiaPrimaId" INTEGER,
    "quantidade_utilizada" INTEGER NOT NULL DEFAULT 0,
    "data_apontamento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tempo_execucao" INTEGER NOT NULL DEFAULT 0,
    "observacao" TEXT,

    CONSTRAINT "Apontamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cpf_cnpj_key" ON "Fornecedor"("cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_email_key" ON "Fornecedor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_cnpj_key" ON "Cliente"("cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "ProdutoMateriaPrima_produtoId_materiaPrimaId_key" ON "ProdutoMateriaPrima"("produtoId", "materiaPrimaId");

-- CreateIndex
CREATE UNIQUE INDEX "OrdemServico_numero_os_key" ON "OrdemServico"("numero_os");

-- AddForeignKey
ALTER TABLE "MateriaPrima" ADD CONSTRAINT "MateriaPrima_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoMateriaPrima" ADD CONSTRAINT "ProdutoMateriaPrima_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoMateriaPrima" ADD CONSTRAINT "ProdutoMateriaPrima_materiaPrimaId_fkey" FOREIGN KEY ("materiaPrimaId") REFERENCES "MateriaPrima"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apontamento" ADD CONSTRAINT "Apontamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apontamento" ADD CONSTRAINT "Apontamento_ordemServicoId_fkey" FOREIGN KEY ("ordemServicoId") REFERENCES "OrdemServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apontamento" ADD CONSTRAINT "Apontamento_ferramentaId_fkey" FOREIGN KEY ("ferramentaId") REFERENCES "Ferramenta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apontamento" ADD CONSTRAINT "Apontamento_materiaPrimaId_fkey" FOREIGN KEY ("materiaPrimaId") REFERENCES "MateriaPrima"("id") ON DELETE SET NULL ON UPDATE CASCADE;
