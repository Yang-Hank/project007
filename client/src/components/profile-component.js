import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";

const ProfileComponent = (props) => {
  let { currentUser, setCurrentUser } = props;

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && <div>需要登入才能進入個人頁面</div>}

      {currentUser && (
        <div>
          <h1>{currentUser.user.username}的個人頁面</h1>
          <header className="jumbotron"></header>
          <p>
            <strong>Role: {currentUser.user.role}</strong>
          </p>

          <p>
            <strong>email: {currentUser.user.email}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
