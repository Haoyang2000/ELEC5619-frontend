import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";
import { getCurrentUser, createComment } from "../util/ApiUtil";

const AddComment = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const productId = props.match.params.productId;

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
  }, []);

  const addComment = (values) => {
    console.log(values.rating);
    console.log(selectedImage);
    loadCurrentUser();
    const formData = new FormData();

    formData.append("file", selectedImage);
    formData.append("productId", productId);
    if (!values.rating) {
      formData.append("rating", 5);
    } else {
      formData.append("rating", values.rating);
    }
    formData.append("content", values.content);
    formData.append("userId", currentUser.id);

    console.log("data:" + formData);
    createComment(formData)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Add new comment successfully!",
        });
        props.history.push(`/detail/${productId}`);
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
          <h1 class="label">Add Comment</h1>
          <hr class="solid"></hr>
            <div class="content-img">
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
            </div>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={addComment}
            >
              <h3>What do you think of this product?</h3>
              <Form.Item name="rating">
                <select id="rating" size="large" placeholder="rating">
                  <option value="1">Very Dissatisfied</option>
                  <option value="2">Dissatisfied</option>

                  <option value="3">Neutral</option>
                  <option value="4">Satisfied</option>
                  <option value="5" selected>
                    Very satisfied
                  </option>
                </select>
              </Form.Item>

              <Form.Item
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Please input your comment!",
                  },
                ]}
              >
                <textarea rows="10" cols="60"></textarea>
              </Form.Item>

              <Form.Item>
                <Button
                  shape="round"
                  htmlType="submit"
                >
                  Add new comment
                </Button>
              </Form.Item>
            </Form>
      </section>
    </div>
  );
};

export default AddComment;
