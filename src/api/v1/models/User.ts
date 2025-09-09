import bcrypt from 'bcryptjs';
import moment from 'moment';
import mongoose, { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      index: true,
    },
    username: {
      unique: true,
      type: String,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['admin', 'owner', 'user'],
      default: 'user',
    },
    imageUrl: {
      type: String,
    },
    password: {
      type: String,
    },

    active: {
      type: Boolean,
      default: true,
    },

    verified: {
      default: false,
      type: Boolean,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpiryDate: {
      type: Date,
    },
    verifiedAt: Date,

    passwordChangedAt: Date,
    passwordRecoverId: String,
    passwordRecoverIdExpiresAt: Date,

    updateEmailVerificationCode: String,
    updateEmailVerificationCodeExpiryDate: Date,
    emailChangedAt: Date,
    candidateEmail: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.generateVerificationCode = async function (
  variation: 'auth' | 'updateEmail'
) {
  const num: string = Math.floor(
    Math.random() * (999999 - 100000 + 1) + 100000
  ).toString();
  const expires = moment(new Date()).add(30, 'minutes');

  switch (variation) {
    case 'auth': {
      this.verificationCode = num;
      this.verificationCodeExpiryDate = expires;
      return this.verificationCode;
    }

    case 'updateEmail': {
      this.updateEmailVerificationCode = num;
      this.updateEmailVerificationCodeExpiryDate = expires;
      return this.updateEmailVerificationCode;
    }

    default:
      throw new Error('Unknown variation');
  }
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('verificationCode')) return next();

  if (this.verificationCode)
    this.verificationCode = await bcrypt.hash(this.verificationCode, 10);

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('updateEmailVerificationCode')) return next();

  if (this.updateEmailVerificationCode)
    this.updateEmailVerificationCode = await bcrypt.hash(
      this.updateEmailVerificationCode,
      10
    );

  next();
});

userSchema.methods.checkPasswordChangedTime = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.verifyPassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.verifyInputVerificationCode = async function (
  variation: Variation,
  inputCode: string
) {
  const currentTime = Date.now();
  const codeExpiryTime = new Date(
    this.verificationCodeExpiryDate as string
  ).getTime();
  const expired = currentTime > codeExpiryTime;

  let targetCode: string | null = null;

  if (variation === 'auth') {
    targetCode = this.verificationCode;
  } else if (variation === 'updateEmail') {
    targetCode = this.verificationCodeExpiryDate;
  }

  return (await bcrypt.compare(inputCode, targetCode as string)) && !expired;
};

userSchema.methods.generateRecoverId = async function () {
  const expires = moment(new Date()).add(30, 'minutes');
  this.passwordRecoverIdExpiresAt = expires;
  return (this.passwordRecoverId = uuid());
};

export default mongoose.model('User', userSchema);
