import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { loggedInUser, FakeUser, loadProduct } from "../atom/globalState";
import { getCurrentUser, getFakeusers, getProducts } from "../util/ApiUtil";

import "./Detail.css";

const Detail = (props) => {
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
                    <img src="http://placekitten.com/400/252" />
                  </div>
                </div>
              </div>
              <div class="details col-md-6">
                <h3 class="product-title">men's shoes fashion</h3>
                <div class="rating">
                  <span class="review-no">{products.length} reviews</span>
                </div>
                <p class="product-description">
                  Suspendisse quos? Tempus cras iure temporibus? Eu laudantium
                  cubilia sem sem! Repudiandae et! Massa senectus enim minim
                  sociosqu delectus posuere.
                </p>
                <h4 class="price">
                  current price: <span>${products[1].dob.age}</span>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: "30px" }}>Comments</h3>
        <hr class="solid"></hr>

        {products.map((product) => (
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
        ))}
      </div>
    </div>
  );
};

export default Detail;
