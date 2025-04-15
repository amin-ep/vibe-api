import { Types } from 'mongoose';

interface IPlaylist extends Document {
  _id: string;
  title: string;
  musics: Types.ObjectId[];
  user: Types.ObjectId;
}
