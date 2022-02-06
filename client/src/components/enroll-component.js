import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const EnrollComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  let [message, setMessage] = useState("");

  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        console.log(data);
        setSearchResult(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id, currentUser.user._id)
      .then(() => {
        window.alert("訂閱完成");
        navigate("/course");
      })
      .catch((err) => {
        console.log(err.response);
        setMessage(err.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>需要登入才能搜尋課程</p>
          <button class="btn btn-primary btn-lg" onClick={handleTakeToLogin}>
            Login
          </button>
        </div>
      )}

      {currentUser && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            type="text"
            class="form-control"
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      )}

      {currentUser && searchResult && searchResult.length != 0 && (
        <div>
          <p>搜尋結果</p>
          {searchResult.map((course) => (
            <div key={course._id} className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h1 className="card-title">{course.title}</h1>
                <h5 className="card-title">{course.instructor.username}</h5>
                <p className="card-text">{course.description}</p>
                <p>Price: {course.price}</p>
                <p>Student: {course.student.length}</p>
                {currentUser && currentUser.user.role == "student" && !message && (
                  <a
                    href="#"
                    onClick={handleEnroll}
                    className="card-text"
                    className="btn btn-primary"
                    id={course._id}
                  >
                    Enroll
                  </a>
                )}

                {message && <div className="alert alert-danger">{message}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
