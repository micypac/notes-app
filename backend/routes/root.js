const rootRouter = require("express").Router();
const path = require("path");

// route can either be "/" or "/index" or "/index.html"
rootRouter.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = rootRouter;
