import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/jwt";
// import { User } from "../models";

export async function authentication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    const [type, token] = bearerToken.split(" ");
    if (!token) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    const data = verifyToken(token) as { id: number };
    // const user = await User.findByPk(data.id);

    // if (!user) {
    //   throw { name: "Unauthorized", message: "Invalid token" };
    // }

    // req.user = user;

    next();
  } catch (err) {
    next(err);
  }
}
