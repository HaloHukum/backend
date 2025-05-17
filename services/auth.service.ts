import { serverClient } from "../configs/getstream.config";
import {
  // RegisterResponse,
  // LoginResponse,
  LoginPayload,
  PostAuthResponse,
  PreAuthResponse,
  // PreLoginResponse,
  RegisterPayload,
} from "../interfaces/auth.interface";
import {
  loginValidation,
  registerValidation,
} from "../interfaces/auth.interface";
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { signToken } from "../utils/jwt.util";
import { otpService } from "./otpService";
// import { twilioService } from "./twilioService";

export default class AuthService {
  // Register flow
  static async register(userData: RegisterPayload): Promise<PreAuthResponse> {
    const parsed = registerValidation.safeParse(userData);
    if (!parsed.success) {
      throw new Error(JSON.stringify(parsed.error.flatten().fieldErrors));
    }

    const { email } = parsed.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error(JSON.stringify({ email: ["Email already exists"] }));
    }

    try {
      // Generate and send OTP
      await otpService.sendOTP(email);

      return {
        message: "OTP has been sent to your email",
        email: email,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to send OTP. Please try again later.");
      }
      throw error;
    }
  }

  // Login flow
  static async login(credentials: LoginPayload): Promise<PreAuthResponse> {
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

    try {
      // Generate and send OTP
      await otpService.sendOTP(email);

      return {
        message: "OTP has been sent to your email",
        email: email,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to send OTP. Please try again later.");
      }
      throw error;
    }
  }

  // Verify OTP for registration
  static async verifyRegisterOTP(
    email: string,
    otp: string,
    userData: RegisterPayload
  ): Promise<PostAuthResponse> {
    if (!email || !otp) {
      throw new Error(
        JSON.stringify({
          otp: ["Email and OTP are required"],
        })
      );
    }

    const isValidOTP = await otpService.verifyOTP(email, otp);
    if (!isValidOTP) {
      throw new Error("Invalid or expired OTP");
    }

    const parsed = registerValidation.safeParse({ ...userData, email });
    if (!parsed.success) {
      throw new Error(JSON.stringify(parsed.error.flatten().fieldErrors));
    }

    const { fullName, phone, password, dateOfBirth, city, gender, role } =
      parsed.data;

    // Create new user
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

    // Create GetStream user
    const chatToken = serverClient.createToken(user._id.toString());
    await serverClient.upsertUser({
      id: user._id.toString(),
      name: user.fullName,
      // role: user.role,
    });

    const access_token = signToken({ id: user._id });
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

  // Verify OTP for login
  static async verifyLoginOTP(
    email: string,
    otp: string
  ): Promise<PostAuthResponse> {
    if (!email || !otp) {
      throw new Error(
        JSON.stringify({
          otp: ["Email and OTP are required"],
        })
      );
    }

    const isValidOTP = await otpService.verifyOTP(email, otp);
    if (!isValidOTP) {
      throw new Error("Invalid or expired OTP");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
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
