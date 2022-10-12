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
    console.log(values);
    console.log(selectedImage);
    loadCurrentUser();
    const formData = new FormData();

    formData.append("file", selectedImage);
    formData.append("productId", productId);
    formData.append("rating", values.rating);
    formData.append("content", values.content);
    formData.append("userId", currentUser.id);

    console.log(formData);
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

  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/">
          Hello, {currentUser.username}
        </a>
        <div class="navbar-nav">
          <a class="nav-item nav-link active" href="/">
            Home <span class="sr-only">(current)</span>
          </a>
          <a class="nav-item nav-link" href="/profile">
            Profile
          </a>
          <a class="nav-item nav-link" href="/chats">
            Chat
          </a>
          <a class="nav-item nav-link" href="/cart">
            Cart
          </a>
        </div>
      </nav>

      <h1 class="label">Add Comment</h1>
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
          onFinish={addComment}
        >
          <Form.Item
            name="rating"
            rules={[{ required: true, message: "Please input rating!" }]}
          >
            <Input
              size="large"
              placeholder="Input rating between the number 1 and 5"
            />
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
            <Input size="large" placeholder="Please input comment" />
          </Form.Item>

          <Form.Item>
            <Button
              shape="round"
              size="large"
              htmlType="submit"
              className="login-form-button"
            >
              Add new comment
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddComment;
