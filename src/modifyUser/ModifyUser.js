import React, { useEffect } from "react";
import { Form, Input, Button, notification } from "antd";
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";
import { getCurrentUser, modifyUser } from "../util/ApiUtil";

const ModifyUser = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadCurrentUser();
  }, []);

  const modifyProfie = (values) => {
    // console.log(values);

    const message = {
      username: values.username,
      id: currentUser.id,
      email: values.email,
      username: values.username,
      active: currentUser.active,
      address: values.address,
      admin: currentUser.admin,
      cardId: 100,
      createTime: currentUser.createTime,
      language: currentUser.language,
      password: currentUser.password,
    };

    console.log(message);

    modifyUser(message)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Modify new profile successfully!",
        });
        props.history.push("/profile");
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
    <div class="background-color">
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
          <h1 class="label">Modify profile</h1>
          <hr class="solid"></hr>
          <div class="content">
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={modifyProfie}
            >

              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input email!",
                  },
                ]}
              >
                <Input size="large" placeholder="email" />
              </Form.Item>

              <Form.Item
                name="address"
                rules={[{ required: true, message: "Please input address!" }]}
              >
                <Input size="large" placeholder="address" />
              </Form.Item>

              <Form.Item>
                <Button
                  shape="round"
                  size="large"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Modify Profile
                </Button>
              </Form.Item>
            </Form>
          </div>
      </section>
    </div>
  );
};

export default ModifyUser;
