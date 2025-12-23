import { JwtPayloadCustom } from "../types/jwt";

declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayloadCustom;
    }
  }
}

export {};
