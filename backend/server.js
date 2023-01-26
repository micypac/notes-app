const express = require("express");
const app = express();
const path = require("path");
const rootRouter = require("./routes/root");

app.use("/", express.static(path.join(__dirname, "/public")));

// Routes
app.use("/", rootRouter);

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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}...`));
