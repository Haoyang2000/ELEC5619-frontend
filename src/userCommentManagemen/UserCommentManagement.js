import React, { useEffect } from "react";
import { useState } from "react";
import { notification } from "antd";
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";
import { getUserComment, deleteComment } from "../util/ApiUtil";

import "./UserCommentManagement.css";

const UserCommentManagement = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [comment, setComment] = useState([]);
  const productId = props.match.params.productId;

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadComment(currentUser.id);
  }, []);
  const displayStar = (rating) => {
    return (
      <div>
        {[...Array(rating)].map((star) => {
          return (
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-star-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
              </svg>
            </i>
          );
        })}
      </div>
    );
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
  };

  const loadComment = (userId) => {
    getUserComment(userId)
      .then((response) => {
        console.log("load comment");
        console.log(response);
        setComment(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteClick = (commentId) => {
    deleteComment(commentId)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Deleted comment successfully!",
        });
        loadComment();
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
      <div>
        {" "}
        <h1 class="label">Comment Management</h1>
        <table class="table">
          <thead>
            <tr>
              <th class="col-md-2">Comment image</th>
              <th class="col-md-2">Post owner</th>
              <th class="col-md-1">Rating</th>
              <th class="col-md-3">Description</th>
              <th class="col-md-1">Operation</th>
            </tr>
          </thead>
          <tbody>
            {comment.map((userComment) => (
              <tr>
                <td>
                  <img
                    src={`data:image/jpeg;base64,${userComment.file}`}
                    alt={userComment.imageName}
                    width="250"
                    height="150"
                  />
                </td>
                <td>{userComment.userId}</td>
                <td>{displayStar(userComment.rating)}</td>
                <td>{userComment.content}</td>
                <td>
                  <btn
                    onClick={() => {
                      deleteClick(userComment.commentId);
                    }}
                    className="btn btn-danger btn-mid mr-1"
                  >
                    delete
                  </btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    let warning = <div></div>;
    if (1) return content;
    else return warning;
  };

  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="navbar-nav">
          <a class="nav-item nav-link" href="/userManagement">
            User Management
          </a>
          <a class="nav-item nav-link" href="/productManagement">
            Product Management
          </a>
        </div>
        <div style={{ marginLeft: "auto", marginRight: "50px" }}>
          <btn onClick={logout} className="btn btn-danger btn-mid mr-1">
            Logout
          </btn>
        </div>
      </nav>
      <div>{loadContentforAdmin()}</div>
    </div>
  );
};

export default UserCommentManagement;
