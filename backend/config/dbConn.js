const mongoose = require("mongoose");
const { dbURI } = require("./index");

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
