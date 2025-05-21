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
    problemDescription: {
      type: String,
      required: true,
    },
    method: {
      type: String,
    },
    legalBasis: {
      type: String,
    },
    analysis: {
      type: String,
    },
    conclusionAndAdvice: {
      type: String,
    },
    chatId: {
      type: String,
    },
    disclaimer: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
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
