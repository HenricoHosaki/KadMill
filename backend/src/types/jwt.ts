export interface JwtPayloadCustom {
  id: number;
  funcao: 'ADMIN' | 'GERENTE' | 'OPERADOR';
}