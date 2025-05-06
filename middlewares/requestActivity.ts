import { NextFunction,Request } from "express";

export function requestActivity(
  req: Request,
  next: NextFunction
): void {
  console.info(req.method, req.url);
  next();
}
