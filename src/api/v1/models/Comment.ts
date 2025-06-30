import mongoose, { Schema } from 'mongoose';
import { IComment } from '../types/Comment';

const commentSchema = new Schema<IComment>(
  {
    text: String,
    user: {
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
    album: {
      ref: 'Album',
      type: Schema.Types.ObjectId,
    },
    music: {
      ref: 'Music',
      type: Schema.Types.ObjectId,
    },
    published: {
      default: false,
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
