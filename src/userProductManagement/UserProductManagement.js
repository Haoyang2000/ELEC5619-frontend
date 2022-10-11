import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { notification } from "antd";
import { productsI, loggedInUser } from "../atom/globalState";
import { getUserProduct, deleteProduct } from "../util/ApiUtil";

import "./UserProductManagement.css";

const UserProductManagement = (props) => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadProducts(currentUser.id);
  }, []);

  const loadProducts = (userId) => {
    getUserProduct(userId)
      .then((response) => {
        console.log("loadProducts");
        console.log(response);
        setProducts(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteClick = (value) => {
    console.log(value);
    deleteProduct(value)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Deleted product successfully!",
        });
        loadProducts(currentUser.id);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
      });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
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
        <div style={{ marginLeft: "auto", marginRight: 0 }}>
          {" "}
          <div>
            <input
              type="text"
              placeholder="Search"
              className="form-control"
              onChange={(e) => setQuery(e.target.value)}
            ></input>
          </div>
        </div>
      </nav>
      <div>
        <h1 class="label">My Products</h1>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Product Id</th>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Operation</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter(
                (product) =>
                  product.productName.toLowerCase().includes(query) ||
                  product.userId.toString().toLowerCase().includes(query) ||
                  product.productId.toString().toLowerCase().includes(query) ||
                  product.price.toString().toLowerCase().includes(query) ||
                  product.category.toLowerCase().includes(query) ||
                  product.productDescription.toLowerCase().includes(query)
              )
              .map((product) => (
                <tr>
                  <td>{product.productId}</td>
                  <td>
                    {" "}
                    <img
                      src={`data:image/jpeg;base64,${product.file}`}
                      alt={product.imageName}
                      width="100"
                      height="100"
                    />
                  </td>
                  <td>{product.productName}</td>
                  <td>{product.productDescription}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>
                    <button
                      onClick={() => deleteClick(product.productId)}
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
    </div>
  );
};

export default UserProductManagement;
