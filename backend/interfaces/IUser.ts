import { Document } from "mongoose";
interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;
