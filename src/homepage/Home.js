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

  const logout = () => {
      localStorage.removeItem("accessToken");
      props.history.push("/login");
    };

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
    console.log(currentUser.username);

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

  const detail = (name) => {
    {
      let detail = (
        <p>This is your product</p>
      );
      if (currentUser.username === name) {
        return detail;
      } else return null;
    }
  };

  const chat = (name) => {
    {
      let chat = <btn className="btn btn-warning btn-mid mr-3">Chat</btn>;
      if (currentUser.username === name) {
        return null;
      } else return chat;
    }
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
        <h1>Our best products</h1>
        <input type="text"
          placeholder="Input Keywords to Search Products" className="form-control"
          id="search-engine" style={{ width: "50" }}
          onChange={(e) => setQuery(e.target.value)}>
        </input>
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
                        {detail(product.userName)}
                     <a href={`/chat/${product.userId}`}>
                        {chat(product.userName)}
                     </a>
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

export default Home;
