import React, { useEffect, useRef, useState, useMemo } from "react";
import { getDatabase, set, ref, remove, onValue } from "firebase/database";
import { database, auth } from "../utils/firebase";
import Message from "./Message";
import TypeBox from "./TypeBox";


const ChatBox = ({ partnerId }) => {
  console.log(partnerId);
  const scroll = useRef()
  const [messages, setMsgList] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    // const timer = setTimeout(() => {
    setCurrentUser(auth.currentUser);
    console.log(currentUser)
    if (currentUser && partnerId) {
      const chatRef = ref(database, 'Chat');
      onValue(chatRef, async (snapshot) => {
        const data = await snapshot.val();
        if (data) {
          setRawData(data)
        }
      });
    }
    // }, 1000);
  }, [currentUser, partnerId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentUser(auth.currentUser);
      console.log(currentUser)
    }, 1000)
  }, [])


  const filterMessages = useMemo(() => {
    if (rawData) {
      const myMessages = Object.entries(rawData)
        .filter(([id, msg]) =>
          (msg.sender === currentUser.uid && msg.receiver === partnerId) ||
          (msg.sender === partnerId && msg.receiver === currentUser.uid)
        )
        .sort((a, b) => new Date(a[1].date + ' ' + a[1].time) - new Date(b[1].date + ' ' + b[1].time));

      setMsgList(myMessages);
    }
  }, [rawData])


  useEffect(() => {
    const timer = setTimeout(() => {
      if (scroll.current) {
        scroll.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (!partnerId) setLoading(false)
    else {
      if (messages) setLoading(false)
      else setLoading(true)
    }
  }, [messages, partnerId])

  return (
    <>
      <main className="chat-box">
        <div className="messages-wrapper">
          {loading ?
            (
              <div className="loading-spinner">Loading chats...</div>
            ) : (
              messages ?
                (
                  <>
                    {
                      messages.map((message) => (
                        < Message msgData={message} key={message[0]} />
                      ))
                    }
                    < div ref={scroll} />
                  </>
                ) : (
                  <h1><center>Click a chat</center></h1>
                )

            )}
        </div>
        {partnerId ? (
          <TypeBox partnerId={partnerId} />
        ) : ("")}
      </main>
    </>
  );
};

export default ChatBox;