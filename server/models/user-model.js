const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  role: {
    type: String,
    required: true,
    //↓↓通常在開發時會再加入admin,開發完就會刪除
    //enum=enumerate(列舉的意思)
    enum: ["student", "instructor"],
  },

  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

//以下是判斷是學生還是講師
userSchema.methods.isStudent = function () {
  return this.role == "student"; //如果是學生會回覆true
};

userSchema.methods.isInstructor = function () {
  return this.role == "instructor"; //如果是講師會回覆true
};

userSchema.methods.isAdmin = function () {
  return this.role == "admin"; //如果是講師會回覆true
};

//mongoose schema middleware
// .pre = 希望schema在save發生前，希望schema做hash
userSchema.pre("save", async function (next) {
  //↓如果密碼有更改過或者是新密碼 => 重新hash
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

//登入時比對使用者輸入的password跟hash過的this.password是否一樣
userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch); //如果比較後,密碼錯誤回傳此function(cb)
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
