import mongoose, { Schema } from "mongoose";
import { ILawyer } from "../interfaces/lawyer.interface";

const lawyerSchema: Schema<ILawyer> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: null, // Allow null for bio
    },
    profilePicture: {
      type: String,
      required: true,
    },
    pricePerSession: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Lawyer = mongoose.model<ILawyer>("Lawyer", lawyerSchema);
export default Lawyer;
