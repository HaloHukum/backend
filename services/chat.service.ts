import { serverClient } from "../configs/getstream.config";

export default class ChatService {
  static async createChannel(clientId: string, lawyerId: string) {
    if (!clientId || !lawyerId) {
      throw new Error("clientId and lawyerId are required");
    }

    // await serverClient.upsertUsers([
    //   { id: clientId },
    //   { id: lawyerId },
    // ]);

    const channelId = `${clientId}_${lawyerId}`;

    const channel = serverClient.channel("messaging", channelId, {
      members: [clientId, lawyerId],
      name: `Consultation: ${clientId} & ${lawyerId}`,
      created_by_id: "test",
    });

    const state = await channel.query();

    return {
      channelId,
      name: state.data.name,
      members: state.state.members,
    };
  }
}
