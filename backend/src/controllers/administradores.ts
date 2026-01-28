import { AdministradorService } from './../services/administradores';
import { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';
const administradorService = new AdministradorService();

/**
 * Controller responsável pelo controle de Usuários
 * Gerencia as requisições para criação, listagem, edição e exclusão de Usuário
 */
export class AdministradorController {

    async pegarTodosUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await administradorService.pegarTodosUsuarios();
 
            return res.status(200).json(usuarios);
        } catch (err) {
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    async pegarUsuarioPorId(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const usuario = await administradorService.pegarUsuarioPorId(idConvertido);

            if(!usuario){
                return res.status(404).json({
                    messsage: "Usuário não encontrado"
                })
            }

            return res.status(200).json(usuario)
        }catch(err){
            return res.status(500).json({
                message: "Erro ao encontrar ID de usuário"
            })
        }
    }

    async criarUsuario(req: Request, res: Response) {
        try{
            const usuario = req.body
            const usuarioCriado = await administradorService.criarUsuario(usuario)

            if(!usuarioCriado){
                return res.status(400).json({
                    message: "Informações inválidas"
                })
            }

            return res.status(201).json({
                message: "Usuário registrado com sucesso"
            })
        }catch(err){
            res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async atualizarUsuario(req: Request, res: Response) {
        try{
            const { id } = req.params
            const usuario = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            const usuarioAtualizado = await administradorService.atualizarUsuario(idConvertido, usuario)

            if(!usuarioAtualizado){
                return res.status(404).json({
                    message: "Não foi possível atualizar o usuário"
                })
            }

            return res.status(200).json({
                message: "Usuário atualizado"
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async deletarUsuario(req: Request, res: Response) {
        try{
            const { id } = req.params
            const idConvertido = Number(id)
            
            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Não foi possível deletar o usuário"
                })
            }

            const usuarioDeletado = await administradorService.deletarUsuario(idConvertido)

            return res.status(200).json({
                message: "Usuário deletado com sucesso",
                usuario: usuarioDeletado
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async fazerBackup(req: Request, res: Response) {
        try {
            // -- Pega a URL do banco do arquivo .env -- //
            const dbUrl = process.env.DATABASE_URL;
            if (!dbUrl) {
                return res.status(500).json({ message: "Configuração de banco de dados não encontrada." });
            }

            res.setHeader('Content-Type', 'application/sql');
            res.setHeader('Content-Disposition', `attachment; filename=kadmill_backup_${new Date().toISOString().split('T')[0]}.sql`);

            // -- Executa o pg_dump diretamente no container -- //
            const pgDump = spawn('pg_dump', [dbUrl]);
            pgDump.stdout.pipe(res);

            pgDump.stderr.on('data', (data) => {
                console.error(`Erro no backup: ${data}`);
            });

            pgDump.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Processo de backup falhou com código ${code}`);
                }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao gerar backup" });
        }
    }
}
