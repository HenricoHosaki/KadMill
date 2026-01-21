import { prisma } from "../config/prisma";
import { Prisma, Apontamento } from "@prisma/client";
import { AppError } from "../errors/appError";

export class ApontamentoService {

    async pegarTodosApontamentos(): Promise<Apontamento[]> {
        return await prisma.apontamento.findMany({
            include: { 
                ordemServico: true,
                usuario: true 
            }
        });
    }

    async pegarApontamentoPorId(id: number): Promise<Apontamento | null> {
        const apontamento = await prisma.apontamento.findUnique({
            where: { id },
            include: { ordemServico: true, usuario: true }
        });

        if (!apontamento) {
            throw new AppError("Apontamento não encontrado", 404);
        }
        return apontamento;
    }

    // ... imports ...

    async criarApontamento(data: any): Promise<Apontamento> {
        
        // --- VALIDAÇÃO DE ESTOQUE (NOVO) ---
        if (data.materiaPrimaId && data.quantidade_utilizada > 0) {
            const mp = await prisma.materiaPrima.findUnique({
                where: { id: Number(data.materiaPrimaId) }
            });

            if (!mp) {
                throw new AppError("Matéria Prima não encontrada", 404);
            }

            if (mp.quantidade_disponivel < Number(data.quantidade_utilizada)) {
                throw new AppError(
                    `Estoque insuficiente! Disponível: ${mp.quantidade_disponivel} ${mp.unidade_medida || ''}. Necessário: ${data.quantidade_utilizada}.`,
                    400 // Bad Request
                );
            }
        }
        // -----------------------------------

        // 1. CRIAÇÃO DO APONTAMENTO
        const apontamentoCriado = await prisma.apontamento.create({
            data: {
                usuarioId: data.usuarioId,
                ordemServicoId: data.ordemServicoId,
                ferramentaId: data.ferramentaId || null,
                materiaPrimaId: data.materiaPrimaId || null,
                quantidade_utilizada: data.quantidade_utilizada || 0,
                quantidade_produzida: data.quantidade_produzida || 0,
                tempo_execucao: data.tempo_execucao || 0,
                data_apontamento: data.data_apontamento || new Date(),
                inicio_trabalho: data.inicio_trabalho || null,
                fim_trabalho: data.fim_trabalho || null,
                observacao: data.observacao
            }
        });

        // 2. LÓGICA DE BAIXA DE ESTOQUE
        if (data.materiaPrimaId && data.quantidade_utilizada > 0) {
            await prisma.materiaPrima.update({
                where: { id: data.materiaPrimaId },
                data: {
                    quantidade_disponivel: { decrement: data.quantidade_utilizada }
                }
            });
        }

        // 3. ATUALIZA O RESUMO DA OS
        await this.atualizarResumoOS(data.ordemServicoId);

        return apontamentoCriado;
    }

    async atualizarApontamento(id: number, data: any): Promise<Apontamento> {
        const apontamentoAntigo = await prisma.apontamento.findUnique({ where: { id } });
        if (!apontamentoAntigo) throw new AppError("Apontamento não encontrado", 404);

        // --- VALIDAÇÃO INTELIGENTE NA EDIÇÃO ---
        // Se mudou a MP ou a quantidade, precisamos verificar se o novo valor é válido.
        // Lógica: Estoque Atual + O que eu tinha usado antes = Estoque Real antes da operação.
        // Se (Novo Uso) > (Estoque Real), bloqueia.
        
        if (data.materiaPrimaId && data.quantidade_utilizada > 0) {
            const mpId = Number(data.materiaPrimaId);
            const novaQtd = Number(data.quantidade_utilizada);
            
            // Pega a MP
            const mp = await prisma.materiaPrima.findUnique({ where: { id: mpId } });
            
            if (mp) {
                let estoqueVirtual = mp.quantidade_disponivel;

                // Se for a mesma MP de antes, devolvemos virtualmente o que foi gasto para validar
                if (apontamentoAntigo.materiaPrimaId === mpId) {
                    estoqueVirtual += apontamentoAntigo.quantidade_utilizada;
                }

                if (estoqueVirtual < novaQtd) {
                     throw new AppError(
                        `Estoque insuficiente para alteração! Máximo permitido: ${estoqueVirtual}.`,
                        400
                    );
                }
            }
        }
        // ---------------------------------------

        // LOGICA DE ESTOQUE REAL (Devolver o antigo e tirar o novo)
        // 1. Devolve o estoque antigo (se tinha MP)
        if (apontamentoAntigo.materiaPrimaId && apontamentoAntigo.quantidade_utilizada > 0) {
            await prisma.materiaPrima.update({
                where: { id: apontamentoAntigo.materiaPrimaId },
                data: { quantidade_disponivel: { increment: apontamentoAntigo.quantidade_utilizada } }
            });
        }

        // 2. Atualiza o apontamento
        const { id: _id, usuario, ordemServico, ferramenta, materiaPrima, ...dadosLimpos } = data;
        const atualizado = await prisma.apontamento.update({
            where: { id },
            data: dadosLimpos
        });

        // 3. Tira o novo estoque
        if (data.materiaPrimaId && data.quantidade_utilizada > 0) {
             await prisma.materiaPrima.update({
                where: { id: data.materiaPrimaId },
                data: { quantidade_disponivel: { decrement: data.quantidade_utilizada } }
            });
        }

        // 4. Recalcula OS
        await this.atualizarResumoOS(apontamentoAntigo.ordemServicoId);
        
        return atualizado;
    }

    async deletarApontamento(id: number): Promise<Apontamento> {
        const existe = await prisma.apontamento.findUnique({ where: { id } });
        if (!existe) throw new AppError("Apontamento não encontrado", 404);

        const deletado = await prisma.apontamento.delete({
            where: { id }
        });

        // Recalcula a OS (subtrai o tempo do que foi excluído)
        await this.atualizarResumoOS(existe.ordemServicoId);

        return deletado;
    }

    // --- A MÁGICA ACONTECE AQUI ---
    private async atualizarResumoOS(osId: number) {
        // Busca TODOS os apontamentos vinculados a esta OS
        const apontamentos = await prisma.apontamento.findMany({
            where: { ordemServicoId: osId },
            include: { usuario: true },
            orderBy: { inicio_trabalho: 'asc' } 
        });

        if (apontamentos.length === 0) {
            return; 
        }

        // 1. SOMA DO TEMPO
        const tempoTotal = apontamentos.reduce((acc, curr) => acc + (curr.tempo_execucao || 0), 0);

        // 2. DATAS REAIS
        const datasInicio = apontamentos.map(a => a.inicio_trabalho).filter(d => d !== null) as Date[];
        const datasFim = apontamentos.map(a => a.fim_trabalho).filter(d => d !== null) as Date[];
        
        datasInicio.sort((a, b) => a.getTime() - b.getTime());
        datasFim.sort((a, b) => a.getTime() - b.getTime());

        // CORREÇÃO 1: Garantir que não seja 'undefined'
        // Usamos '?? null' para converter qualquer undefined vindo do array em null pro Prisma
        const inicioReal = datasInicio.length > 0 ? (datasInicio[0] ?? null) : null; 
        const fimReal = datasFim.length > 0 ? (datasFim[datasFim.length - 1] ?? null) : null; 

        // 3. EXECUTANTE ATUAL
        const ultimoApontamento = apontamentos[apontamentos.length - 1]; 
        
        // CORREÇÃO 2: Uso de '?.' (Optional Chaining) e '??' (Nullish Coalescing)
        // Se ultimoApontamento for undefined, ou usuario for null, usa "Múltiplos"
        const nomeExecutante = ultimoApontamento?.usuario?.nome ?? "Múltiplos";

        // 4. ATUALIZAÇÃO DA OS
        await prisma.ordemServico.update({
            where: { id: osId },
            data: {
                tempo_total_execucao: tempoTotal,
                inicio_servico: inicioReal, // Agora é garantido Date | null
                fim_servico: fimReal,       // Agora é garantido Date | null
                executante: nomeExecutante
            }
        });
    }
}