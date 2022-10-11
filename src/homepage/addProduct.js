import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { DingtalkOutlined } from "@ant-design/icons";
import { signup } from "../util/ApiUtil";
import ScrollToBottom from "react-scroll-to-bottom";
import { useRecoilState } from "recoil";
import { loggedInUser, productsI } from "../atom/globalState";
import { getCurrentUser, getProductss, createProduct } from "../util/ApiUtil";

const UploadAndDisplayImage = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [products, setProducts] = useRecoilState(productsI);

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
    const formData = new FormData();

    formData.append("file", selectedImage);
    formData.append("productName", values.productName);
    formData.append("productDescription", values.productDescription);
    formData.append("price", values.price);
    formData.append("userId", currentUser.id);
    formData.append("category", values.category);

    console.log(formData);
    createProduct(formData)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Add new product successfully!",
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
      </nav>

      <h1 class="label">Add product</h1>
      <hr class="solid"></hr>
      <div class="content">
        {" "}
        {selectedImage && (
          <div>
            <img
              alt="notImage"
              width={"250px"}
              src={URL.createObjectURL(selectedImage)}
            />
            <br />
            <button onClick={() => setSelectedImage(null)}>Remove</button>
          </div>
        )}
        <br />
        <br />
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
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
              Add new product
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UploadAndDisplayImage;
