import z from 'zod';
import { email, stringSchema } from './index.js';

const firstName = stringSchema('First name', 2, 30);
const lastName = stringSchema('Last name', 2, 30);
const username = stringSchema('Username', 4, 30);

const password = stringSchema('Password', 6, 14);
const verificationCode = stringSchema('Verification Code', 6, 6);

const validateRegister = z.object({
  firstName: firstName.optional(),
  lastName: lastName.optional(),
  email: email,
  username: username,
  password: password,
});

const validateLoginWithEmail = z.object(
  {
    email: email,
    password,
  },
  {
    required_error: 'Register Payload is required',
  }
);

const validateLoginWithUsername = z.object(
  {
    username,
    password,
  },
  {
    required_error: 'Login Payload is required',
  }
);

const validateVerifyEmail = z.object({
  email: email,
  verificationCode,
});

const validateForgetPassword = z.object({
  email: email,
});

const validateResetPassword = z.object({
  password,
});

export {
  validateRegister,
  validateLoginWithEmail,
  validateLoginWithUsername,
  validateVerifyEmail,
  validateForgetPassword,
  validateResetPassword,
};
