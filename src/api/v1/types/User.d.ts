interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;

  role: 'admin' | 'owner' | 'user';

  password: string;
  verifyPassword: (inputPassword: string) => boolean;

  active: boolean;

  verified: boolean;
  verificationCode?: string;
  verificationCodeExpiryDate?: Date | string;
  verifyInputVerificationCode: (inputCode: string) => boolean;
  generateVerificationCode: () => string;

  generateRecoverId: () => string;
  passwordRecoverId?: string;
  passwordChangedAt?: Date | string;

  checkPasswordChangedTime: (inputTime: number) => boolean;
}
