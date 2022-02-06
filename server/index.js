const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
//這是一個function所以後面直接加變數↓
require("./config/passport")(passport);
const cors = require("cors");

//連結 mongo DB
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect to Mongo Altas");
  })
  .catch((e) => {
    console.log(e);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/user", authRoute); //一定要加/api,react連接後端需要加
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRoute
); //這個route需要用token加密

app.listen(8080, () => {
  console.log("server is running 8080");
});
