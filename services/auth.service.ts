import {
  AuthResponse,
  LoginData,
  RegisterData,
} from "../interfaces/auth.interface";
import { loginSchema, registerSchema } from "../interfaces/user.interface";
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { signToken } from "../utils/jwt.util";
import { otpService } from "./otpService";
// import { twilioService } from "./twilioService";

export default class AuthService {
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const parsed = registerSchema.safeParse(userData);
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

  static async login(credentials: LoginData): Promise<AuthResponse> {
    const parsed = loginSchema.safeParse(credentials);
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

    // Check if user has a phone number
    if (!user.phone) {
      throw new Error(
        JSON.stringify({
          phone: [
            "Phone number not found. Please update your profile with a valid phone number.",
          ],
        })
      );
    }

    try {
      // Generate and store OTP
      await otpService.sendOTP(email);
      // console.log(otp,  "<<< dari otp service");
      

      // Send OTP via SMS
      // await twilioService.sendSMS(
      //   user.phone,
      //   `Your HalloHukum verification code is: ${otp}. This code will expire in 5 minutes.`
      // );

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

  static async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
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
    return { access_token };
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

  static async updateMe(userId: string, updateData: Partial<RegisterData>) {
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
