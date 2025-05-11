import { serverClient } from "../configs/getstream.config";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../interfaces/auth.interface";
import {
  loginValidation,
  registerValidation,
} from "../interfaces/auth.interface";
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { signToken } from "../utils/jwt.util";

export default class AuthService {
  static async register(userData: RegisterPayload): Promise<RegisterResponse> {
    const parsed = registerValidation.safeParse(userData);
    if (!parsed.success) {
      throw new Error(JSON.stringify(parsed.error.flatten().fieldErrors));
    }

    const {
      fullName,
      phone,
      email,
      password,
      dateOfBirth,
      city,
      gender,
      role,
    } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error(JSON.stringify({ email: ["Email already exists"] }));
    }

    const user = await User.create({
      fullName,
      phone,
      email,
      password: hashPassword(password),
      dateOfBirth,
      city,
      gender,
      role: role || "client",
    });

    return {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }

  static async login(credentials: LoginPayload): Promise<LoginResponse> {
    const parsed = loginValidation.safeParse(credentials);
    if (!parsed.success) {
      throw new Error(JSON.stringify(parsed.error.flatten().fieldErrors));
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email/password");
    }

    const isValidatePassword = comparePassword(password, user.password);
    if (!isValidatePassword) {
      throw new Error("Invalid email/password");
    }

    const access_token = signToken({ id: user._id });
    const chatToken = serverClient.createToken(user._id.toString());

    // Upsert user in GetStream
    await serverClient.upsertUser({
      id: user._id.toString(),
      name: user.fullName,
      role: user.role,
    });

    return {
      access_token,
      token_type: "Bearer",
      chat_token: chatToken,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      city: user.city,
      gender: user.gender,
      role: user.role,
    };
  }

  static async updateMe(userId: string, updateData: Partial<RegisterPayload>) {
    // Remove sensitive fields that shouldn't be updated
    delete updateData.password;
    delete updateData.role;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return {
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      dateOfBirth: updatedUser.dateOfBirth,
      city: updatedUser.city,
      gender: updatedUser.gender,
      role: updatedUser.role,
    };
  }
}
