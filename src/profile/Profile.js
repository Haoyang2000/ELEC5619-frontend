import React, { useEffect, useState } from "react";
import { Card, Avatar } from "antd";
import { useRecoilState } from "recoil";
import { loggedInUser, chatMessages, FakeUser } from "../atom/globalState";
import { getCurrentUser } from "../util/ApiUtil";
import moment from "moment";

import "./Profile.css";

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
        console.log(error);
      });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
  };

  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/">
          Hello, {currentUser.username}
        </a>
        <div class="navbar-nav">
          <a class="nav-item nav-link active" href="/">
            Home <span class="sr-only">(current)</span>
          </a>
          <a class="nav-item nav-link" href="/profile">
            Profile
          </a>
          <a class="nav-item nav-link" href="/chats">
            Chat
          </a>
          <a class="nav-item nav-link" href="/cart">
            Cart
          </a>
        </div>
      </nav>
      <div class="container emp-profile">
        <div class="row">
          <div class="col-md-4">
            <div class="tab-content profile-tab" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div class="col-md-0">
                  <h1>Personal Profile</h1>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label>User Id</label>
                  </div>
                  <div class="col-md-6">
                    <p>{currentUser.id}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label>Name</label>
                  </div>
                  <div class="col-md-6">
                    <p>{currentUser.username}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label>Email</label>
                  </div>
                  <div class="col-md-6">
                    <p>{currentUser.email}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label>Address</label>
                  </div>
                  <div class="col-md-6">
                    <p>{currentUser.address}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label>create time</label>
                  </div>
                  <div class="col-md-6">
                    <p>{moment(currentUser.createTime).format("ll")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container emp-profile">
        <div class="row">
          <div class="col-md-8">
            <div class="tab-content profile-tab" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div class="col-md-0">
                  <h1>Account Operations</h1>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <btn
                      onClick={logout}
                      className="btn btn-danger btn-mid mr-3"
                    >
                      Logout
                    </btn>
                    <a href="/changepassword">
                      <btn onClick="" className="btn btn-warning btn-mid mr-3">
                        Change Password
                      </btn>
                    </a>
                    <a href="/modifyUser">
                      <btn onClick="" className="btn btn-warning btn-mid mr-3">
                        Modify profile
                      </btn>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container emp-profile">
        <div class="row">
          <div class="col-md-8">
            <div class="tab-content profile-tab" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div class="col-md-0">
                  <h1>Product Management</h1>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <a href="/addproduct">
                      <btn className="btn btn-secondary btn-mid mr-3">
                        Add new product
                      </btn>
                    </a>
                    <a href="/UserProductManagement">
                      <btn
                        onclick="/addproduct"
                        className="btn btn-secondary btn-mid mr-3"
                      >
                        Manage my products
                      </btn>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container emp-profile">
        <div class="row">
          <div class="col-md-8">
            <div class="tab-content profile-tab" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div class="col-md-0">
                  <h1>Comments</h1>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <a href="/addproduct">
                      <btn className="btn btn-info btn-mid mr-3">
                        See my comments
                      </btn>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
