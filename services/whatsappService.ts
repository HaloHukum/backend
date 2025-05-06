import twilio from "twilio";

class WhatsAppService {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<void> {
    try {
      const toNumber = `whatsapp:${phoneNumber}`;

      await this.client.messages.create({
        body: `Your OTP for login is: ${otp}. This OTP will expire in 5 minutes.`,
        from: this.fromNumber,
        to: toNumber,
      });
    } catch (error) {
      console.error("Error sending WhatsApp OTP:", error);
      throw new Error("Failed to send OTP via WhatsApp");
    }
  }
}

export const whatsappService = new WhatsAppService();
