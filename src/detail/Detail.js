import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";
import {
  getCurrentUser,
  getSingleProduct,
  getSingleUser,
} from "../util/ApiUtil";

import "./Detail.css";

const Detail = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [myProduct, setMyProduct] = useState({});
  const productId = props.match.params.productId;

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    console.log("show the productId: " + productId);
    loadCurrentUser();
    loadSingleProduct();
  }, []);

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
        <button class="add-to-cart btn btn-default mr-3" type="button">
          Add to cart
        </button>
      );
      if (currentUser.username === name) {
        return null;
      } else return hideCart;
    }
  };

  const hideComment = (name) => {
    {
      let hideComment = (
        <button class="add-to-cart btn btn-primary mr-3" type="button">
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
        <button class="add-to-cart btn btn-success mr-3" type="button">
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
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand">Hello {currentUser.username}</a>
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
                    {" "}
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
      </div>
    </div>
  );
};

export default Detail;
