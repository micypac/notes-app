require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rootRouter = require("./routes/root");
const userRouter = require("./routes/user");
const noteRouter = require("./routes/note");
const authRouter = require("./routes/auth");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");

// custom middleware to log requests
app.use(logger);

connectDB();

// library middlewares
app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use(express.static("public"));

// Routes
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/notes", noteRouter);
app.use("/auth", authRouter);

// catch all route not found
app.all("*", (req, res, next) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// custom middleware errorHandler
app.use(errorHandler);

module.exports = app;
