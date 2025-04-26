import mongoose, { Schema } from "mongoose";
import { IConsultation } from "../interfaces/consultation.interface";

const consultationSchema: Schema<IConsultation> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lawyerId: {
      type: Schema.Types.ObjectId,
      ref: "Lawyer",
      required: true,
    },
    method: {
      type: String,
      enum: ["chat", "call", "video"],
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "canceled"],
      required: false,
      default: "scheduled",
    },
    scheduledTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Consultation = mongoose.model<IConsultation>(
  "Consultation",
  consultationSchema
);
export default Consultation;
