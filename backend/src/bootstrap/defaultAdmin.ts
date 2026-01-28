import { prisma } from "../config/prisma"
import { hash } from "bcrypt-ts"
import { Funcao, Status } from "@prisma/client";

/**
 * FUNÇÃO CRIAR ADMIN BOOTSTRAP(INICIA COM O SISTEMA)
*/
export async function criarAdmin(){
    const email = process.env.BOOTSTRAP_ADMIN_EMAIL
    const senha = process.env.BOOTSTRAP_ADMIN_PASSWORD

    if(!email || !senha)return

    const adminExiste = await prisma.usuario.findUnique({
        where: { email }
    })

    if(adminExiste)return
    
    const senhaHash = await hash(senha, 10)

    await prisma.usuario.create({
        data: {
            nome: " Administrador ",
            email,
            senha: senhaHash,
            cpf: "00000000000",
            funcao: Funcao.ADMIN,
            status: Status.ATIVO
        }
    })

    console.log("Admin bootstrap criado")
};