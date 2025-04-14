import { z } from 'zod';
import { stringSchema } from './index.js';

const name = stringSchema('Name', 4, 30);

const imageUrl = z.string({
  invalid_type_error: 'imageUrl should be string value',
});

const validateCreateArtist = z.object({
  name,
  imageUrl: imageUrl.optional(),
});

const validateUpdateArtist = z
  .object({
    name: name.optional(),
    imageUrl: imageUrl.optional(),
  })
  .optional();

export { validateCreateArtist, validateUpdateArtist };
