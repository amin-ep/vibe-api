import mongoose from 'mongoose';
import { z } from 'zod';

const music = z.object({
  music: z.custom<mongoose.Types.ObjectId>(),
});
const user = z.object({
  user: z.custom<mongoose.Types.ObjectId>(),
});

const album = z.object({
  album: z.custom<mongoose.Types.ObjectId>(),
});

const validateToggleLike = z.object({
  music: music.optional(),
  user,
  album: album.optional(),
});

export { validateToggleLike };
