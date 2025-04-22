import mongoose from 'mongoose';
import { Message } from '../types/message';

const messageSchema = new mongoose.Schema<Message>({
  sender: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const MessageModel = mongoose.model<Message>('Message', messageSchema);