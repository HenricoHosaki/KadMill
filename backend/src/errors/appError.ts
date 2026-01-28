/**
 * Classe customizada para tratamento de exceções operacionais.
 * Extende a classe nativa Error para permitir o lançamento de erros com status HTTP específicos.
 * @param message - Mensagem descritiva do erro.
 * @param statusCode - Código de status HTTP (padrão 400 - Bad Request).
 * @notes Readonly garante a integridade do statusCode, impedindo de ser alterado
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}