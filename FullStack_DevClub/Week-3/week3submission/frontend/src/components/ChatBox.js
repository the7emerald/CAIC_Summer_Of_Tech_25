import React, { useEffect, useRef, useState } from "react";
import { getDatabase, set, ref, remove, onValue } from "firebase/database";
import { database, auth } from "../utils/firebase";
import Message from "./Message";
import TypeBox from "./TypeBox";


const ChatBox = ({ partnerId }) => {
  console.log(partnerId);
  //   const [messages, setMessages] = useState([]);

  //   useEffect(() => {
  //     const q = query(
  //       collection(db, "messages"),
  //       orderBy("createdAt", "desc"),
  //       limit(50)
  //     );

  //     const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
  //       const fetchedMessages = [];
  //       QuerySnapshot.forEach((doc) => {
  //         fetchedMessages.push({ ...doc.data(), id: doc.id });
  //       });
  //       const sortedMessages = fetchedMessages.sort(
  //         (a, b) => a.createdAt - b.createdAt
  //       );
  //       setMessages(sortedMessages);
  //     });
  //     return () => unsubscribe;
  //   }, []);


  const [messages, setMsgList] = useState();

  let currentUser = auth.currentUser;
  useEffect(() => {
    const timer = setTimeout(() => {

      currentUser = auth.currentUser;
      console.log(partnerId);

      if (currentUser && partnerId) {
        const chatRef = ref(database, 'Chat');
        onValue(chatRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            console.log(data);
            const myMessages = Object.entries(data)
              .filter(([id, msg]) =>
                (msg.sender === currentUser.uid && msg.receiver === partnerId) ||
                (msg.sender === partnerId && msg.receiver === currentUser.uid)
              )
              .sort((a, b) => new Date(a[1].date + ' ' + a[1].time) - new Date(b[1].date + ' ' + b[1].time));

            setMsgList(myMessages);
            console.log(messages);
          }
        });
      }
    }, 500);
  }, [currentUser, partnerId]);

  const func = () => {
    console.log(messages);
    console.log(partnerId);

  }

  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {messages ? 
        (messages.map((message) => (
          <Message msgData={message} />
        ))) : 
        (<h1><center>Click a chat</center></h1>)}
        {/* <button onClick={func}>hi</button> */}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      {/* <span ref={scroll}></span> */}
      <TypeBox />
    </main>
  );
};

export default ChatBox;