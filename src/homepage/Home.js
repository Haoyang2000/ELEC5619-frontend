import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { loggedInUser, productsI } from "../atom/globalState";
import { getCurrentUser, getProductss } from "../util/ApiUtil";
import "./Home.css";
import { useState } from "react";

const Home = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [products, setProducts] = useRecoilState(productsI);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }

    console.log("name:  " + localStorage.getItem("username"));
    if (localStorage.getItem("name") === "Admin") {
      props.history.push("/userManagement");
    }
    loadCurrentUser();
    loadProducts();

    console.log("product");
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

  const loadProducts = () => {
    getProductss()
      .then((response) => {
        console.log("loadProducts");
        console.log(response);
        setProducts(response);
      })
      .catch((error) => {
        console.log(error);
      });
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
        <div style={{ marginLeft: "auto", marginRight: 0 }}>
          <div style={{ marginLeft: "auto", marginRight: "25px" }}>
            <div>
              <input
                type="text"
                placeholder="Input keywords to search product"
                className="form-control"
                id="inputdefault"
                style={{ width: "300px" }}
                onChange={(e) => setQuery(e.target.value)}
              ></input>
            </div>
          </div>
        </div>
      </nav>

      <h1 class="label">Our best products</h1>
      <hr class="solid"></hr>
      <div class="product">
        {products
          .filter(
            (product) =>
              product.productName.toLowerCase().includes(query) ||
              product.userName.toString().toLowerCase().includes(query)
          )
          .map((product) => (
            <div>
              <div class="display-flex">
                <div class="div-size-img">
                  <img
                    src={`data:image/jpeg;base64,${product.file}`}
                    alt={product.imageName}
                    width="200"
                    height="200"
                  />
                </div>

                <div class="div-size-content">
                  <h4>Product name</h4>
                  <p>{product.productName}</p>
                </div>
                <div class="div-size-button">
                  <h4>Owner</h4>
                  <p> {product.userName}</p>
                </div>
                <div class="div-size-button">
                  <a href={`/detail/${product.productId}`}>
                    <btn className="btn btn-success btn-mid mr-3">Buy</btn>
                  </a>

                  <a href={`/chat/${product.userId}`}>
                    <btn className="btn btn-warning btn-mid mr-3">Chat</btn>
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* <ul>
        {products.map((product) => (
          <li>
            <p>{product.productId}</p>
            <p>{product.productName}</p>
            <p>{product.productDescription}</p>
            <p>{product.price}</p>
            <p>{product.userId}</p>
            <p>{product.category}</p>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default Home;
