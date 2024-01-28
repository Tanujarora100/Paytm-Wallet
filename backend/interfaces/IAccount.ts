import { Document } from "mongoose";
interface IAccount extends Document {
  id: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export default IAccount;
