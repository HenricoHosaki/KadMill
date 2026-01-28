import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError"

/**
 * Middleware global de tratamento de erros
 * Intercepta exceções lançadas em qualquer ponto da aplicação e formata a resposta HTTP
 * @param err - ErrorHandler recebe o parametro Error, Utiliza do objeto statusCode e message
 * @param req - ErrorHandler recebe o parametro Request
 * @param res - ErrorHandler recebe o parametro Response
 * @param next ErrorHandler recebe o parametro Next.
 * @returns - Retorna uma resposta JSON com o status code apropriado e 
 * a mensagem de erro.
 * @throws {500} - Caso não instancie AppError
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  return res.status(500).json({
    message: 'Erro interno do servidor'
  });
}
