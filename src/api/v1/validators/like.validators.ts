import mongoose from 'mongoose';
import { z } from 'zod';

const music = z.object({
  music: z.custom<mongoose.Types.ObjectId>(),
});
const user = z.object({
  user: z.custom<mongoose.Types.ObjectId>(),
});

const validateToggleLike = z.object({
  music,
  user,
});

export { validateToggleLike };
