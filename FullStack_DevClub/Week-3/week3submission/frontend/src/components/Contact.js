import React, { useEffect, useRef, useState } from "react";

import { database } from "../utils/firebase";
import { ref, onValue } from "firebase/database";

const Contact = ({ userid ,updatePartner}) => {
  const [contact, setContact] = useState();

  useEffect(() => {
    console.log(userid);
    const userRef = ref(database, `ChatUsers/${userid}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setContact(data);
        console.log(data);
      }
    });
  }, [])

  const func = () => {
    updatePartner(userid)
    console.log(userid)
  }

  return (
    <>
      {/* <div
      className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <p className="user-message">{message.text}</p>
      </div>
    </div> */}
      {contact ?
        (
          <button className="contact" onClick={func}>{contact.username} - {contact.status}</button>
        ) :
        (<></>)
      }
    </>
  );
};

export default Contact;