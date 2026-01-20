import { prisma } from "../config/prisma";
import { Prisma, MateriaPrima } from "@prisma/client";
import { AppError } from "../errors/appError";

export class MateriaPrimaService{

    async pegarTodosMateriaPrimas(): Promise<MateriaPrima[]>{
        const todasMateriaPrimas = await prisma.materiaPrima.findMany();
        
        return todasMateriaPrimas
    };

    async pegarMateriaPrimaPorId(id: number): Promise<MateriaPrima | null>{
        const idMateriaPrimaPego = await prisma.materiaPrima.findUnique({
                where: {id}
        });
        if(!idMateriaPrimaPego){
            throw new AppError("Id de matéria prima não encontrada", 404)
        };
        return idMateriaPrimaPego
    };

    async adicionarMateriaPrima(MateriaPrimaData: any): Promise<MateriaPrima> {
        
        // 1. Verifica se já existe pelo NOME (ignora maiúsculas/minúsculas)
        const existe = await prisma.materiaPrima.findFirst({
            where: {
                nome: {
                    equals: MateriaPrimaData.nome,
                    mode: 'insensitive' // Torna "Ferro" igual a "ferro"
                }
            }
        });

        if (existe) {
            // 2. Se existe, ATUALIZA o stock (soma a nova quantidade)
            const atualizada = await prisma.materiaPrima.update({
                where: { id: existe.id },
                data: {
                    quantidade_disponivel: {
                        increment: Number(MateriaPrimaData.quantidade_disponivel)
                    },
                    // Opcional: Atualizar preço se quiser
                    // valor_unitario: Number(MateriaPrimaData.valor_unitario) 
                }
            });
            return atualizada;
        }

        // 3. Se não existe, CRIA um novo normalmente
        const novaMateriaPrima = await prisma.materiaPrima.create({
            data: {
                nome: MateriaPrimaData.nome,
                descricao: MateriaPrimaData.descricao,
                unidade_medida: MateriaPrimaData.unidade_medida,
                quantidade_disponivel: Number(MateriaPrimaData.quantidade_disponivel),
                valor_unitario: Number(MateriaPrimaData.valor_unitario),
                fornecedorId: Number(MateriaPrimaData.fornecedorId)
            }
        });

        return novaMateriaPrima;
    };

    async atualizarMateriaPrima(id: number, MateriaPrimaData: Prisma.MateriaPrimaUpdateInput): Promise<MateriaPrima>{
        const materiaPrimaExiste = await prisma.materiaPrima.findUnique({
            where: { id }
        });
        
        if(!materiaPrimaExiste){
            throw new AppError("Id de matéria prima não encontrada, 404")
        };

        const atualizaMateriaPrima = await prisma.materiaPrima.update({
                where: {id},
                data: MateriaPrimaData
        });
        return atualizaMateriaPrima
    };

    async deletarMateriaPrima(id: number): Promise<MateriaPrima>{
        const materiaPrimaExiste = await prisma.materiaPrima.findUnique({
            where: { id }
        });
        
        if(!materiaPrimaExiste){
            throw new AppError("Id de matéria prima não encontrada, 404")
        };

        const deletaMateriaPrima = await prisma.materiaPrima.delete({
            where: {id}
        });
        return deletaMateriaPrima
    };
};