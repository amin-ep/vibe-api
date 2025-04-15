import { z } from 'zod';
import { categories, stringSchema } from './index.js';

const name = stringSchema('Name', 2, 40);
const coverImageUrl = z
  .string({
    required_error: 'Cover image URL is required.',
    invalid_type_error: 'Cover image URL must be a string.',
  })
  .url('Cover image must be a valid URL.');

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

const artist = z
  .string({
    required_error: 'Artist name is required.',
    invalid_type_error: 'Artist name must be a string.',
  })
  .min(1, "Artist name can't be empty.");

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
  artist,
  otherArtists: otherArtists.optional(),
  categories,
});

const validateUpdateAlbum = z.object({
  name: name.optional(),
  coverImageUrl: coverImageUrl.optional(),
  releaseYear: releaseYear.optional(),
  musics: musics.optional(),
  artist: artist.optional(),
  categories: categories.optional(),
  otherArtists: otherArtists.optional(),
});

export { validateCreateAlbum, validateUpdateAlbum };
