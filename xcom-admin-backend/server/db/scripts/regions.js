import mongoose from "mongoose";

import logger from "../../config/winston.config";
import { MONGO_URL } from "../../config/env.config";
import Banner from "../models/banner";
import Block from "../models/block";

const updateRegions = async () => {
  await Banner.aggregate([
    {
      $addFields: {
        regionIds: ["$regionId"]
      }
    },
    { $project: { regionId: 0 } },
    { $out: "banners" }
  ]);
  await Block.aggregate([
    {
      $addFields: {
        regionIds: ["$regionId"]
      }
    },
    { $project: { regionId: 0 } },
    { $out: "blocks" }
  ]);
};

const runScript = async () => {
  try {
    const db = await mongoose.connect(
      MONGO_URL,
      { useNewUrlParser: true }
    );
    logger.debug("Connection to database was successful");
    await updateRegions();
    await db.disconnect();
  } catch (err) {
    logger.error(`Cannot connect to database: ${err}`);
  }
};

runScript();
