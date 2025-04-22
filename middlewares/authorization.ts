import { Request, Response, NextFunction } from "express";
// import { Consultation, User } from "../models";

export async function authorization(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;

    // ! Response (404 - Not Found)
    // const consultation = await Consultation.findById(id);
    // if (!consultation) {
    //   throw { name: "NotFound", message: "Consultation not found" };
    // }

    // ! Response (403 - Forbidden)
    // if (userId.toString() !== consultation.receiverId.toString()) {
    //   throw { name: "Forbidden", message: "You are not authorized" };
    // }

    next();
  } catch (err) {
    next(err);
  }
}
