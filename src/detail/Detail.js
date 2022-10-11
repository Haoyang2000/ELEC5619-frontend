import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  loggedInUser,
  loadProduct,
  loadSingleProduct,
} from "../atom/globalState";
import {
  getCurrentUser,
  getSingleProduct,
  getSingleUser,
} from "../util/ApiUtil";

import "./Detail.css";

const Detail = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  // const [products, setProducts] = useRecoilState(loadProduct);
  const [myProduct, setMyProduct] = useState({});
  const [owner, setOwner] = useState({});
  const productId = props.match.params.productId;

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    console.log("show the productId: " + productId);
    loadCurrentUser();
    loadSingleProduct();
    // loadSingleUser();
    loadSingleUser(myProduct.userId);
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

  const loadSingleUser = (id) => {
    console.log("111111" + myProduct.userId);
    getSingleUser(id)
      .then((response) => {
        console.log("getOwner");
        console.log(response);
        setOwner(response);
      })
      .catch((error) => {
        console.log(error);
      });
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
          <a class="nav-item nav-link" href="/chat">
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
                      width="200"
                      height="200"
                    />
                  </div>
                </div>
              </div>
              <div class="details col-md-6">
                <h3 class="product-title">
                  Product name:{myProduct.productName}
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
                  owner: <span>{owner.username}</span>
                </h4>

                <div class="action">
                  <button
                    class="add-to-cart btn btn-default mr-3"
                    type="button"
                  >
                    Add to cart
                  </button>

                  <button
                    class="add-to-cart btn btn-success mr-3"
                    type="button"
                  >
                    Buy it now
                  </button>
                  <a href="">
                    <button
                      class="add-to-cart btn btn-warning mr-3"
                      type="button"
                    >
                      Chat
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: "30px" }}>Comments</h3>
        <hr class="solid"></hr>

        {/* {myProduct.map((product) => (
          <div>
            {" "}
            <tr>
              <td style={{ width: "120px" }}>
                <h5>{product.name.first}</h5>
              </td>
              <td style={{ width: "120px" }}>
                <h6>Rating: {product.dob.age}</h6>
              </td>
              <td style={{ width: "500px" }}>
                <h6>Publish date: {product.dob.date}</h6>
              </td>
            </tr>
            <p>{product.login.sha256}</p>
            <hr class="solid"></hr>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Detail;
