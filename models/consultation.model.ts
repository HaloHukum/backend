import mongoose, { Schema } from "mongoose";

import { IConsultation } from "../interfaces/consultation.interface";

const consultationSchema: Schema<IConsultation> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    lawyerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    caseType: {
      type: String,
      required: true,
    },
    problemDescription: {
      type: String,
      required: true,
    },
    legalBasis: {
      type: String,
      required: true,
    },
    analysis: {
      type: String,
      required: true,
    },
    conclusionAndAdvice: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      required: true,
    },
    disclaimer: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "expired"],
    },
  },
  { timestamps: true }
);

const Consultation = mongoose.model<IConsultation>(
  "Consultation",
  consultationSchema
);
export default Consultation;
