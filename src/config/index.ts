import * as dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT;
export const nodeEnv = process.env.NODE_ENV || "development";
export const whiteListEnvUrls =
  process.env.WHITELIST_URLS || "http://localhost:3000";
export const whiteListUrls = whiteListEnvUrls.split(",");
export const refreshTokenExpiresIn =
  Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 0;

export const sendGridApiKey = process.env.SENDGRID_API_KEY || "";

export const bibleStudyRef = process.env.BIBLE_STUDY_REF || "";

export const echoesOfHopeRef = process.env.ECHOES_OF_HOPE_REF || "";

export const trialsOfUsRef = process.env.TRIALS_OF_US_REF || "";

export const bibleStudyLink = process.env.BIBLE_STUDY_LINK || "";

export const echoesOfHopeLink = process.env.ECHOES_OF_HOPE_LINK || "";

export const fromEmail = process.env.FROM_EMAIL || "";


export const paystackConfig = {
  secretKey: process.env.PAYSTACK_SECRET_KEY
}

