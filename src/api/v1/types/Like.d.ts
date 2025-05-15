import { Types } from 'mongoose';

interface ILike extends Document {
  _id: string;
  music: Types.ObjectId;
  user: Types.ObjectId;
  album: Types.ObjectId;
}
