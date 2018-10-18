const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect("mongodb://movie_user:aaa123@ds135413.mlab.com:35413/movie-api", { useNewUrlParser: true });

  mongoose.connection.on("open", () => {
    console.log("MongoDB: Connected");
  });

  mongoose.connection.on("error", (err) => {
    console.log("MongoDB: Error", err);
  });

  mongoose.Promise = global.Promise;
}