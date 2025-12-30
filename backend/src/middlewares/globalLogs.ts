import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError"

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
