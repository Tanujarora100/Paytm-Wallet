import mongoose, { Schema } from "mongoose";
import IUser from "../interfaces/IUser";


const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 6,
    maxlength: 20,
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

export default mongoose.model<IUser>("User", userSchema);
