import { Types } from 'mongoose';

interface IMessage extends Document {
  _id: string;
  from: Types.ObjectId;
  to: Types.ObjectId;

  text: string;
  nameIsHidden: boolean;
}
