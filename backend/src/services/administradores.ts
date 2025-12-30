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
        const idPego = await prisma.usuario.findUnique({
            where: { id }
        });
        if(!idPego){
            throw new AppError('Id de usuário não encontrado', 404)
        }
        return idPego;
    };

    async criarUsuario(usuarioData: Prisma.UsuarioCreateInput): Promise<Usuario> {
        const senhaHashada = await hash(usuarioData.senha, 10)

         if(usuarioData.senha.length < 4){
            throw new AppError('A senha deve conter no mínimo 4 caracteres', 406)
        }

        const usuarioCriado = await prisma.usuario.create({
 
            data: {...usuarioData,
            senha: senhaHashada
            },
        });

        if(!usuarioCriado){
            throw new AppError('Não foi possível criar o usuário')
        }
            return usuarioCriado
    };

    async atualizarUsuario(id: number, usuarioData: Prisma.UsuarioUpdateInput): Promise<Usuario> {
        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id }
        })
        if(!usuarioExiste){
            throw new AppError("Id de usuário não encontrado", 404)
        }
        
        const atualizaUsuario = await prisma.usuario.update({
            where: { id },
            data: usuarioData
        });

        return atualizaUsuario
    };
    
    async deletarUsuario(id: number): Promise<Usuario> {
        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id }
        })
        if(!usuarioExiste){
            throw new AppError("Id de usuário não encontrado", 404)
        }

        const deletaUsuario = await prisma.usuario.delete({
            where: { id }
        });
        
        return deletaUsuario
    };
}

