//處理有關認證的路徑
const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  next();
});

//測試連接route
router.get("/testAPI", (req, res) => {
  const msgObj = { mseeage: "成功連結testAPI" };
  return res.json(msgObj);
});

//註冊route
router.post("/register", async (req, res) => {
  console.log("有一個註冊請求auth.js");
  //檢查資料格式的正確性
  const { error } = registerValidation(req.body);
  //經過Validation簡化給使用者的訊息
  if (error) return res.status(400).send(error.details[0].message);

  //檢查uaer是否已經在資料庫了
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email已被註冊過");
  //註冊資料
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
    date: req.body.date,
  });
  //儲存資料偵錯
  try {
    const savedUser = await newUser.save();
    res.status(200).send({ msg: "註冊成功", savedObject: savedUser });
  } catch (err) {
    console.log(err);
    res.status(400).send("資料儲存失敗");
  }
});

//登入router
router.post("/login", (req, res) => {
  console.log("有一個登入請求auth.js");
  //檢查資料格式的正確性
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.status(400).send(err);
    }
    if (!user) {
      return res.status(401).send("此email沒有註冊");
    } else {
      //接到從user-model回傳的call back↓
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err)
          return res.status(400).send("token或user-model程式碼有錯誤" + err);

        //密碼正確的話，以下會使用(id + email)製作出一個token傳給使用者
        if (isMatch) {
          const tokenObject = { _id: user._id, email: user.email }; //設定需要加密的物件
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET); //設定需要(加密的物件,字串)
          res.send({ success: true, token: "JWT " + token, user });
        } else {
          res.status(401).send("密碼錯誤");
        }
      });
    }
  });
});

module.exports = router;
