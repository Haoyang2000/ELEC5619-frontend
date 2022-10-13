import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { notification } from "antd";
import { loggedInUser } from "../atom/globalState";
import {
  getCurrentUser,
  getSingleProduct,
  getSingleProductComment,
  deleteComment,
  addCart,
} from "../util/ApiUtil";
import "./Detail.css";

const Detail = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [myProduct, setMyProduct] = useState({});
  const [comment, setComment] = useState([]);
  const productId = props.match.params.productId;

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    console.log("show the productId: " + productId);
    loadCurrentUser();
    loadSingleProduct();
    loadProductComment(productId);
  }, []);

  const loadProductComment = (productId) => {
    getSingleProductComment(productId)
      .then((response) => {
        console.log("loadSingleComment");
        console.log(response);
        setComment(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addProductToCart = (userId, productId) => {
    addCart(userId, productId)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Add product to cart successfully!",
        });
        // props.history.push(`/cart`);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
      });
  };

  const loadCurrentUser = () => {
    getCurrentUser()
      .then((response) => {
        console.log("loadCurrentUser");
        console.log(response);
        setLoggedInUser(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadSingleProduct = () => {
    getSingleProduct(productId)
      .then((response) => {
        console.log("getSingleProduct");
        console.log(response);
        setMyProduct(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const hideCart = (name) => {
    {
      let hideCart = (
        <button
          onClick={() => addProductToCart(currentUser.id, productId)}
          class="add-to-cart btn btn-default mr-3"
          type="button"
        >
          Add to cart
        </button>
      );
      if (currentUser.username === name) {
        return null;
      } else return hideCart;
    }
  };

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
  const hideComment = (name) => {
    {
      let hideComment = (
        <button class="add-to-cart btn btn-info mr-3" type="button">
          Add comment
        </button>
      );
      if (currentUser.username === name) {
        return null;
      } else return hideComment;
    }
  };

  const hideBuy = (name) => {
    {
      let hideBuy = (
        <button
          onClick={() => {
            notification.success({
              message: "Success",
              description: "Buy this product successfully!",
            });
          }}
          class="add-to-cart btn btn-success mr-3"
          type="button"
        >
          Buy it now
        </button>
      );
      if (currentUser.username === name) {
        return null;
      } else return hideBuy;
    }
  };
  const hideChat = (name) => {
    {
      let hideChat = (
        <button class="add-to-cart btn btn-warning mr-3" type="button">
          Chat
        </button>
      );
      if (currentUser.username === name) {
        return null;
      } else return hideChat;
    }
  };

  const deleteOrLove = (commentUserId, commentId) => {
    {
      let love = (
        <button
          onClick={() => {
            notification.success({
              message: "Success",
              description: "Love this comment successfully!",
            });
          }}
          class="add-to-cart btn btn-primary mr-3"
          type="button"
        >
          Love this comment
        </button>
      );
      let deleteUserComment = (
        <button
          onClick={() => {
            deleteComment(commentId)
              .then((response) => {
                notification.success({
                  message: "Success",
                  description: "Delete this comment successfully!",
                });
                loadProductComment(productId);
              })
              .catch((error) => {
                notification.error({
                  message: "Error",
                  description:
                    error.message ||
                    "Sorry! Something went wrong. Please try again!",
                });
              });
          }}
          class="add-to-cart btn btn-danger mr-3"
          type="button"
        >
          Delete
        </button>
      );
      if (commentUserId == currentUser.id) {
        return deleteUserComment;
      } else return love;
    }
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
      <div class="detail">
        <div class="card" style={{ marginTop: 10, padding: 10 }}>
          <div class="container-fliud">
            <div class="wrapper row">
              <div class="preview col-md-6">
                <div class="preview-pic tab-content">
                  <div class="tab-pane active" id="pic-1">
                    <img
                      src={`data:image/jpeg;base64,${myProduct.file}`}
                      alt={myProduct.imageName}
                      width="550"
                      height="400"
                    />
                  </div>
                </div>
              </div>
              <div class="details col-md-6">
                <h3 class="product-title">
                  Product name: {myProduct.productName}
                </h3>
                <p class="product-description">
                  <h4>Description:</h4>
                  {myProduct.productDescription}
                </p>
                <p class="product-description">
                  <h4>Category:</h4>
                  {myProduct.category}
                </p>
                <h4 class="price">
                  current price: <span>${myProduct.price}</span>
                </h4>

                <h4 class="price">
                  owner: <span>{myProduct.userName}</span>
                </h4>

                <div class="action">
                  {hideCart(myProduct.userName)}
                  <a href={`/addComment/${productId}`}>
                    {hideComment(myProduct.userName)}
                  </a>

                  {hideBuy(myProduct.userName)}
                  <a href={`/chat/${myProduct.userId}`}>
                    {hideChat(myProduct.userName)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: "30px" }}>Comments</h3>
        <hr class="solid"></hr>
        <div>
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
                  <td>{userComment.userName}</td>
                  <td> {displayStar(userComment.rating)}</td>
                  <td>{userComment.content}</td>
                  <td>
                    {deleteOrLove(userComment.userId, userComment.commentId)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Detail;
