import mongoose, { Schema } from 'mongoose';

const artistSchema = new Schema<IArtist>(
  {
    name: String,
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Artist', artistSchema);
