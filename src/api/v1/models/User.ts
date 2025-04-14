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

    passwordChangedAt: Date,
    passwordRecoverId: String,

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

userSchema.methods.verifyInputVerificationCode = function (
  variation: Variation,
  inputCode: string
) {
  if (variation === 'auth')
    return bcrypt.compare(inputCode, this.verificationCode);

  if (variation === 'updateEmail')
    return bcrypt.compare(inputCode, this.updateEmailVerificationCode);
};

userSchema.methods.generateRecoverId = async function () {
  return (this.passwordRecoverId = uuid());
};

export default mongoose.model('User', userSchema);
