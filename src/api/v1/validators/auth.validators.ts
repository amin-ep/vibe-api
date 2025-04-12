import z from 'zod';

const stringSchema = (fieldName: string, min: number, max: number) =>
  z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} should be a string value`,
    })
    .min(min, {
      message: `${fieldName} should be at least ${min} characters`,
    })
    .max(max, {
      message: `${fieldName} should be ${max} or less characters`,
    });

const firstName = stringSchema('First name', 2, 30);
const lastName = stringSchema('Last name', 2, 30);
const username = stringSchema('Username', 4, 30);
const email = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email should be a string value',
  })
  .email({
    message: 'Please provide a valid email address',
  });
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
    email,
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
  email,
  verificationCode,
});

const validateForgetPassword = z.object({
  email,
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
