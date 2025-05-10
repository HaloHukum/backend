import { serverClient } from "../configs/getstream.config";

export default class ChatService {

  // TODO: clientId and lawyerId should be existing users
  static async createChannel(clientId: string, lawyerId: string) {
    if (!clientId || !lawyerId) {
      throw new Error("clientId and lawyerId are required");
    }

    await serverClient.upsertUsers([
      {
        id: clientId,
        name: `Client ${clientId}`, 
      },
      {
        id: lawyerId,
        name: `Lawyer ${lawyerId}`, 
      },
    ]);

    const channelId = `${clientId}_${lawyerId}`;

    const newChannel = serverClient.channel("messaging", channelId, {
      name: `Consultation: ${clientId} & ${lawyerId}`,
      members: [clientId, lawyerId],
      created_by_id: "4645",
    });

    await newChannel.create()

    return {
      channelId,
      name: `Consultation: ${clientId} & ${lawyerId}`,
      members: [
        { id: clientId, role: "client" },
        { id: lawyerId, role: "lawyer" },
      ],
    };
  }
}
