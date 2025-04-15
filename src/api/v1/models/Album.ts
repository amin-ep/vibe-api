import mongoose, { Schema } from 'mongoose';
import { IAlbum } from '../types/Album';

const albumSchema = new Schema<IAlbum>(
  {
    name: {
      type: String,
      index: true,
    },
    artist: { ref: 'Artist', type: Schema.Types.ObjectId },
    releaseYear: {
      type: Number,
      index: true,
    },
    musics: [
      {
        ref: 'Music',
        type: Schema.Types.ObjectId,
      },
    ],
    coverImageUrl: String,
    otherArtists: [{ ref: 'Artist', type: Schema.Types.ObjectId }],
    categories: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Album', albumSchema);
