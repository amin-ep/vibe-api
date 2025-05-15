import { z } from 'zod';
import { stringSchema } from './index.js';
import mongoose from 'mongoose';

const text = stringSchema('Text', 1, 500);
const nameIsHidden = z.boolean().optional();
const from = z.object({
  from: z.custom<mongoose.Types.ObjectId>(),
});

const to = z.object({
  to: z.custom<mongoose.Types.ObjectId>(),
});

const validateCreateMessage = z.object({
  from,
  text,
  nameIsHidden,
  to,
});

const validateUpdateMessage = z.object({
  text: text.optional(),
});

export { validateCreateMessage, validateUpdateMessage };
