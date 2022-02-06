import axios from "axios";

const API_URL = "http://localhost:8080/api/user"; //選擇後端的port

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password, role) {
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
      role,
    });
  }
  //若網頁有重整或跳開，跟伺服器確認登入的狀態(是否已經登入過?)
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
