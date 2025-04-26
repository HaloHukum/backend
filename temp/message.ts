import mongoose, { Schema } from "mongoose";
import { IMessage } from "./message.interface";

const messageSchema: Schema<IMessage> = new Schema({
  consultationId: {
    type: Schema.Types.ObjectId,
    ref: "Consultation",
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    required: true, // Can reference users or lawyers
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  attachmentUrl: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
