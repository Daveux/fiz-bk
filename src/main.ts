import express from "express";
import cors, { CorsOptions } from "cors";
import logger from "./utils/logger";
import apiRouter from "./routes/webhook.route";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";

import { whiteListUrls } from "./config";


const app = express();
const PORT = process.env.PORT || 9000;

// App config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const whitelist: string[] = whiteListUrls;

logger.info(`Whitelist! ${whitelist}`);

app.use(
  cors({
    origin: (
      origin: string,
      callback: (err: Error | null, origin?: string) => void
    ) => {
      callback(
        whitelist.includes(origin as string) || !origin
          ? null
          : new Error(`Access to API from origin ${origin} denied`),
        origin
      );
    },
    credentials: true,
  } as CorsOptions)
);

//handle all routes
app.use("/api/v1", apiRouter);

//handle non-existent routes
app.use("*", notFound);

app.use(errorHandler);

const server = app.listen(PORT, async () => {
  logger.info(`
  ######################################
      #####################################
      Server listening on port: ${PORT}
      in ${app.settings.env} mode
      #####################################
  #####################################
  `);
});

export default server;
