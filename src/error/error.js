import React, { useEffect, useState } from "react";

import "./error.css";
const Error = (props) => {
  const code = "https://http.dog/" + props.match.params.errorCode + ".jpg";
  useEffect(() => {
    console.log(code);
  }, []);


  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
  };
  return (
    <div class="error">
      <nav class="error-navbar">
        <a href="/">
        Home
        </a>
        <a href="#" onClick={logout}>Exit</a>
      </nav>

      <img src={code} alt="unauthrozied" />
    </div>
  );
};

export default Error;
