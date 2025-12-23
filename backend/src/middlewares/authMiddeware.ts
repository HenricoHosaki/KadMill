import { Request, Response, NextFunction} from 'express';
import { redis } from "../config/redis"
import jwt from 'jsonwebtoken';
import { JwtPayloadCustom } from '../types/jwt';

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

export async function autenticadorMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");
  
  if (!token) {
  return res.status(401).json({ error: "Token malformado" });
  }

  const tokenBlacklisted = await redis.get(token);

  if (tokenBlacklisted) {
  return res.status(401).json({ error: "Token revogado" });
  }

  try {
      const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
      ) as JwtPayloadCustom;

    req.usuario = {
      id: decoded.id,
      funcao: decoded.funcao,
    };

    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export function apenasAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.usuario) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (req.usuario.funcao !== 'ADMIN') {
    return res.status(403).json({ error: "Acesso negado" });
  }

  return next();
}