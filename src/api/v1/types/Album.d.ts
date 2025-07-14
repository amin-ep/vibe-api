import { Types } from 'mongoose';

interface IAlbum extends Document {
  _id: string;
  name: string;
  coverImageUrl: string;
  releaseYear: number;
  musics: Types.ObjectId[];
  artists: Types.ObjectId[];
  otherArtists: Types.ObjectId[];
  categories: string[];

  likes: {
    _id: Types.ObjectId;
    album: Types.ObjectId;
    user: Types.ObjectId;
  }[];
}
