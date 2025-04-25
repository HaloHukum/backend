import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
