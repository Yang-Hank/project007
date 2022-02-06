const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId, //這筆資料只能是資料庫裡的ObjectId
    ref: "User", //這邊要打的是要連的那個schema的名字，代表你告訴資料庫, 跟這筆資料連結在一起的另一個schema的名字是User,注意schema的名字不要打錯, 尤其是大小寫的部分
  },
  student: {
    type: [String],
    default: [],
  },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
