import { z } from 'zod';
import { stringSchema } from './index.js';

const title = stringSchema('Title', 3, 30);
const user = z.string();
const musics = z.array(z.string());

const validateCreatePlaylist = z.object({
  title,
  user,
  musics,
});

const validateUpdatePlaylist = z.object({
  title: title.optional(),
  musics: title.optional(),
});

export { validateUpdatePlaylist, validateCreatePlaylist };
