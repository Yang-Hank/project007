import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  let [courseData, setCourseData] = useState(null);

  useEffect(() => {
    console.log("using effect");
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
    } else {
      _id = "";
      window.alert("需要登入才能查詢課程資料");
      navigate("/login");
      return;
    }
    if (currentUser.user.role == "instructor") {
      CourseService.get(_id)
        .then((data) => {
          console.log(data);
          setCourseData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.user.role == "student") {
      CourseService.getEnrolledCourses(_id)
        .then((data) => {
          console.log(data);
          setCourseData(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>查閱課程，請先登入</p>
          <button
            onClick={handleTakeToLogin}
            className="btn btn-primary btn-lg"
          >
            Login
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>Welcome to {currentUser.user.username}'s Course Page</h1>
          {currentUser && courseData && courseData.length != 0 && (
            <div>
              <p>您的上架課程</p>
              {courseData.map((course) => (
                <div
                  Key={course._id}
                  className="card"
                  style={{ width: "18rem" }}
                >
                  <div className="card-body">
                    <h5 className="crad-title">{course.title}</h5>
                    <p className="crad-text">{course.description}</p>
                    <p>Student Count :{course.student.length}</p>
                    <p>Course Price : ${course.price} </p>
                    <button className="btn btn-primary">修改課程</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>Welcome to {currentUser.user.username}'s Course Page</h1>
          {currentUser && courseData && courseData.length != 0 && (
            <div>
              <p>您的訂閱課程</p>
              {courseData.map((course) => (
                <div
                  Key={course._id}
                  className="card"
                  style={{ width: "18rem" }}
                >
                  <div className="card-body">
                    <h5 className="crad-title">{course.title}</h5>
                    <p className="crad-text">{course.description}</p>
                    <p>Student Count :{course.student.length}</p>
                    <p>Course Price : ${course.price} </p>
                    <button className="btn btn-primary">進入課程</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
