import mongoose, { Schema } from "mongoose";
import { ILawyer } from "../interfaces/lawyer.interface";

const lawyerSchema: Schema<ILawyer> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  qualification: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  areas: {
    type: [String],
    required: true,
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  experience: {
    type: String,
    required: true,
    trim: true,
  },
  consultations: {
    type: Number,
    required: true,
    default: 0,
  },
  extraAreas: {
    type: Number,
    required: true,
    default: 0,
  },
  certificate: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  totalConsults: {
    type: Number,
    required: true,
    default: 0,
  },
  education: {
    type: String,
    required: true,
    trim: true,
  },
  about: {
    type: String,
    required: true,
    trim: true,
  },
  reviews: {
    type: [String],
    required: true,
    default: [],
  },
  status: {
    type: String,
    required: true,
    trim: true,
  },
});

const Lawyer = mongoose.model<ILawyer>("Lawyer", lawyerSchema);
export default Lawyer;
