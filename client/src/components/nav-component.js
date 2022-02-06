import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import CourseService from "../services/course.service";

const NavComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);

  const handleLogout = () => {
    AuthService.logout();
    window.alert("登出成功，重新導向首頁");
    setCurrentUser(null);
    navigate("/");
  };

  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        console.log(data);
        setSearchResult(data.data);
        navigate("/enroll");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            MERN
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              {!currentUser && (
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
              )}
              {!currentUser && (
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Course
                  </Link>

                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/enroll">
                        Course List
                      </Link>
                    </li>
                    {currentUser && currentUser.user.role == "instructor" && (
                      <li>
                        <Link className="dropdown-item" to="/postCourse">
                          Post Course
                        </Link>
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {currentUser && (
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Member Account
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <div>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                      <li>
                        <Link className="dropdown-item" to="/course">
                          Your Course
                        </Link>
                      </li>
                      <hr />
                      <Link
                        onClick={handleLogout}
                        className="dropdown-item"
                        to="/"
                      >
                        Logout
                      </Link>
                    </div>
                  </ul>
                </li>
              )}
            </ul>

            {currentUser && (
              <div className="d-flex">
                <input
                  onChange={handleChangeInput}
                  className="form-control me-2"
                  type="search"
                  placeholder="Search Course"
                  aria-label="Search"
                />
                <button
                  onClick={handleSearch}
                  className="btn btn-outline-success"
                  type="submit"
                >
                  Search
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavComponent;
