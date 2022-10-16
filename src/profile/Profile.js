import React, { useEffect, useState } from "react";
import { Card, Avatar } from "antd";
import { useRecoilState } from "recoil";
import { loggedInUser, chatMessages, FakeUser } from "../atom/globalState";
import { getCurrentUser } from "../util/ApiUtil";
import moment from "moment";

import "./Profile.css";
import "../homepage/Home.css";

const Profile = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    getCurrentUser()
      .then((response) => {
        console.log("loadCurrentUser");
        console.log(response);
        setLoggedInUser(response);
        console.log(currentUser);
      })
      .catch((error) => {
        const code = error.status
        props.history.push("/error/" + code)
        console.log(error);
      });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
  };

  return (
    <div class="background-color">
      <nav class="nav-container">
        <a class="logo" href="/"> All-Lingual | {currentUser.username}</a>
        <div class="nav-item">
            <a href="/chats">Chats</a>
            <a href="/cart">Cart</a>
            <a href="/UserProductManagement"
               onclick="/addproduct">
               My Products
            </a>
            <a href={`/usercommentmanagement`}>
              My Comments
            </a>
            <a href="/profile">Profile</a>
            <a href="#" onClick={logout}>Logout</a>
        </div>
      </nav>

      <section class="emp-profile">
            <h1>Personal Profile</h1>
            <a href="/changepassword" className="btn btn-warning btn-mid mr-3">
               Change Password
            </a>
            <a href="/modifyUser" className="btn btn-warning btn-mid mr-3">
                 Modify profile
            </a>

            <table>
                <tr>
                    <td>User Id:</td>
                    <td>{currentUser.id}</td>
                </tr>
                <tr>
                    <td>Name:</td>
                    <td>{currentUser.username}</td>
                </tr>
                 <tr>
                     <td>Email:</td>
                     <td>{currentUser.email}</td>
                 </tr>
                <tr>
                    <td>Address:</td>
                    <td>{currentUser.address}</td>
                </tr>
                <tr>
                    <td>Created Time:</td>
                    <td>{moment(currentUser.createTime).format("ll")}</td>
                </tr>
            </table>
      </section>
    </div>
  );
};

export default Profile;
