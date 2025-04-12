import { z } from 'zod';
import { stringSchema } from '.';

const firstName = stringSchema('First name', 2, 30);
const lastName = stringSchema('Last name', 2, 30);
const username = stringSchema('Username', 4, 30);
const role = z.enum(['admin', 'user']);
const active = z.boolean();

const validateUpdateMe = z.object({
  firstName: firstName.optional(),
  lastName: lastName.optional(),
  username: username.optional(),
});

export { validateUpdateMe };
