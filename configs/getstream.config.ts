const StreamChat = require("stream-chat").StreamChat;

export const serverClient = StreamChat.getInstance(
  process.env.GETSTREAM_API_KEY,
  process.env.GETSTREAM_API_SECRET
);