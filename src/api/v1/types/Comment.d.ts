import { Types } from 'mongoose';

interface IComment extends Document {
  _id: string;
  text: string;
  user: Types.ObjectId;
  album?: Types.ObjectId;
  music?: Types.ObjectId;
  published: boolean;
}
