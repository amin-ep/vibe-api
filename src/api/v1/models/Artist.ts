import mongoose, { Query, Schema } from 'mongoose';

const artistSchema = new Schema<IArtist>(
  {
    name: String,
    imageUrl: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

artistSchema.virtual('musics', {
  ref: 'Music',
  foreignField: 'artist',
  localField: '_id',
});
artistSchema.virtual('albums', {
  ref: 'Album',
  foreignField: 'artist',
  localField: '_id',
});

artistSchema.pre('findOne', function (this: Query<IArtist[], IArtist>, next) {
  this.populate({
    path: 'musics',
    select:
      'name audioFileUrl coverImageUrl otherArtists releaseYear categories genre',
  }).populate({
    path: 'albums',
    select: 'name coverImageUrl',
  });
  next();
});

export default mongoose.model('Artist', artistSchema);
