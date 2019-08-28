export const NODE_ENV = process.env.NODE_ENV || "development";
export const DRYRUN = process.env.DRYRUN || false;
export const PORT = process.env.PORT || 3000;
export const MONGO_HOST = process.env.MONGO_HOST || "localhost";
export const MONGO_PORT = process.env.MONGO_PORT || 27017;
export const MONGO_DB_NAME = "xcom";
export const MONGO_DB_USER = process.env.MONGO_DB_USER || "xcom";
export const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || "1234567890";
export const MONGO_URL =
  process.env.MONGO_URL ||
  `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;
export const JWT_SECRET = process.env.JWT_SECRET || "1234567890";
export const IMAGE_DIR = "/var/www/xcom-admin-backend/images";
export const IMAGE_URL = process.env.IMAGE_URL || "http://138.68.86.83/images";
