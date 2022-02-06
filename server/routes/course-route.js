const router = require("express").Router();
const Course = require("../models").courseModel;
const User = require("../models").userModel;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("有一個請求進入course route");
  next();
});

router.get("/", (req, res) => {
  Course.find({})
    .populate("instructor", ["username", "email"]) //課程跟使用者連結
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      res.status(500).send("無法取得課程");
    });
});

//搜尋講師id找課程
router.get("/instructor/:_instructor_id", (req, res) => {
  let { _instructor_id } = req.params;
  Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send("找不到課程資料");
    });
});

router.get("/findByName/:name", (req, res) => {
  let { name } = req.params;

  Course.find({ title: name })
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.status(200).send(course);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//從學生id找他訂閱的課程
router.get("/student/:_student_id", (req, res) => {
  let { _student_id } = req.params;
  Course.find({ student: _student_id })
    .populate("instructor", ["username", "email"])
    .then((courses) => {
      res.status(200).send(courses);
    })
    .catch(() => {
      res.status(500).send("找不到課程資料");
    });
});

//搜尋課程id找課程
router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("instructor", ["email"])
    .then((course) => {
      res.send(course);
    })
    .catch((e) => {
      res.send(e);
    });
});

//上架課程route
router.post("/", async (req, res) => {
  //檢查課程資料格式是否是正確的
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let { title, description, price } = req.body;
  if (req.user.isStudent()) {
    return res.status(400).send("只有講師可以上架課程");
  }

  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });

  try {
    await newCourse.save();
    res.status(200).send({ msg: "新的課程已上架", savedObject: newCourse });
  } catch (err) {
    console.log(err);
    res.status(400).send("課程上架失敗");
  }
});

//訂閱課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params; //課程id
  let { user_id } = req.body;

  let enrollExist = await Course.findOne({ _id: _id, student: user_id });

  if (enrollExist) return res.status(400).send("您已訂閱過此課程");

  try {
    let course = await Course.findOne({ _id });

    course.student.push(user_id);

    await course.save();
    res.send("訂閱成功");
  } catch (err) {
    res.send(err);
  }
});

//搜尋課程並分類身分
router.patch("/:_id", async (req, res) => {
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  let course = await Course.findOne({ _id });

  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      mseeage: "找不到課程",
    });
  }
  //找到課程後，如果課程需要跟新
  if (course.instructor.equals(req.user._id) || req.user.isAdmin) {
    Course.findByIdAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("課程資料更新成功");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message: "只有講師可以修改課程資料",
    });
  }
});

//製作刪除課程的router
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let course = await Course.findOne({ _id });

  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      mseeage: "找不到課程",
    });
  }
  if (course.instructor.equals(req.user._id) || req.user.isAdmin) {
    Course.deleteOne({ _id })
      .then(() => {
        res.send("課程刪除成功");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message: "只有講師可以刪除課程資料",
    });
  }
});

module.exports = router;
