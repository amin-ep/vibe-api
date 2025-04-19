import mongoose, { Schema } from 'mongoose';
import { ILike } from '../types/Like.js';

const likeSchema = new Schema<ILike>(
  {
    music: { ref: 'Music', type: Schema.Types.ObjectId },
    user: { ref: 'User', type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

likeSchema.pre('find', function (next) {
  this.populate({
    path: 'music',
    select:
      'name audioFileUrl coverImageUrl artist otherArtists releaseYear genre',
  });
  next();
});

export default mongoose.model('Like', likeSchema);
