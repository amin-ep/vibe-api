import { Types } from 'mongoose';

interface IMusic extends Document {
  _id: string;
  name: string;
  coverImageUrl: string;
  audioFileUrl: string;

  artists: Types.ObjectId[];
  otherArtists: Types.ObjectId[];

  releaseYear: number;

  categories: string[];
  genre: string;

  likes: {
    _id: Types.ObjectId;
    music: Types.ObjectId;
    user: Types.ObjectId;
  }[];
}
