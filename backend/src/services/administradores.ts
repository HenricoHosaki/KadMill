import { prisma } from "../config/prisma";
import { Prisma, Usuario } from "@prisma/client";
import { AppError } from "../errors/appError";
import { hash } from "bcrypt-ts"

export class AdministradorService {

    async pegarTodosUsuarios(): Promise<Usuario[]> {
        const usuarios = await prisma.usuario.findMany();
        if(usuarios.length === 0){
            throw new AppError('Nenhum usuário encontrado', 404)
        }
        return usuarios
    };

    async pegarUsuarioPorId(id: number): Promise<Usuario | null> {
        return await prisma.usuario.findUnique({
            where: { id }
        });
        
    };

    async criarUsuario(usuarioData: Prisma.UsuarioCreateInput): Promise<Usuario> {
        const senhaHashada = await hash(usuarioData.senha, 10)

        return await prisma.usuario.create({

            data: {...usuarioData,
            senha: senhaHashada
            },
        });
    };

    async atualizarUsuario(id: number, usuarioData: Prisma.UsuarioUpdateInput): Promise<Usuario> {
        return await prisma.usuario.update({
            where: { id },
            data: usuarioData
        });
        
    };
    
    async deletarUsuario(id: number): Promise<Usuario> {
        return await prisma.usuario.delete({
            where: { id }
        });
    };
}

