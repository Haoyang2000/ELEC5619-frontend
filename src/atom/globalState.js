import { atom } from "recoil";

export const loggedInUser = atom({
  key: "loggedInUser",
  default: {},
  persistence_UNSTABLE: {
    type: "loggedInUser",
  },
});

export const loadProduct = atom({
  key: "loadProduct",
  default: [],
  persistence_UNSTABLE: {
    type: "loadProduct",
  },
});

export const loadUsers = atom({
  key: "loadUsers",
  default: [],
  persistence_UNSTABLE: {
    type: "loadUsers",
  },
});

export const loadSingleProduct = atom({
  key: "loadSingleProduct",
  default: [],
  persistence_UNSTABLE: {
    type: "loadSingleProduct",
  },
});

export const chatActiveContact = atom({
  key: "chatActiveContact",
  persistence_UNSTABLE: {
    type: "chatActiveContact",
  },
});

export const chatMessages = atom({
  key: "chatMessages",
  default: [],
  persistence_UNSTABLE: {
    type: "chatMessages",
  },
});
