import { Document } from "mongoose";
interface IAccount extends Document {
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export default IAccount;
