import { Request, Response } from "express";

import logger from "../../config/logger";
import Account from "../../models/Account";
import StatusCode from "../../utils/statusCode";

const balanceController = async (req: Request, res: Response) => {
  try {
    logger.info(`Balance request for ${req.body.username}`);

    const account = await Account.findOne({ userId: req.body.username });
    if (account) {
      return res.status(StatusCode.OK).json({ balance: account.balance });
    } else {
      logger.info(`No Existing Account found for ${req.body.username}`);
      return res.status(404).json({ error: "User not found" });
    }
  } catch (err: unknown) {
    logger.info(`Balance request failed for ${req.body.username}`);
    if (err instanceof Error) {
      logger.info(err.message);
    }
    return res.status(500).json({ error: "Server Error" });
  }
};
export default balanceController;
