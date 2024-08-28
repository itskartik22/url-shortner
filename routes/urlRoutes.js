const Router = require("express").Router();
const {
  generateNewShortUrl,
  getAnalytics,
} = require("../controllers/urlControllers");

Router.post("/", generateNewShortUrl);
Router.get("/analytics/:shortId", getAnalytics);

module.exports = Router;
