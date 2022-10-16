import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { DingtalkOutlined } from "@ant-design/icons";
import { signup } from "../util/ApiUtil";
import ScrollToBottom from "react-scroll-to-bottom";
import { useRecoilState } from "recoil";
import { loggedInUser, productsI } from "../atom/globalState";
import {
  getCurrentUser,
  getProductss,
  createProduct,
  modifyProduct,
} from "../util/ApiUtil";

const ModifyProduct = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [products, setProducts] = useRecoilState(productsI);
  const productId = props.match.params.productId;

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadProducts();
  }, []);

  const addProduct = (values) => {
    console.log(values);
    console.log(selectedImage);
    loadCurrentUser();

    const message = {
      productId: productId,
      productDescription: values.productDescription,
      price: values.price,
      productName: values.productName,
      category: values.category,
    };

    console.log(message);

    modifyProduct(productId, message)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Modify new product successfully!",
        });
        props.history.push("/UserProductManagement");
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

  const loadCurrentUser = () => {
    getCurrentUser()
      .then((response) => {
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
          <h1 class="label">Modify product</h1>
          <hr class="solid"></hr>
          <div class="content">
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={addProduct}
            >
              <Form.Item
                name="productName"
                rules={[
                  { required: true, message: "Please input your product name!" },
                ]}
              >
                <Input size="large" placeholder="Product Name" />
              </Form.Item>

              <Form.Item
                name="productDescription"
                rules={[
                  {
                    required: true,
                    message: "Please input your product description!",
                  },
                ]}
              >
                <Input size="large" placeholder="Product Description" />
              </Form.Item>

              <Form.Item
                name="price"
                rules={[
                  { required: true, message: "Please input your product price!" },
                ]}
              >
                <Input size="large" placeholder="Product Price" />
              </Form.Item>

              <Form.Item
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please input your product category!",
                  },
                ]}
              >
                <Input size="large" placeholder="Product Category" />
              </Form.Item>

              <Form.Item>
                <Button
                  shape="round"
                  size="large"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Modify product
                </Button>
              </Form.Item>
            </Form>
          </div>
      </section>
      <footer>
        <p>Author: ELEC5619-Group 2Spring 2022 USYD ---- Spring 2022 USYD</p>
        <p><a href="https://github.com/jzha9393/ELEC5619/tree/eric">Backend Github Link</a></p>
      </footer>
    </div>
  );
};

export default ModifyProduct;
