import React, { useEffect, useRef, useState } from "react";
import { getDatabase, set, ref, remove, onValue } from "firebase/database";
import { database, auth } from "../utils/firebase";
import Message from "./Message";
import TypeBox from "./TypeBox";


const ChatBox = ({ partnerId }) => {
  console.log(partnerId);
  const scroll = useRef()
  const [messages, setMsgList] = useState(null);
  let currentUser = auth.currentUser;

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    // const timer = setTimeout(() => {
    currentUser = auth.currentUser;
    console.log(partnerId);

    if (currentUser && partnerId) {
      const chatRef = ref(database, 'Chat');
      onValue(chatRef, async (snapshot) => {
        const data = await snapshot.val();
        if (data) {
          const myMessages = Object.entries(data)
            .filter(([id, msg]) =>
              (msg.sender === currentUser.uid && msg.receiver === partnerId) ||
              (msg.sender === partnerId && msg.receiver === currentUser.uid)
            )
            .sort((a, b) => new Date(a[1].date + ' ' + a[1].time) - new Date(b[1].date + ' ' + b[1].time));

          setMsgList(myMessages);
          console.log(partnerId)
        }
      });
    }
    // }, 1000);
  }, [currentUser, partnerId]);


  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {messages ?
          (
            messages.map((message) => (
              < Message msgData={message} />
            ))
          ) : (
            <h1><center>Click a chat</center></h1>
          )
        }
        <div ref={scroll} />
      </div>
      <TypeBox partnerId={partnerId} />
    </main>
  );
};

export default ChatBox;