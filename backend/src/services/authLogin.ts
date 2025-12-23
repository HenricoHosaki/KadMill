import { prisma } from "../config/prisma";
import { Prisma, Usuario } from "@prisma/client";

export class Login{

     async findById(id: number): Promise<Usuario | null> {
        return await prisma.usuario.findUnique({
            where: { id }
        });
        
    };
};