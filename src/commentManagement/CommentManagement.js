import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { loggedInUser, FakeUser, loadProduct } from "../atom/globalState";
import { getCurrentUser, getFakeusers, getProducts } from "../util/ApiUtil";

import "./CommentManagement.css";

const CommentManagement = (props) => {
  const [products, setProducts] = useRecoilState(loadProduct);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    loadProducts();
  }, []);

  const loadProducts = () => {
    getProducts()
      .then((response) => {
        console.log("loadProducts");
        console.log(response);
        setProducts(response.results);
        // name = response.title;
        // console.log(user);

        console.log(products);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Only display content for admin!
  const loadContentforAdmin = () => {
    let content = (
      <div>
        {" "}
        <h1 class="label">User Management</h1>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">User Id</th>
              <th scope="col">Name</th>
              <th scope="col">Language</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">Create Time</th>
              <th scope="col">Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Larry</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>Larry</td>
              <td>Mark</td>
              <td>
                <button type="button" class="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>Larry</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>Larry</td>
              <td>Mark</td>
              <td>
                <button type="button" class="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>Larry</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>Larry</td>
              <td>Mark</td>
              <td>
                <button type="button" class="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>Larry</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>Larry</td>
              <td>Mark</td>
              <td>
                <button type="button" class="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );

    let warning = (
      <div>
        // <h1>You are not admin!</h1>
      </div>
    );
    if (0) return content;
    else return warning;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
  };

  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand">Hello Admin</a>
        <btn onClick={logout} className="btn btn-secondary btn-mid mr-3">
          Logout
        </btn>
        <div class="navbar-nav">
          <a class="nav-item nav-link" href="/chats">
            Enquiry
          </a>
          <a class="nav-item nav-link" href="/userManagement">
            User Management
          </a>
          <a class="nav-item nav-link" href="/productManagement">
            Product Management
          </a>
          <a class="nav-item nav-link" href="/commentManagement">
            Comment Management
          </a>
        </div>
        <div style={{ marginLeft: "auto", marginRight: 0 }}>
          {" "}
          <div>
            <input
              type="text"
              placeholder="Search"
              className="form-control"
              // onChange={(e) => setQuery(e.target.value)}
            ></input>
          </div>
        </div>
      </nav>
      <div>{loadContentforAdmin()}</div>
    </div>
  );
};

export default CommentManagement;
