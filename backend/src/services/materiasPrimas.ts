import { prisma } from "../config/prisma";
import { Prisma, MateriaPrima } from "@prisma/client";

export class MateriaPrimaService{

    async pegarTodosMateriaPrimas(): Promise<MateriaPrima[]>{
            return await prisma.materiaPrima.findMany();
    };

    async pegarMateriaPrimaPorId(id: number): Promise<MateriaPrima | null>{
            return await prisma.materiaPrima.findUnique({
                where: {id}
        });
    };

    async adicionarMateriaPrima(MateriaPrimaData: Prisma.MateriaPrimaCreateInput): Promise<MateriaPrima>{
            return await prisma.materiaPrima.create({
                data: MateriaPrimaData
        });
    };

    async atualizarMateriaPrima(id: number, MateriaPrimaData: Prisma.MateriaPrimaUpdateInput): Promise<MateriaPrima>{
            return await prisma.materiaPrima.update({
                where: {id},
                data: MateriaPrimaData
        });
    };

    async deletarMateriaPrima(id: number): Promise<MateriaPrima>{
            return await prisma.materiaPrima.delete({
            where: {id}
        });
    };
};