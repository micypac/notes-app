require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const rootRouter = require("./routes/root");
const userRouter = require("./routes/user");
const noteRouter = require("./routes/note");
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

// these are the same. First one is just more explicit
// app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

// Routes
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/notes", noteRouter);

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

  // throw error manually to test errorHandler
  // const err = new Error("The requested resource couldn't be found.");
  // err.title = "Resource Not Found";
  // err.errors = ["The requested resource couldn't be found."];
  // err.status = 404;
  // next(err);
});

// custom middleware errorHandler
app.use(errorHandler);

const port = process.env.PORT || 3500;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB...");
  app.listen(port, () => console.log(`Server running on port ${port}...`));
});

mongoose.connection.on("error", (err) => {
  console.error(err);

  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "dbErrorLog.log"
  );
});
