import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loggedInUser, FakeUser, loadProduct } from "../atom/globalState";
import { getCurrentUser, getFakeusers, getProducts } from "../util/ApiUtil";

import "./Cart.css";

const Cart = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [products, setProducts] = useRecoilState(loadProduct);
  const [totalPrice, setTotalPricie] = useState();

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadCurrentUser();
    loadProducts();
    setTotalPricie(0);
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
      <div class="cart">
        <div class="row">
          <div class="col-sm-12 col-md-10 col-md-offset-1">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th class="text-center">Price</th>
                  <th class="text-center">Total</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr>
                    <td class="col-sm-8 col-md-6">
                      <div class="media">
                        <a class="thumbnail pull-left" href="#">
                          {" "}
                          <img
                            class="media-object"
                            style={{ width: 72, height: 72 }}
                            src={product.picture.large}
                          />{" "}
                        </a>
                        <div class="media-body">
                          <h5 class="media-heading">
                            Product name: <a href="#">{product.name.first}</a>
                          </h5>
                          <h6 class="media-heading">
                            {" "}
                            by <a href="#">{product.name.last}</a>
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td
                      class="col-sm-1 col-md-1"
                      style={{ textAlign: "center" }}
                    >
                      <input
                        type="email"
                        class="form-control"
                        id="exampleInputEmail1"
                        value="1"
                      />
                    </td>
                    <td class="col-sm-1 col-md-1 text-center">
                      <p>${product.dob.age}</p>
                    </td>
                    <td class="col-sm-1 col-md-1 text-center">
                      <p>${product.dob.age}</p>
                    </td>
                    <td class="col-sm-1 col-md-1">
                      <button type="button" class="btn btn-danger">
                        <span class="glyphicon glyphicon-remove"></span> Remove
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>   </td>
                  <td>   </td>
                  <td>   </td>
                  <td>
                    <h3>Total</h3>
                  </td>
                  <td class="text-right">
                    <h3>
                      <strong>{totalPrice}</strong>
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td>   </td>
                  <td>   </td>
                  <td>   </td>
                  <td>
                    <a href="/">
                      <btn
                        onclick="/"
                        className="btn btn-secondary btn-mid mr-3"
                      >
                        Continue Shopping
                      </btn>
                    </a>
                  </td>
                  <td>
                    <button type="button" class="btn btn-success">
                      Checkout <span class="glyphicon glyphicon-play"></span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
