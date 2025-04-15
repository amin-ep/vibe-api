import mongoose, { Query, Schema } from 'mongoose';
import { IPlaylist } from '../types/Playlist.js';

const playlistSchema = new Schema<IPlaylist>(
  {
    title: String,
    musics: [{ type: Schema.Types.ObjectId, ref: 'Music' }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

playlistSchema.pre(
  /^find/,
  function (this: Query<IPlaylist[], IPlaylist>, next) {
    this.populate({
      path: 'musics',
    });
    next();
  }
);

export default mongoose.model('Playlist', playlistSchema);
