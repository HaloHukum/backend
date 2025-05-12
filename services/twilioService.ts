import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhone) {
  throw new Error("Missing Twilio configuration");
}

const client = twilio(accountSid, authToken);

export const twilioService = {
  async sendSMS(to: string, message: string): Promise<void> {
    try {
      await client.messages.create({
        body: message,
        from: twilioPhone,
        to: to,
      });
    } catch (error) {
      console.error("Twilio SMS error:", error);
      throw new Error("Failed to send SMS");
    }
  },
};
