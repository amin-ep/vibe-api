import mongoose, { Query, Schema } from 'mongoose';
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

albumSchema.virtual('likes', {
  ref: 'Like',
  foreignField: 'music',
  localField: '_id',
});

albumSchema.virtual('likeQuantity').get(function () {
  if (this.likes) {
    return this.likes.length;
  } else {
    return 0;
  }
});

albumSchema.pre(/^find/, function (this: Query<IAlbum, IAlbum[]>, next) {
  this.populate({
    path: 'artist',
    select: 'name',
  })
    .populate({
      path: 'musics',
      select:
        'name audioFileUrl releaseYear coverImageUrl otherArtists categories genre likeQuantity',
    })
    .populate({
      path: 'otherArtists',
      select: 'name',
    })
    .populate({
      path: 'likes',
      select: '_id user',
    });
  next();
});

export default mongoose.model('Album', albumSchema);
