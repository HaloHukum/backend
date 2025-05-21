import { serverClient } from "../configs/getstream.config";

export default class CallService {
  static async createCall(clientId: string, lawyerId: string) {
    if (!clientId || !lawyerId) {
      throw new Error("clientId and lawyerId are required");
    }

    // Ensure users exist in GetStream
    await serverClient.upsertUsers([
      {
        id: clientId,
        role: "client",
      },
      {
        id: lawyerId,
        role: "lawyer",
      },
    ]);

    // Create a unique call ID
    const callId = `call_${Date.now()}`;  

    return {
      callId,
    };
  }
}
