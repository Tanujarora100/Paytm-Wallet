import mongoose from "mongoose";
import logger from "../../config/logger";
import { Request, Response } from "express";
import Account from "../../models/Account";
import StatusCode from "../../utils/statusCode";

// Define an asynchronous function to find an account by userId and session
const findAccount = async (userId: string, session: mongoose.ClientSession) => {
  // Use the mongoose model Account to find an account with the given userId, within the provided session
  const account = await Account.findOne({ userId }).session(session);
  // If no account is found, log a message and throw an error
  if (!account) {
    logger.info(`No Existing Account found for ${userId}`);
    throw new Error(`User not found: ${userId}`);
  }
  // Return the found account
  return account;
};

const transferController = async function (req: Request, res: Response) {
  const { from, to, amount } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Use the helper function to find accounts
    const fromAccount = await findAccount(from, session);
    const toAccount = await findAccount(to, session);

    // Check for sufficient balance
    if (fromAccount.balance < amount) {
      logger.info(`Insufficient balance for ${from}`);
      await session.abortTransaction();
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ error: "Insufficient balance" });
    }

    // Perform transfer
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save({ session });
    await toAccount.save({ session });
    await session.commitTransaction();
    logger.info(`Transfer request for ${from} to ${to} successful`);
    res.status(StatusCode.OK).json({ message: "Transfer successful" });
  } catch (err) {
    await session.abortTransaction();
    if (err instanceof Error) {
      logger.info(`Transfer request failed for ${err.message}`);
      res
        .status(
          err.message === "User not found"
            ? StatusCode.NOT_FOUND
            : StatusCode.INTERNAL_SERVER_ERROR,
        )
        .json({ error: err.message });
    } else {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: "Server Error" });
    }
  } finally {
    session.endSession();
  }
};

export default transferController;
