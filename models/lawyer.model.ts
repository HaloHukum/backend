import mongoose, { Schema } from "mongoose";
import { ILawyer } from "../interfaces/lawyer.interface";

const lawyerSchema: Schema<ILawyer> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    firmName: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    certifications: {
      type: [String],
      default: [],
    },
    education: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    totalConsults: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Lawyer = mongoose.model<ILawyer>("Lawyer", lawyerSchema);
export default Lawyer;
