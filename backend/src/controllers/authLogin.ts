import { Request, Response } from "express"
import { compare } from "bcrypt-ts"
import jwt from "jsonwebtoken"
import { Login } from "../services/authLogin"
import { JwtPayloadCustom } from "../types/jwt"
const loginService = new Login()

/**
 * Controller do Login
 */
export class AuthController {

  async login(req: Request, res: Response) {
    try{
    // -- RECEBE A SENHA E ID DO CORPO DA REQUISIÇÃO -- //
    const { id, senha } = req.body

    if (!id || !senha) {
    res.status(400).json({ message: "Dados inválidos" });
    return;
    }
    const usuario = await loginService.findById(Number(id))

    if (!usuario) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" })
    }

    // -- COMPARA A SENHA DO CORPO DA REQUISIÇÃO COM A DO BANCO DE DADOS -- //
    const senhaValida = await compare(senha, usuario.senha)

    if (!senhaValida) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" })
    }

    // -- CRIAMOS UM PAYLOAD CUSTOM QUE RECEBE ID E FUNÇÃO -- //
    const payload: JwtPayloadCustom = {
    id: usuario.id,
    funcao: usuario.funcao,
    };

    // -- JWT ASSINA O TOKEN -- //
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      {expiresIn:Number(process.env.TOKEN_EXPIRE)}
    )

    // -- SISTEMA RETORNA O TOKEN E O OBJETO USER -- //
    return res.status(200).json({ token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        funcao: usuario.funcao
      }
     })
  }catch (err) {
  console.error("Erro detalhado no Login:", err); // Adicione esta linha
  return res.status(500).json({
    error: "Erro interno do servidor"
    });
  }
  }
}