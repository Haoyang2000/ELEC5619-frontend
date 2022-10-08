import React, { useEffect } from "react";
import { Card, Avatar, Form, Input, Button, notification } from "antd";
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";
import { LogoutOutlined } from "@ant-design/icons";
import { getCurrentUser, changepassword } from "../util/ApiUtil";
import "./ChangePassword.css";

const { Meta } = Card;

const ChangePassword = (props) => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadCurrentUser();
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

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
  };

  const change = (values) => {
    console.log(values);
    const info = {
      id: currentUser.id,
      password: values.old_password,
      newPassword: values.password,
    };
    changepassword(info)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Your password has been changed",
        });
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

  return (
    <div className="profile-container">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={change}
      >
        <Form.Item
          name="old_password"
          rules={[
            { required: true, message: "Please input your Old Password" },
          ]}
        >
          <Input size="large" placeholder="Old password" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your New Password!" },
          ]}
        >
          <Input size="large" type="password" placeholder="New password" />
        </Form.Item>
        <Form.Item>
          <Button
            shape="round"
            size="large"
            htmlType="submit"
            className="login-form-button"
          >
            Change password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
