-- CreateEnum
CREATE TYPE "Funcao" AS ENUM ('OPERADOR', 'GERENTE', 'ADMIN');

-- CreateEnum
CREATE TYPE "Setor" AS ENUM ('NOTURNO', 'DIURNO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "funcao" "Funcao" NOT NULL DEFAULT 'OPERADOR',
    "setor" "Setor" NOT NULL DEFAULT 'DIURNO',
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "data_admissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");
