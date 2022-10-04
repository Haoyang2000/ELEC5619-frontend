import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { loggedInUser, FakeUser, loadProduct } from "../atom/globalState";
import { getCurrentUser, getFakeusers, getProducts } from "../util/ApiUtil";

import "./Home.css";

const Home = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [products, setProducts] = useRecoilState(loadProduct);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadCurrentUser();
    loadProducts();
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
    getProducts()
      .then((response) => {
        console.log("loadProducts");
        console.log(response);
        setProducts(response.results);
        // name = response.title;
        // console.log(user);

        console.log(products);
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
        <a class="navbar-brand">Hello {currentUser.name}</a>
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
          <a
            style={{ marginLeft: "1000px" }}
            class="nav-item nav-link"
            href="/cart"
          >
            Cart
          </a>
        </div>
      </nav>
      <h1 class="label">Our best products</h1>
      <hr class="solid"></hr>
      <div class="product">
        {products.map((product) => (
          <div>
            {" "}
            <div class="display-flex">
              <div class="div-size-img">
                <img src={product.picture.large}></img>
              </div>

              <div class="div-size-content">
                <h4>Product name</h4>
                <p>{product.name.first}</p>
              </div>
              <div class="div-size-button">
                <h4>Owner</h4>
                <p> {product.name.last}</p>
              </div>
              <div class="div-size-button">
                <a href="/detail">
                  <btn onclick="/" className="btn btn-secondary btn-mid mr-3">
                    Buy
                  </btn>
                </a>
                <a href="/">
                  <btn onclick="/" className="btn btn-secondary btn-mid mr-3">
                    Chat
                  </btn>
                </a>
              </div>
            </div>{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;