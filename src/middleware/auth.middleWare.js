import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const IsAuth = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;

  if (!token) {
    return next(new Error("TOKEN MISSING"));
  }

  try {
    const payload = jwt.verify(token, "secretKey");
    const user = await prisma.users.findUnique({ where: { id: payload.id } });
    if (!user) {
      return next(new Error("User not found"));
    }

    const tokenDB = await prisma.tokens.findFirst({ where: { token, is_valid: true } });
    if (!tokenDB) {
      return next(new Error("Token invalid!!!"));
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(new Error("Token verification failed"));
  }
});
