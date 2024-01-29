import IAccount from "../interfaces/IAccount";
import mongoose from "mongoose";
/*
However, it doesn't enforce or dictate the exact ObjectId values that must be stored in that field. It doesn't specify or validate that a particular ObjectId corresponds to a specific document in the referenced collection. It's more of a hint to Mongoose and developers about the expected data type and collection to be referenced.
To ensure the correctness of the references (i.e., that the stored ObjectId values correspond to actual documents in the referenced collection), it's the responsibility of your application logic to handle the validation and verification of these references before performing operations like adding or updating references in the field.
*/
const accountSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IAccount>("Account", accountSchema);
