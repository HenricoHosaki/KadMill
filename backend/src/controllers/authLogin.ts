import { Request, Response } from "express"
import { compare } from "bcrypt-ts"
import jwt from "jsonwebtoken"
import { Login } from "../services/authLogin"
import { JwtPayloadCustom } from "../types/jwt"

const loginService = new Login()

export class AuthController {

  async login(req: Request, res: Response) {
    try{
    const { id, senha } = req.body

    if (!id || !senha) {
    res.status(400).json({ message: "Dados inválidos" });
    return;
    }
    const usuario = await loginService.findById(Number(id))

    if (!usuario) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" })
    }

    const senhaValida = await compare(senha, usuario.senha)

    if (!senhaValida) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" })
    }

    const payload: JwtPayloadCustom = {
    id: usuario.id,
    funcao: usuario.funcao,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      {expiresIn:Number(process.env.TOKEN_EXPIRE)}
    )

    return res.status(200).json({ token })
  }catch (err) {
  console.error("Erro detalhado no Login:", err); // Adicione esta linha
  return res.status(500).json({
    error: "Erro interno do servidor"
    });
  }
  }
}