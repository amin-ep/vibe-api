import { z } from 'zod';
import { stringSchema } from './index.js';
import mongoose from 'mongoose';

const text = stringSchema('Text', 2, 200);
const user = z.object({
  user: z.custom<mongoose.Types.ObjectId>(),
});

const album = z.string({
  required_error: 'Each comment needs to have a album',
  invalid_type_error: 'Album should be object id of album',
});
const music = z.string({
  required_error: 'Each comment needs to have a music',
  invalid_type_error: 'Music should be object id of music',
});

const validateCreateComment = z.object({
  text,
  album: album.optional(),
  music: music.optional(),
  user,
});

export { validateCreateComment };
