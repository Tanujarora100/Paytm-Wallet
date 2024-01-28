import mongoose, { Schema } from "mongoose";
import IUser from "../interfaces/IUser";
import Account from "./Account";
import bcrypt from "bcrypt";
import { NextFunction } from "express";
import logger from "../config/logger";

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 6,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  firstname: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  lastname: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
});
userSchema.methods.hashPassword = function (password: string) {
  const saltRounds: number = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};
userSchema.pre("deleteOne", function (next: NextFunction) {
  const user = this as unknown as IUser;
  Account.findOne({ userId: user._id })
    .then((account) => {
      if (account) {
        Account.deleteOne({ userId: user._id });
      }
      next();
    })
    .catch(() => {
      logger.info("Error while deleting account");
    });
});

userSchema.pre("save", function (next: NextFunction) {
  const user = this as IUser;
  user.password = user.hashPassword(user.password);
  user.updatedAt = new Date();
  Account.create({
    userId: user._id,
    balance: Math.floor(Math.random() * (1000 - 1 + 1)) + 1000,
  });
  next();
});

userSchema.methods.comparePassword =  function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
