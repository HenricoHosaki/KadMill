import { Usuario } from '@prisma/client';
import { Request, Response, NextFunction} from 'express';
import { redis } from "../config/redis"
import jwt from 'jsonwebtoken';
import { JwtPayloadCustom } from '../types/jwt';

/**
 * Realizar o logout do usuário revogando o token JWT
 * Calcula o tempo de expiração restante e armazena o token no Redis (Blacklist) 
 * para impedir seu uso até que expire naturalmente.
 * @param req - Request contendo Header Authorization (Bearer Token).
 * @throws {401} Se o token não for fornecido ou mal endereçado
 * @throws {400} Caso o token seja inválido
 */
export async function verificarListaRedis(req: Request, res: Response) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
  return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
  return res.status(401).json({ error: "Token malformado"});
  }

  const decoded = jwt.decode(token) as { exp: number };

  if (!decoded || typeof decoded !== "object" || !("exp" in decoded)) {
  return res.status(400).json({ error: "Token inválido" });
  }

  const tempoRestante = decoded.exp - Math.floor(Date.now() / 1000);

  if (tempoRestante > 0) {
    await redis.setex(token, tempoRestante, "blacklisted");
  }
  return res.status(200).json({ message: "Logout realizado" });
}

/**
 * Autenticar o Token enviado pelo usuário liberando acesso das rotas
 * @param req - Request contendo Header Authorization (Bearer Token)
 * @throws {401} Se o token for ausente, malformado, revogado ou expirado.
 * @throws {500} Em caso de falhas críticas de infraestrutura.
 * @returns - Retorna next() para avançar para o acesso do sistema caso validado
 * @notes - verifica se o Token está na lista do Redis antes de liberar
 */
export async function autenticadorMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");
  
  if (!token) {
    return res.status(401).json({ error: "Token malformado" });
  }

  try {
    const tokenBlacklisted = await redis.get(token);

    if (tokenBlacklisted) {
      return res.status(401).json({ error: "Token revogado" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayloadCustom;

    req.usuario = {
      id: decoded.id,
      funcao: decoded.funcao,
    };

    return next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Sessão expirada", message: "Faça login novamente." });
    }

    console.error("DEBUG - Erro no Middleware:", error.message);
    return res.status(500).json({ error: "Erro interno", message: error.message });
  }
}

/**
 * Valida funcao Admin nas rotas de Administração
 * @param req - Request contendo Header Authorization (Bearer Token)
 * @throws {401} Se o usuário não tiver função Administrador
 * @throws {403} Se o acesso para o usuário for restrito
 * @returns - Retorna next() se validação for verdadeiro
 */
export function apenasAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.usuario) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (req.usuario.funcao !== 'ADMIN') {
    return res.status(403).json({ error: "Acesso negado" });
  }

  return next();
}