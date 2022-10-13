import React, { useEffect, useState } from "react";

import "./error.css";
const Error = (props) => {
  const code = "https://http.dog/" + props.match.params.errorCode + ".jpg";
  useEffect(() => {
    console.log(code);
  }, []);
  return (
    <div>
      <a class="nav-item nav-link" href="/login">
        click here to re-login
      </a>
      <img src={code} alt="unauthrozied" width="50%" height="50%" />
    </div>
  );
};

export default Error;
