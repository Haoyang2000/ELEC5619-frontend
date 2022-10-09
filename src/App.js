import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Signin from "./signin/Signin";
import Signup from "./signup/Signup";
import Home from "./homepage/Home";
import Profile from "./profile/Profile";
import Chat from "./chat/Chat";
import Cart from "./cart/Cart";
import Detail from "./detail/Detail";
import ChangePassword from "./changePassword/ChangePassword";
import UserManagement from "./userManagement/UserManagement";
import ProductManagement from "./productManagement/ProductManagement";
import CommentManagement from "./commentManagement/CommentManagement";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

export const AppContext = React.createContext();
const App = (props) => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} />} />
          <Route
            exact
            path="/profile"
            render={(props) => <Profile {...props} />}
          />

          <Route
            exact
            path="/login"
            render={(props) => <Signin {...props} />}
          />
          <Route
            exact
            path="/signup"
            render={(props) => <Signup {...props} />}
          />
          <Route exact path="/chat" render={(props) => <Chat {...props} />} />
          <Route exact path="/cart" render={(props) => <Cart {...props} />} />
          <Route
            exact
            path="/detail/:productId"
            render={(props) => <Detail {...props} />}
          />
          <Route
            exact
            path="/changepassword"
            render={(props) => <ChangePassword {...props} />}
          />
          <Route
            exact
            path="/UserManagement"
            render={(props) => <UserManagement {...props} />}
          />
          <Route
            exact
            path="/ProductManagement"
            render={(props) => <ProductManagement {...props} />}
          />
          <Route
            exact
            path="/CommentManagement"
            render={(props) => <CommentManagement {...props} />}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
