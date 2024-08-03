import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "../errors/AppError";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token Faltando", 401);
  }
  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      "02cd8a64aec17289151adef169db16bd",
    ) as IPayload;
    const usersRespository = new UsersRepository();
    const user = await usersRespository.findById(user_id);

    if (!user) {
      throw new AppError("O usuario não existe", 401);
    }

    next();
  } catch (error) {
    throw new AppError("Token invalido!", 401);
  }
}
