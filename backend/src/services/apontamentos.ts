import { prisma } from "../config/prisma";
import { Apontamento, Prisma } from "@prisma/client";
import { AppError } from "../errors/appError";

export class ApontamentoService{

    async pegarTodosApontamentos(): Promise<Apontamento[]>{
            const todosApontamentos = await prisma.apontamento.findMany();

            return todosApontamentos
    };

    async pegarApontamentoPorId(id: number): Promise<Apontamento | null>{
            const idApontamentoPego = await prisma.apontamento.findUnique({
            where: {id}
        });

        if(!idApontamentoPego){
            throw new AppError("Id de apontamento não encontrado", 404)
        }
        return idApontamentoPego
    };

    async criarApontamento(data: any) {
    const inicio = new Date(data.data_inicio);
    const fim = new Date(data.data_fim);
    
    // Cálculo da diferença em minutos
    const diffMs = fim.getTime() - inicio.getTime();
    const duracaoMinutos = Math.round(diffMs / 60000); // 60000ms = 1 minuto

    if (duracaoMinutos < 0) {
      throw new AppError("A data final não pode ser anterior à data inicial.");
    }

    // Transação para salvar apontamento e atualizar a OS ao mesmo tempo
    return await prisma.$transaction(async (tx) => {
      // 1. Cria o apontamento
      const novoApontamento = await tx.apontamento.create({
        data: {
          usuarioId: Number(data.usuarioId),
          ordemServicoId: Number(data.ordemServicoId),
          ferramentaId: data.ferramentaId ? Number(data.ferramentaId) : null,
          materiaPrimaId: data.materiaPrimaId ? Number(data.materiaPrimaId) : null,
          quantidade_utilizada: Number(data.quantidade_utilizada || 0),
          quantidade_produzida: Number(data.quantidade_produzida || 0),
          observacao: data.observacao,
          data_inicio: inicio,
          data_fim: fim,
          tempo_execucao: duracaoMinutos
        },
      });

      // 2. Atualiza a Ordem de Serviço com os totais
      const dadosAtualizacaoOS: any = {
        tempo_total_execucao: { increment: duracaoMinutos }, // Soma ao total
        executanteId: Number(data.usuarioId),                // Define o último executante
        data_fim_servico: fim,                               // Atualiza última atividade
        status: 'EM ANDAMENTO'
      };

      // Se a OS não tinha data de início, define agora
      const osAtual = await tx.ordemServico.findUnique({ 
          where: { id: Number(data.ordemServicoId) } 
      });
      if (osAtual && !osAtual.data_inicio_servico) {
        dadosAtualizacaoOS.data_inicio_servico = inicio;
      }

      await tx.ordemServico.update({
        where: { id: Number(data.ordemServicoId) },
        data: dadosAtualizacaoOS
      });

      return novoApontamento;
    });
  }

    async atualizarApontamento(id: number, apontamentoData: any): Promise<Apontamento>{
        
        const existeApontamento = await prisma.apontamento.findUnique({
             where: { id }
        })

        if(!existeApontamento){
             throw new AppError("Apontamento não encontrado", 404)
        };
        const { 
            id: _id, 
            usuario, 
            ordemServico, 
            ferramenta, 
            materiaPrima, 
            ...dadosLimpos 
        } = apontamentoData;

        const apontamentoAtualizado = await prisma.apontamento.update({
            where: { id },
            data: dadosLimpos
        })

        return apontamentoAtualizado
    };
        
    async deletarApontamento(id: number): Promise<Apontamento> {
            const apontamentoExiste = await prisma.apontamento.findUnique({
                where: { id }
            })
            
            if(!apontamentoExiste){
                throw new AppError("Id de apontamento não encontrado", 404)
            }

            const deletaApontamento = await prisma.apontamento.delete({
                where: { id }
        });
            return deletaApontamento
    };
};