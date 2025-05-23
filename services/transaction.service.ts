import Midtrans from "midtrans-client";

interface PaymentRequest {
  id: string;
  userId: string;
  consultationId: string;
  amount: number;
}

interface TransactionResponse {
  token: string;
  redirect_url: string;
}

export class TransactionService {
  private static snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SECRET as string,
    clientKey: process.env.MIDTRANS_PUBLIC_CLIENT as string,
  });
  static async createTransaction(
    payload: PaymentRequest
  ): Promise<TransactionResponse> {
    const { id, consultationId, amount } = payload;

    const parameter = {
      transaction_details: {
        order_id: id,
        gross_amount: amount,
      },
      item_details: [
        {
          id: consultationId,
          name: `Consultation ${consultationId}`,
          price: amount,
          // quantity: 1
        },
      ],
    };

    try {
      const token = await this.snap.createTransactionToken(parameter);
      return {
        token,
        redirect_url: "https://app.sandbox.midtrans.com/snap/snap.js",
      };
    } catch (error: any) {
      console.error("failed to create token: ", error.message);
      throw new Error("Failed to create transaction");
    }
  }
}
