import React, { useEffect, useRef, useState } from "react";

import { auth } from "../utils/firebase";
import { ref, onValue } from "firebase/database";

const Message = ({ msgData }) => {
    const [data, setData] = useState([]);

    useEffect(() => {

        console.log(msgData[1]);
        setData(data);
        // const userRef = ref(database, `Chat/${msgid}`);

        // onValue(userRef, (snapshot) => {
        //     const data = snapshot.val();
        //     if (data) {
        //         setContact(data);
        //         console.log(data);
        //     }
        // });
    }, [msgData])
    //   const [user] = useAuthState(auth);
    return (
        <>
            {msgData == [] ? (<></>) :
                (
                    <div className={`chat-bubble-${msgData[1].sender === auth.currentUser.uid ? "right" : "left"}`}>
                       {msgData[1].message} - {msgData[1].status}
                    </div>
                )

            }
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
        </>
    );
};

export default Message;