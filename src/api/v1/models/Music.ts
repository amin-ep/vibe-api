import mongoose, { Query, Schema } from 'mongoose';
import { IMusic } from '../types/Music.js';

const musicSchema = new Schema<IMusic>(
  {
    name: String,
    audioFileUrl: String,
    coverImageUrl: String,

    artist: {
      ref: 'Artist',
      type: Schema.Types.ObjectId,
    },

    otherArtists: [{ ref: 'Artist', type: Schema.Types.ObjectId }],

    releaseYear: {
      type: Number,
    },
    categories: {
      type: [String],
    },
    genre: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

musicSchema.pre(/^find/, function (this: Query<IMusic[], IMusic>, next) {
  this.populate({
    path: 'artist',
    select: 'name',
  });
  next();
});

export default mongoose.model('Music', musicSchema);
