import { z } from 'zod';
import { stringSchema } from './index.js';

const firstName = stringSchema('First name', 2, 30);
const lastName = stringSchema('Last name', 2, 30);
const username = stringSchema('Username', 4, 30);
const role = z.enum(['admin', 'user'], {
  message: 'Invalid input role. role must be admin or user value',
});
const active = z.boolean();

const validateUpdateMe = z.object({
  firstName: firstName.optional(),
  lastName: lastName.optional(),
  username: username.optional(),
});

const validateUpdatePassword = z.object({
  password: stringSchema('Password', 6, 14),
  currentPassword: stringSchema('Current Password', 6, 14),
});

const validateUpdateUser = z.object({
  firstName: firstName.optional(),
  lastName: lastName.optional(),
  username: username.optional(),
  role: role.optional(),
  active: active.optional(),
});

export { validateUpdateMe, validateUpdatePassword, validateUpdateUser };
