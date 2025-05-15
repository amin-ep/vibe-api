import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types/Message.js';

const messageSchema = new Schema<IMessage>(
  {
    from: {
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
    to: {
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
    text: String,
    nameIsHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Message', messageSchema);
