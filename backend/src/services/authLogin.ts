import { prisma } from "../config/prisma";
import { Prisma, Usuario } from "@prisma/client";
import { AppError } from "../errors/appError";

export class Login{

     async findById(id: number): Promise<Usuario | null> {
        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id }
        });
        if(!usuarioExiste){
            throw new AppError("Id de usuário não encontrado")
        };
        return usuarioExiste
    };
};