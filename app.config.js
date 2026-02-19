require("dotenv").config();
const appJson = require("./app.json");

const expoConfig = appJson.expo ?? appJson;

module.exports = {
  ...expoConfig,
  extra: {
    ...expoConfig.extra,
    EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    EXPO_PUBLIC_STABILITY_API_KEY: process.env.EXPO_PUBLIC_STABILITY_API_KEY,
  },
};
