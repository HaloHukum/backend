import { randomInt } from "crypto";
import redis from "../config/redis";
import { emailService } from "./emailService";

//interface OTPData
interface OTPData {
  email: string;
  otp: string;
  expiresAt: Date;
}

class OTPService {
  private readonly OTP_PREFIX = "otp:";
  private readonly OTP_EXPIRY = 300; // 5 minutes in seconds

  public generateOTP(): string {
    return randomInt(100000, 999999).toString();
  }

  async sendOTP(email: string): Promise<string> {
    const otp = this.generateOTP();
    const otpData: OTPData = {
      email,
      otp,
      expiresAt: new Date(Date.now() + this.OTP_EXPIRY * 1000),
    };

    // Store OTP in Redis
    const key = `${this.OTP_PREFIX}${email}`;
    await redis.setex(key, this.OTP_EXPIRY, JSON.stringify(otpData));

    // Send OTP via email
    await emailService.sendOTPEmail(email, otp);

    return otp;
  }

  async getOTP(email: string): Promise<OTPData | null> {
    const key = `${this.OTP_PREFIX}${email}`;
    const data = await redis.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as OTPData;
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const otpData = await this.getOTP(email);

    if (!otpData) {
      return false;
    }

    if (otpData.expiresAt < new Date()) {
      await this.deleteOTP(email);
      return false;
    }

    if (otpData.otp !== otp) {
      return false;
    }

    await this.deleteOTP(email);
    return true;
  }

  private async deleteOTP(email: string): Promise<void> {
    const key = `${this.OTP_PREFIX}${email}`;
    await redis.del(key);
  }
}

export const otpService = new OTPService();
