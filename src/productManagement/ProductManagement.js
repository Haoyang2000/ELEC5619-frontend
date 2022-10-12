import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { notification } from "antd";
import { productsI, loggedInUser } from "../atom/globalState";
import { getProductss, deleteProduct } from "../util/ApiUtil";

import "./ProductManagement.css";

const ProductManagement = (props) => {
  const [products, setProducts] = useRecoilState(productsI);
  const [query, setQuery] = useState("");
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadProducts();
  }, []);

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

  const deleteClick = (value) => {
    console.log(value);
    deleteProduct(value)
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

  // Only display content for admin!
  const loadContentforAdmin = () => {
    let content = (
      <div>
        <h1 class="label">Product Management</h1>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Product Id</th>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">Operation</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter(
                (product) =>
                  product.productName.toLowerCase().includes(query) ||
                  product.productId.toString().toLowerCase().includes(query) ||
                  product.price.toString().toLowerCase().includes(query) ||
                  product.category.toLowerCase().includes(query) ||
                  product.productDescription.toLowerCase().includes(query) ||
                  product.userName.toString().toLowerCase().includes(query)
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

                  <td>{product.userName}</td>

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
    );

    let warning = <div></div>;
    if (currentUser.username == "Admin") return content;
    else return warning;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
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
          <a class="nav-item nav-link" href="/commentManagement">
            Comment Management
          </a>
        </div>
        <div style={{ marginLeft: "auto", marginRight: "50px" }}>
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
        <btn onClick={logout} className="btn btn-danger btn-mid mr-1">
          Logout
        </btn>
      </nav>
      <div>{loadContentforAdmin()}</div>
    </div>
  );
};

export default ProductManagement;
