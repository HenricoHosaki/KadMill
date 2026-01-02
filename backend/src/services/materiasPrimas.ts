import { prisma } from "../config/prisma";
import { Prisma, MateriaPrima } from "@prisma/client";
import { AppError } from "../errors/appError";

export class MateriaPrimaService{

    async pegarTodosMateriaPrimas(): Promise<MateriaPrima[]>{
        const todasMateriaPrimas = await prisma.materiaPrima.findMany();
        
        if(todasMateriaPrimas.length === 0){
            throw new AppError("Nenhuma matéria prima encontrada", 404)
        }
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

    async adicionarMateriaPrima(MateriaPrimaData: Prisma.MateriaPrimaCreateInput): Promise<MateriaPrima>{
        const materialPrimaCriada = await prisma.materiaPrima.create({
                data: MateriaPrimaData
        });

        if(!materialPrimaCriada){
            throw new AppError("Não foi possível registrar a matéria prima")
        }
        return materialPrimaCriada
    };

    async atualizarMateriaPrima(id: number, MateriaPrimaData: Prisma.MateriaPrimaUpdateInput): Promise<MateriaPrima>{
        const materiaPrimaExiste = await prisma.usuario.findUnique({
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
        const materiaPrimaExiste = await prisma.usuario.findUnique({
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