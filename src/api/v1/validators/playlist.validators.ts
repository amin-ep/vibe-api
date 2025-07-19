import { z } from 'zod';
import { stringSchema } from './index.js';

const title = stringSchema('Title', 3, 30);
const user = z.string();
const musics = z.array(z.string());
const isPublic = z.boolean().optional();

const validateCreatePlaylist = z.object({
  title,
  user,
  musics,
  isPublic,
});

const validateUpdatePlaylist = z.object({
  title: title.optional(),
  musics: title.optional(),
  isPublic,
});

export { validateUpdatePlaylist, validateCreatePlaylist };
