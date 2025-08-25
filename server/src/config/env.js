export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_parking',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
