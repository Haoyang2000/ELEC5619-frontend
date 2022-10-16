import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { notification } from "antd";
import { productsI, loggedInUser } from "../atom/globalState";
import { getUserProduct, deleteProduct } from "../util/ApiUtil";

import "../homepage/Home.css";

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
      <section class="product">
        <h1>My Products</h1>
        <div class="container">
            <input type="text"
              placeholder="Input Keywords to Search Products" className="form-control"
              id="search-engine" style={{ width: "50" }}
              onChange={(e) => setQuery(e.target.value)}>
            </input>
            <a class="add-product-btn" href="/addproduct">Add new product</a>
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
                   </a>
                    <button
                      onClick={() => deleteClick(product.productId)}
                      type="button"
                      class="btn btn-danger  mr-3"
                    >
                      Delete
                    </button>
                    <a href={`/modifyProduct/${product.productId}`}>
                      <button type="button" class="btn btn-warning">
                        Modify
                      </button>
                    </a>
                </div>
              ))}
          </div>
      </section>
      <footer>
        <p>Author: ELEC5619-Group 2Spring 2022 USYD ---- Spring 2022 USYD</p>
        <p><a href="https://github.com/jzha9393/ELEC5619/tree/eric">Backend Github Link</a></p>
      </footer>
    </div>
  );
};

export default UserProductManagement;

