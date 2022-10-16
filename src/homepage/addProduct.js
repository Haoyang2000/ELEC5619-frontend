import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification } from "antd";
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
        props.history.push("/");
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

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
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
          <h1 class="label">Add new product</h1>
          <hr class="solid"></hr>
          <div class="content">
            <div>
            {" "}
            {selectedImage && (
              <div>
                <img
                  alt="notImage"
                  src={URL.createObjectURL(selectedImage)}
                />
                <br />
                <button onClick={() => setSelectedImage(null)}>Remove</button>
              </div>
            )}
            <br />
            <br />
            <input class="margin-bottom"
              type="file"
              name="myImage"
              onChange={(event) => {
                console.log(event.target.files[0]);
                setSelectedImage(event.target.files[0]);
              }}
            />
            </div>
            <div class="product-form">
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
                <Input placeholder="Product Name" />
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
                <textarea placeholder=" Product Description" rows="10" cols="60"></textarea>
              </Form.Item>
              <Form.Item
                name="price"
                rules={[
                  { required: true, message: "Please input your product price!" },
                ]}
              >
                <Input placeholder="Product Price" />
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
                <Input placeholder="Product Category" />
              </Form.Item>

              <Form.Item>
                <Button
                  shape="round"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Add new product
                </Button>
              </Form.Item>
            </Form>
            </div>
          </div>
      </section>
    </div>
  );
};

export default UploadAndDisplayImage;
