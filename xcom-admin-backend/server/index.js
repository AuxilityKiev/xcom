import Koa from "koa";
import bodyParser from "koa-body";
import cors from "@koa/cors";

import router from "./services/api/routes";
import { PORT, NODE_ENV, IMAGE_DIR } from "./config/env.config";
import passport from "./config/passport";
import database from "./db";
import logger from "./config/winston.config";
import handler from "./utils/handler";

const app = new Koa();
app
  .use(
    bodyParser({
      jsonLimit: "10mb",
      urlencoded: true,
      multipart: true,
      uploadDir: IMAGE_DIR
    })
  )
  .use(cors())
  .use(passport.initialize())
  .use(handler)
  .use(router.routes());

export default app.listen(PORT, async () => {
  logger.debug(`HTTP Server listening on port: ${PORT}`);
  logger.debug(`Environment: ${NODE_ENV}`);
  await database();
});
