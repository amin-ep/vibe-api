import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import moment from 'moment';
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

userSchema.methods.generateVerificationCode = async function () {
  const num: number = Math.floor(
    Math.random() * (999999 - 100000 + 1) + 100000
  );
  this.verificationCode = num.toString();
  this.verificationCodeExpiryDate = moment(new Date()).add(30, 'minutes');

  return this.verificationCode;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('verificationCode')) return next();

  if (this.verificationCode)
    this.verificationCode = await bcrypt.hash(this.verificationCode, 10);

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

userSchema.methods.verifyInputVerificationCode = function (inputCode: string) {
  return bcrypt.compare(inputCode, this.verificationCode);
};

userSchema.methods.generateRecoverId = async function () {
  return (this.passwordRecoverId = uuid());
};

export default mongoose.model('User', userSchema);
