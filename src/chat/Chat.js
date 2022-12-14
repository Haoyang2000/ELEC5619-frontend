import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import {
  getUsers,
  countNewMessages,
  findChatMessages,
  findChatMessage,
  getSingleUser,
} from "../util/ApiUtil";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  loggedInUser,
  chatActiveContact,
  chatMessages,
} from "../atom/globalState";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import { getCurrentUser } from "../util/ApiUtil";

var stompClient = null;
const Chat = (props) => {
  // const currentUser = useRecoilValue(loggedInUser);
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [text, setText] = useState("");
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
  const [messages, setMessages] = useRecoilState(chatMessages);
  const [query, setQuery] = useState("");
  const userId = props.match.params.userId;

  useEffect(() => {
    console.log("hi");
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    connect();
    loadCurrentUser();
    loadActiveUser(userId);
    console.log(userId);
  }, []);

  useEffect(() => {
    if (activeContact === undefined || activeContact === null) return;
    console.log(activeContact, currentUser);
    findChatMessages(activeContact.id, currentUser.id).then((msgs) =>
      setMessages(msgs)
    );

    // loadContacts(userId);
  }, [activeContact]);

  const loadCurrentUser = () => {
    getCurrentUser()
      .then((response) => {
        setLoggedInUser(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadActiveUser = (userId) => {
    getSingleUser(userId)
      .then((response) => {
        setActiveContact(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const connect = () => {
    const Stomp = require("stompjs");
    var SockJS = require("sockjs-client");
    SockJS = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(SockJS);
    console.log("before connection");
    stompClient.connect({}, onConnected, onError);
    console.log("after connecitoon");
  };

  const onConnected = () => {
    console.log("connected");
    console.log(currentUser);
    stompClient.subscribe(
      "/user/" + currentUser.id + "/queue/messages",
      onMessageReceived
    );
  };

  const onError = (err) => {
    console.log(err);
  };

  const onMessageReceived = (msg) => {
    console.log("front end recievd ");
    const notification = JSON.parse(msg.body);
    const active = JSON.parse(
      sessionStorage.getItem("recoil-persist")
    ).chatActiveContact;

    if (active.id === notification.senderId) {
      findChatMessage(notification.id).then((message) => {
        const newMessages = JSON.parse(
          sessionStorage.getItem("recoil-persist")
        ).chatMessages;
        newMessages.push(message);
        setMessages(newMessages);
      });
    } else {
      message.info("Received a new message from " + notification.senderName);
      findChatMessages(currentUser.id, activeContact.id).then((msgs) =>
        setMessages(msgs)
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
  };

  const sendMessage = (msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: currentUser.id,
        recipientId: activeContact.id,
        senderName: currentUser.username,
        recipientName: activeContact.username,
        content: msg,
        timestamp: new Date(),
      };
      stompClient.send("/app/chat", {}, JSON.stringify(message));
      console.log("sent msg to stomp");
      const newMessages = [...messages];
      newMessages.push(message);
      setMessages(newMessages);
    }
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

      <div id="frame">
        <div id="sidepanel">
          <div id="profile">
            <div class="wrap">
              <img
                id="profile-img"
                src={currentUser.profilePicture}
                class="online"
                alt=""
              />
              <p>{currentUser.username}</p>
            </div>
          </div>
          <div id="search" />
        </div>
        <div class="content">
          <div class="contact-profile">
            <img src={activeContact && activeContact.profilePicture} alt="" />
            <p>{activeContact && activeContact.username}</p>
          </div>
          <ScrollToBottom className="messages">
            <ul>
              {messages.map((msg) => (
                <li
                  class={
                    msg.senderId.toString() === currentUser.id.toString()
                      ? "sent"
                      : "replies"
                  }
                >
                  {/* {msg.senderId !== currentUser.id && (
                  <img src={activeContact.profilePicture} alt="" />
                )} */}
                  <p>
                    {msg.senderId.toString() === currentUser.id.toString()
                      ? msg.content
                      : msg.translatedContent}
                  </p>
                </li>
              ))}
            </ul>
          </ScrollToBottom>
          <div class="message-input">
            <div class="wrap">
              <input
                name="user_input"
                size="large"
                placeholder="Write your message..."
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    sendMessage(text);
                    setText("");
                  }
                }}
              />

              <Button
                icon={<i class="fa fa-paper-plane" aria-hidden="true"></i>}
                onClick={() => {
                  sendMessage(text);
                  setText("");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
