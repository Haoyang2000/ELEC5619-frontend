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
      <section class="product">
        <h1>All Products</h1>
        <div class="container">
            <input type="text"
              placeholder="Input Keywords to Search Products" className="form-control"
              id="search-engine" style={{ width: "50" }}
              onChange={(e) => setQuery(e.target.value)}>
            </input>
        </div>
          <div class="container-product">
            {products
              .filter(
                (product) =>
                  product.productName.toLowerCase().includes(query) ||
                  product.userName.toString().toLowerCase().includes(query)
              )
              .map((product) => (
                <div class="product-background">
                   <a class="product-list" href={`/detail/${product.productId}`}>
                         <img
                           src={`data:image/jpeg;base64,${product.file}`}
                           alt={product.imageName}
                         />
                     <p class="product-name">{product.productName}</p>
                     <p class="product-user"> {product.userName}</p>
                     <p class="product-user">$ {product.price}</p>
                     {" "}
                   </a>
                    <button
                      onClick={() => deleteClick(product.productId)}
                      type="button"
                      class="btn btn-danger  mr-3"
                    >
                      Delete
                    </button>
                </div>

              ))}
          </div>
      </section>
      </div>
    );

    if (localStorage.getItem("name") === "Admin") {
      return content;
    } else {
      props.history.push("/error/401");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
  };

  return (
    <div class="background-color">
      <nav class="nav-container">
        <p> All-Lingual | Admin </p>
        <div class="nav-item">
            <a href="/chats">Chats</a>
            <a href="/userManagement">User Management</a>
            <a href="/productManagement">Product Management</a>
            <a href="#" onClick={logout}>Logout</a>
        </div>
      </nav>
        {loadContentforAdmin()}
    </div>
  );
};

export default ProductManagement;
