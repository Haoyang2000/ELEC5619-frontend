import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { notification } from "antd";
import { loadUsers, loggedInUser } from "../atom/globalState";
import { getUsers, deleteUser, modifyUser } from "../util/ApiUtil";
import moment from "moment";

import "./UserManagement.css";

const UserManagement = (props) => {
  const [users, setUsers] = useRecoilState(loadUsers);
  const [query, setQuery] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadTotalUsers();
  }, []);

  const loadTotalUsers = () => {
    getUsers()
      .then((response) => {
        console.log("loadUsers");
        console.log(response);
        setUsers(response);
        console.log("show users");
        console.log(users);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
  };

  const deleteClick = (value) => {
    console.log(value);
    const info = {
      id: value,
    };
    deleteUser(info)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Deleted user successfully!",
        });
        props.history.push("/userManagement");
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
      });
  };

  const changeClick = (value) => {
    console.log(value);
    const info = {
      id: value.id,
      email: newEmail,
      username: value.username,
      active: value.active,
      address: value.address,
      admin: value.admin,
      cardId: 100,
      createTime: value.createTime,
      language: value.language,
      password: value.password,
    };
    console.log(info);
    modifyUser(info)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Email has been changed",
        });
        props.history.push("/");
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
      });
  };

  // Only display content for admin!
  const loadContentforAdmin = () => {
    let content = (
      <div class="product">
        {" "}
        <h1 class="label">User Management</h1>
        <input
          type="text"
          placeholder="Input keywords to search user"
          className="form-control"
          id="inputdefault"
          style={{ width: "300px" }}
          onChange={(e) => setQuery(e.target.value)}
          >
        </input>
        <table class="table">
          <thead>
            <tr>
              <th class="col-md-1">User Id</th>
              <th class="col-md-1">Name</th>
              <th class="col-md-1">Language</th>
              <th class="col-md-3">Email</th>
              <th class="col-md-2">Address</th>
              <th class="col-md-1">Create Time</th>
              <th class="col-md-1">Operation</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(
                (user) =>
                  user.username.toLowerCase().includes(query) ||
                  user.address.toLowerCase().includes(query) ||
                  user.email.toLowerCase().includes(query) ||
                  user.address.toLowerCase().includes(query) ||
                  user.id.toString().includes(query) ||
                  user.createTime.toString().includes(query)
              )
              .map((user) => (
                <tr>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.language}</td>
                  <td>
                    <div>
                      <div class="input-group mb-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder={user.email}
                          aria-describedby="basic-addon2"
                          onChange={(e) => setNewEmail(e.target.value)}
                        ></input>
                        <div class="input-group-append">
                          <button
                            onClick={() => {
                              if (!newEmail) {
                                notification.error({
                                  message: "Error",
                                  description: "Please input new content",
                                });
                              } else {
                                changeClick(user);
                              }
                            }}
                            class="btn btn-outline-secondary"
                            type="button"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{user.address}</td>
                  <td>{moment(user.createTime).format("ll")}</td>
                  <td>
                    <button
                      onClick={() => deleteClick(user.id)}
                      type="button"
                      class="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );

    if (localStorage.getItem("name") === "Admin") {
      return content;
    } else {
      props.history.push("/error/401");
    }
  };

  return (
    <div>
      <nav class="nav-container">
        <p> All-Lingual | Admin </p>
        <div class="nav-item">
            <a href="/chats">Chats</a>
            <a href="/userManagement">User Management</a>
            <a href="/productManagement">Product Management</a>
            <a href="#" onClick={logout}>Logout</a>
        </div>
      </nav>
      <section>
        <div>{loadContentforAdmin()}</div>
      </section>
      <footer>
        <p>Author: ELEC5619-Group 2Spring 2022 USYD ---- Spring 2022 USYD</p>
        <p><a href="https://github.com/jzha9393/ELEC5619/tree/eric">Backend Github Link</a></p>
      </footer>
    </div>
  );
};

export default UserManagement;
