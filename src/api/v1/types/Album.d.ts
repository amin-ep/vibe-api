import { Types } from 'mongoose';

interface IAlbum extends Document {
  _id: string;
  name: string;
  coverImageUrl: string;
  releaseYear: number;
  musics: Types.ObjectId[];
  artist: Types.ObjectId;
  otherArtists: Types.ObjectId[];
  categories: string[];
}
