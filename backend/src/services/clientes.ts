import { prisma } from "../config/prisma";
import { Prisma, Cliente } from "@prisma/client";
import { AppError } from "../errors/appError"

export class ClienteService{

    async pegarTodosClientes(): Promise<Cliente[]>{
        const todosCliente = await prisma.cliente.findMany();
        
        return todosCliente
    };

    async pegarClientePorId(id: number): Promise<Cliente | null>{
        const idClientePego = await prisma.cliente.findUnique({
            where: {id}
        });

        if(!idClientePego){
            throw new AppError("Id de cliente não encontrado", 404)
        };
        return idClientePego
    };

    async adicionarCliente(ClienteData: Prisma.ClienteCreateInput): Promise<Cliente>{
        const clienteCriado = await prisma.cliente.create({
            data: ClienteData
        });

        if(!clienteCriado){
            throw new AppError("Não foi possível criar o cliente")
        };
        return clienteCriado
    };

    async atualizarCliente(id: number, ClienteData: any): Promise<Cliente>{ // Mudei para 'any' para facilitar a desestruturação
        const clienteExiste = await prisma.cliente.findUnique({
            where: { id }
        });

        if(!clienteExiste){
            throw new AppError("Id de cliente não encontrado", 404)
        };

        // --- LIMPEZA DE DADOS ---
        // Removemos id e relações (clienteOrdemServico) para não dar erro no Prisma
        const { id: _id, clienteOrdemServico, data_cadastro, ...dadosLimpos } = ClienteData;

        const atualizaCliente = await prisma.cliente.update({
            where: {id},
            data: dadosLimpos
        });
        return atualizaCliente
    };

    async deletarCliente(id: number): Promise<Cliente>{
        const clienteExiste = await prisma.cliente.findUnique({
            where: { id }
        });

        if(!clienteExiste){
            throw new AppError("Id de cliente não encontrado", 404)
        };
        
        const deletacliente = await prisma.cliente.delete({
            where: {id}
        });
        return deletacliente
    };
};