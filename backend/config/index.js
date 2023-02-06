module.exports = {
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,
  dbURI: process.env.DB_URI,
  jwtConfig: {
    ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN_SECRET,
  },
};
