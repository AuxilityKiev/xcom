import mongoose from "mongoose";

import logger from "./../config/winston.config";
import { MONGO_URL } from "./../config/env.config";
import seedUsers from "./seeds/users.seed";

export default async () => {
  try {
    await mongoose.connect(
      MONGO_URL,
      { useNewUrlParser: true }
    );
    logger.debug("Connection to database was successful");
    await seedUsers();
  } catch (err) {
    logger.error("Cannot connect to database: ", err);
  }
};
