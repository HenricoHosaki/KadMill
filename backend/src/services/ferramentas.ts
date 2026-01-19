import { prisma } from "../config/prisma";
import { Prisma, Ferramenta } from "@prisma/client";
import { AppError } from "../errors/appError";

export class FerramentaService {

    async pegarTodasFerramentas(): Promise<Ferramenta[]> {
        const ferramentas = await prisma.ferramenta.findMany();
        return ferramentas; // Retorna array vazio se não houver nada
    }

    async pegarFerramentaPorId(id: number): Promise<Ferramenta | null> {
        const ferramenta = await prisma.ferramenta.findUnique({
            where: { id }
        });
        if (!ferramenta) {
            throw new AppError("Ferramenta não encontrada", 404);
        }
        return ferramenta;
    }

    async criarFerramenta(data: Prisma.FerramentaCreateInput): Promise<Ferramenta> {
        const ferramenta = await prisma.ferramenta.create({
            data
        });
        return ferramenta;
    }

    async atualizarFerramenta(id: number, data: Prisma.FerramentaUpdateInput): Promise<Ferramenta> {
        const existe = await prisma.ferramenta.findUnique({ where: { id } });
        if (!existe) throw new AppError("Ferramenta não encontrada", 404);

        const atualizada = await prisma.ferramenta.update({
            where: { id },
            data
        });
        return atualizada;
    }

    async deletarFerramenta(id: number): Promise<Ferramenta> {
        const existe = await prisma.ferramenta.findUnique({ where: { id } });
        if (!existe) throw new AppError("Ferramenta não encontrada", 404);

        return await prisma.ferramenta.delete({
            where: { id }
        });
    }
}