import { z } from 'zod';
import { categories, stringSchema } from './index.js';

const name = stringSchema('Name', 1, 40);
const coverImageUrl = z.string({
  required_error: 'Cover image is required',
  invalid_type_error: 'Cover image should be a string value',
});

const releaseYear = z
  .number({
    required_error: 'Release year is required.',
    invalid_type_error: 'Release year must be a number.',
  })
  .int('Release year must be an integer.')
  .min(1900, 'Release year must be after 1900.')
  .max(new Date().getFullYear(), "Release year can't be in the future.");

const musics = z
  .array(
    z.string({
      required_error: 'Each music title must be a string.',
      invalid_type_error: 'Each music title must be a string.',
    })
  )
  .nonempty('At least one music must be included.');

const artists = z.array(z.string(), {
  invalid_type_error: 'Artists field should be an array of string',
});

const otherArtists = z.array(
  z.string({
    required_error: 'Each artist name must be a string.',
    invalid_type_error: 'Each artist name must be a string.',
  })
);

const validateCreateAlbum = z.object({
  name,
  coverImageUrl,
  releaseYear,
  musics,
  artists,
  otherArtists: otherArtists.optional(),
  categories,
});

const validateUpdateAlbum = z.object({
  name: name.optional(),
  coverImageUrl: coverImageUrl.optional(),
  releaseYear: releaseYear.optional(),
  musics: musics.optional(),
  artists: artists.optional(),
  categories: categories.optional(),
  otherArtists: otherArtists.optional(),
});

export { validateCreateAlbum, validateUpdateAlbum };
