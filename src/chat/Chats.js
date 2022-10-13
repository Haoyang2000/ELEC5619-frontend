import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import {
  getUsers,
  countNewMessages,
  findChatMessages,
  findChatMessage,
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
const Chats = (props) => {
  // const currentUser = useRecoilValue(loggedInUser);
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const [text, setText] = useState("");
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
  const [messages, setMessages] = useRecoilState(chatMessages);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    connect();
    loadCurrentUser();
    loadContacts();
  }, []);

  useEffect(() => {
    if (activeContact === undefined || activeContact === null) return;
    findChatMessages(activeContact.id, currentUser.id).then((msgs) =>
      setMessages(msgs)
    );

    loadContacts();
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
    loadContacts();
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

  const loadContacts = () => {
    const promise = getUsers().then((users) =>
      users.map((contact) =>
        countNewMessages(contact.id, currentUser.id).then((count) => {
          // console.log(contact.id + " " + currentUser.id);
          contact.newMessages = count;
          return contact;
        })
      )
    );

    promise.then((promises) =>
      Promise.all(promises).then((users) => {
        setContacts(users);
        if (activeContact === undefined && users.length > 0) {
          setActiveContact(users[0]);
        }
      })
    );
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
              <div id="status-options">
                <ul>
                  <li id="status-online" class="active">
                    <span class="status-circle"></span> <p>Online</p>
                  </li>
                  <li id="status-away">
                    <span class="status-circle"></span> <p>Away</p>
                  </li>
                  <li id="status-busy">
                    <span class="status-circle"></span> <p>Busy</p>
                  </li>
                  <li id="status-offline">
                    <span class="status-circle"></span> <p>Offline</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div id="search" />
          <div id="contacts">
            <ul>
              {contacts.map((contact) => (
                <li
                  onClick={() => setActiveContact(contact)}
                  class={
                    activeContact && contact.id === activeContact.id
                      ? "contact active"
                      : "contact"
                  }
                >
                  <div class="wrap">
                    <span class="contact-status online"></span>
                    <img id={contact.id} src={contact.profilePicture} alt="" />
                    <div class="meta">
                      <p class="name">{contact.username}</p>
                      {contact.newMessages !== undefined &&
                        contact.newMessages > 0 && (
                          <p class="preview">
                            {contact.newMessages} new messages
                          </p>
                        )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div id="bottom-bar">
            <a href="/">
              <button id="addcontact">
                <i class="fa fa-user fa-fw" aria-hidden="true"></i>{" "}
                <span>Profile</span>
              </button>
            </a>
            <a href="http://localhost:8080/login">
              <button id="settings">
                <i class="fa fa-cog fa-fw" aria-hidden="true"></i>{" "}
                <span>Settings</span>
              </button>
            </a>
          </div>
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

export default Chats;
