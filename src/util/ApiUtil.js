const AUTH_SERVICE = "http://localhost:8080";
const CHAT_SERVICE = "http://localhost:8080";

const request = (options) => {
  const headers = new Headers();

  if (
    options.setContentType !== false &&
    options.url !== "http://localhost:8080/products/add"
  ) {
    headers.append("Content-Type", "application/json");
  }

  console.log(localStorage);
  if (localStorage.getItem("accessToken")) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("accessToken")
    );
  }
  console.log(headers);
  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);
  console.log(options);
  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      console.log(response);
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function login(loginRequest) {
  return request({
    url: AUTH_SERVICE + "/signin",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function facebookLogin(facebookLoginRequest) {
  return request({
    url: AUTH_SERVICE + "/facebook/signin",
    method: "POST",
    body: JSON.stringify(facebookLoginRequest),
  });
}

export function signup(signupRequest) {
  return request({
    url: AUTH_SERVICE + "/users",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}

export function createProduct(createRequest, image) {
  return request({
    url: AUTH_SERVICE + "/products/add",
    method: "POST",
    body: createRequest,
  });
}

// get single product
export function getSingleProduct(productId) {
  return request({
    url: AUTH_SERVICE + "/product/" + productId,
    method: "GET",
  });
}

// get single user
export function getSingleUser(userId) {
  return request({
    url: AUTH_SERVICE + "/user/" + userId,
    method: "GET",
  });
}

// delete single product
export function deleteProduct(productId) {
  return request({
    url: AUTH_SERVICE + "/product/delete/" + productId,
    method: "POST",
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }
  console.log("have token");
  return request({
    url: AUTH_SERVICE + "/users/me",
    method: "GET",
  });
}

export function getUsers() {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: AUTH_SERVICE + "/users/summaries",
    method: "GET",
  });
}

// Haoyang's fake api
export function getProducts() {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: "https://randomuser.me/api/?results=20",
    method: "GET",
  });
}

// get all products
export function getProductss() {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: AUTH_SERVICE + "/product/main",
    method: "GET",
  });
}

// get products from a user
export function getUserProduct(userId) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: AUTH_SERVICE + "/productOfUser/" + userId,
    method: "GET",
  });
}

// delete user
export function deleteUser(deleteRequest) {
  return request({
    url: AUTH_SERVICE + "/admin/delete",
    method: "POST",
    body: JSON.stringify(deleteRequest),
  });
}

// modify user
export function modifyUser(modifyUser) {
  return request({
    url: AUTH_SERVICE + "/admin/modifyProfile",
    method: "POST",
    body: JSON.stringify(modifyUser),
  });
}

// change password
export function changepassword(loginRequest) {
  return request({
    url: AUTH_SERVICE + "/users/changepassword",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

// modify product
export function modifyProduct(productId, requestBody) {
  return request({
    url: AUTH_SERVICE + "/product/update/" + productId,
    method: "POST",
    body: JSON.stringify(requestBody),
  });
}

// chatting
export function countNewMessages(senderId, recipientId) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + senderId + "/" + recipientId + "/count",
    method: "GET",
  });
}

export function findChatMessages(senderId, recipientId) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + senderId + "/" + recipientId,
    method: "GET",
  });
}

export function findChatMessage(id) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + id,
    method: "GET",
  });
}
