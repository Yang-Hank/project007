//JsonWebToken + passport = npm (passport-jwt)
//只要經過passport.auth這個middleware，以下的程式碼就會被執行

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").userModel;

module.exports = (passport) => {
  let opts = {};
  //↓從req裡搜尋看看有沒有token,有的話就提取出來
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  //將每次的要求都比對user
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
          // console.log("passport-jet程式碼有錯誤");
          done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          // console.log("找不到使用者");
          done(null, false);
        }
      });
    })
  );
};
