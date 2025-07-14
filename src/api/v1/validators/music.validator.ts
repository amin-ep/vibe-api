import { z } from 'zod';
import { categories, stringSchema } from './index.js';
import { genresArr } from '../../../core/utils/constants.js';

const name = stringSchema('name', 2, 35);

const audioFileUrl = z.string({
  required_error: 'Music audio is required',
  invalid_type_error: 'Music audio should be a string value',
});

const coverImageUrl = z.string({
  required_error: 'Cover image is required',
  invalid_type_error: 'Cover image should be a string value',
});

const artists = z.array(z.string(), {
  invalid_type_error: 'Artists field should be an array of string',
});

const otherArtists = z.array(z.string(), {
  invalid_type_error: 'Other artists field should be an array of string',
});

const releaseYear = z.number({
  required_error: 'Music release year is required',
  invalid_type_error: 'Release year should be a number value',
});

const genre = z.enum(genresArr);

const validateCreateMusic = z.object({
  name,
  audioFileUrl,
  coverImageUrl,
  artists,
  otherArtists: otherArtists.optional(),
  releaseYear,
  categories,
  genre,
});

const validateUpdateMusic = z.object({
  name: name.optional(),
  audioFileUrl: audioFileUrl.optional(),
  coverImageUrl: coverImageUrl.optional(),
  artists: artists.optional(),
  otherArtists: otherArtists.optional(),
  releaseYear: releaseYear.optional(),
  categories: categories.optional(),
});

export { validateCreateMusic, validateUpdateMusic };
