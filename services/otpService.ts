import nodemailer from "nodemailer";
import { randomInt } from "crypto";

//interface OTPData
interface OTPData {
  email: string;
  otp: string;
  expiresAt: Date;
}

class OTPService {
  public otpMap: Map<string, OTPData> = new Map();
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public generateOTP(): string {
    return randomInt(100000, 999999).toString();
  }

  async sendOTP(email: string): Promise<string> {
    const otp = this.generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes

    const otpData: OTPData = {
      email,
      otp,
      expiresAt,
    };

    this.otpMap.set(email, otpData);

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP for login is: ${otp}. This OTP will expire in 5 minutes.`,
      });

      return otp;
    } catch (error) {
      this.otpMap.delete(email);
      throw new Error("Failed to send OTP email");
    }
  }

  verifyOTP(email: string, otp: string): boolean {
    const otpData = this.otpMap.get(email);

    if (!otpData) {
      return false;
    }

    if (otpData.expiresAt < new Date()) {
      this.otpMap.delete(email);
      return false;
    }

    if (otpData.otp !== otp) {
      return false;
    }

    this.otpMap.delete(email);
    return true;
  }
}

export const otpService = new OTPService();
