import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, notification } from "antd";
import {
  UserOutlined,
  LockOutlined,
  DingtalkOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import { login, facebookLogin } from "../util/ApiUtil";
import "./Signin.css";

/*global FB*/

const Signin = (props) => {
  const [loading, setLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [test, setTest] = useState(localStorage.getItem("accessToken"));

  // useEffect(() => {
  //   if (localStorage.getItem("accessToken") !== null) {
  //     console.log("signed in")
  //     props.history.push("/chat");
  //   }
  //   initFacebookLogin();
  // }, []);

  // useEffect(() => {
  //   initFacebookLogin();
  // }, [test]);

  // const initFacebookLogin = () => {
  //   console.log("facebook is called")
  //   window.fbAsyncInit = function () {
  //     FB.init({
  //       appId: "118319422120166",
  //       autoLogAppEvents: true,
  //       xfbml: true,
  //       version: "v7.0",
  //     });
  //   };
  // };

  const getFacebookAccessToken = () => {
    // setFacebookLoading(true);
    // FB.login(
    //   function (response) {
    //     if (response.status === "connected") {
    //       const facebookLoginRequest = {
    //         accessToken: response.authResponse.accessToken,
    //       };
    //       facebookLogin(facebookLoginRequest)
    //         .then((response) => {
    //           localStorage.setItem("accessToken", response.accessToken);
    //           props.history.push("/");
    //           setFacebookLoading(false);
    //         })
    //         .catch((error) => {
    //           if (error.status === 401) {
    //             notification.error({
    //               message: "Error",
    //               description: "Invalid credentials",
    //             });
    //           } else {
    //             notification.error({
    //               message: "Error",
    //               description:
    //                 error.message ||
    //                 "Sorry! Something went wrong. Please try again!",
    //             });
    //           }
    //           setFacebookLoading(false);
    //         });
    //     } else {
    //       console.log(response);
    //     }
    //   },
    //   { scope: "email" }
    // );
  };

  const onFinish = (values) => {
    setLoading(true);

    login(values)
      .then((response) => {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("name", values.username)
        console.log("signed in");
        props.history.push("/");
        setLoading(false);
      })
      .catch((error) => {
        if (error.status === 401) {
          notification.error({
            message: "Error",
            description: "Username or Password is incorrect. Please try again!",
          });
        } else {
          notification.error({
            message: "Error",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        }
        setLoading(false);
      });
  };

  return (
    <div class="container">
      <div class="title">
        <h3>Login and connect to the world</h3>
        <hr class="solid"></hr>
      </div>
      <div className="login-container">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              shape="round"
              size="large"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
          {/* <Divider>OR</Divider>
        <Form.Item>
          <Button
            icon={<FacebookFilled style={{ fontSize: 20 }} />}
            loading={facebookLoading}
            className="login-with-facebook"
            shape="round"
            size="large"
            // onClick={getFacebookAccessToken}
          >
            Log in With Facebook
          </Button>
        </Form.Item> */}
          <hr class="solid"></hr>
          Not a member yet? <a href="/signup">Sign up</a>
        </Form>
      </div>
    </div>
  );
};

export default Signin;
