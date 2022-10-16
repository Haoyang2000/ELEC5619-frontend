import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loggedInUser, FakeUser, loadProduct } from "../atom/globalState";
import {
  getCart,
  getCurrentUser,
  getFakeusers,
  getProducts,
  deleteCart,
  modifyCart,
} from "../util/ApiUtil";
import { notification } from "antd";

import "./Cart.css";

const Cart = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadProducts();
  }, []);

  const logout = () => {
      localStorage.removeItem("accessToken");
      props.history.push("/login");
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
        const code = error.status
        props.history.push("/error/" + code)
      });
  };

  const loadProducts = () => {
    getCart(currentUser.id)
      .then((response) => {
        console.log("load cart");
        console.log(response);
        setProducts(response);
        console.log(products);
      })
      .catch((error) => {
        const code = error.status
        props.history.push("/error/" + code)
        console.log(error);
      });
  };

  const deleteClick = (value) => {
    console.log("value" + value);
    deleteCart(value)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Deleted product successfully!",
        });
        loadProducts();
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
      });
  };

  const buyProduct = () => {
    products.map((product) => {
      deleteCart(product.cartId)
        .then((response) => {})
        .catch((error) => {
          notification.error({
            message: "Error",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        });
    });
    props.history.push("/");
    notification.success({
      message: "Success",
      description: "Buy product successfully!",
    });
  };

  const plusClick = (cartId, quantity) => {
    modifyCart(cartId, quantity)
      .then((response) => {
        loadProducts();
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
      });
  };

  const minusClick = (cartId, quantity) => {
    if (quantity == 0) {
      deleteClick(cartId);
    } else {
      modifyCart(cartId, quantity)
        .then((response) => {
          loadProducts();
        })
        .catch((error) => {
          notification.error({
            message: "Error",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        });
    }
  };
  return (
    <div class="background-color">
      <nav class="nav-container">
        <a class="logo" href="/"> All-Lingual | {currentUser.username}</a>
        <div class="nav-item">
            <a href="/chats">Chats</a>
            <a href="/cart">Cart</a>
            <a href="/UserProductManagement"
               onclick="/addproduct">
               My Products
            </a>
            <a href={`/usercommentmanagement`}>
              My Comments
            </a>
            <a href="/profile">Profile</a>
            <a href="#" onClick={logout}>Logout</a>
        </div>
      </nav>

      <section>
          <h1>My Shopping Cart</h1>
          <div class="cart">
            <div class="row">
              <div class="col-sm-12 col-md-10 col-md-offset-1">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th class="text-center">Quantity</th>
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
                            <div class="media-body">
                              <h5 class="media-heading">
                                Product name: <a href="#">{product.productName}</a>
                              </h5>
                              <h6 class="media-heading">
                                {" "}
                                by <a href="#">{product.userName}</a>
                              </h6>
                            </div>
                          </div>
                        </td>
                        <td class="col-sm-1 col-md-8 text-center">
                          <div>
                            <button
                              onClick={() => {
                                minusClick(product.cartId, product.quantity - 1);
                              }}
                              type="button"
                              class="btn btn-warning btn-sm mr-3"
                            >
                              -
                            </button>
                            <button
                              onClick={() =>
                                plusClick(product.cartId, product.quantity + 1)
                              }
                              type="button"
                              class="btn btn-success btn-sm"
                            >
                              +
                            </button>
                            <p>{product.quantity}</p>
                          </div>
                        </td>
                        <td class="col-sm-1 col-md-3 text-center">
                          <p>${product.price}</p>
                        </td>
                        <td class="col-sm-1 col-md-3 text-center">
                          <p>${product.price * product.quantity}</p>
                        </td>
                        <td class="col-sm-1 col-md-1">
                          <button
                            onClick={() => deleteClick(product.cartId)}
                            type="button"
                            class="btn btn-danger"
                          >
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
                          <strong>
                            $
                            {products.reduce(
                              (total, item) => total + item.price * item.quantity,
                              0
                            )}
                          </strong>
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
                        <button
                          onClick={() => {
                            buyProduct();
                          }}
                          type="button"
                          class="btn btn-success"
                        >
                          Checkout <span class="glyphicon glyphicon-play"></span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </section>

    </div>
  );
};

export default Cart;
