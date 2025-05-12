import { NextFunction,Request } from "express";

export function logger(
  req: Request,
  next: NextFunction
): void {
  console.info(req.method, req.url);
  next();
}
