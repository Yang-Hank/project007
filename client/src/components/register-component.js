import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//react 6.0已將usehistory改成usenavigate
import AuthService from "../services/auth.service";

const RegisterComponent = () => {
  const navigate = useNavigate();
  //設定輸入格式對應的地方
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("");
  let [message, setMessage] = useState("");

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleChangeRole = (e) => {
    setRole(e.target.value);
  };

  const handleRegister = () => {
    AuthService.register(username, email, password, role)
      .then(() => {
        window.alert("註冊成功，重新導向登入頁面");
        navigate("/login"); //react 6.0不用打.push
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };

  //若有error message，則會顯示出來給使用者看
  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        <div>
          {message && <div className="alert alert-danger">{message}</div>}
          <label htmlFor="username">Username</label>
          <input
            onChange={handleChangeUsername}
            type="text"
            className="form-control"
            name="username"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChangeEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChangePassword}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            onChange={handleChangeRole}
            className="form-select"
            aria-label="Default select example"
          >
            <option selected>Open this select menu</option>
            <option value="student">student</option>
            <option value="instructor">instructor</option>
          </select>
        </div>
        <br />
        <button onClick={handleRegister} className="btn btn-primary">
          <span>Register</span>
        </button>
        <br />
        <br />
        <a href="/login"> or Login</a>
      </div>
    </div>
  );
};

export default RegisterComponent;
