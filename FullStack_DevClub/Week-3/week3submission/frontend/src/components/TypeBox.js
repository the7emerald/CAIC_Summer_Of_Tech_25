import React, { useState } from "react";

const TypeBox = () => {
    const [message, setMessage] = useState("");
    const sendMessage = () => { }
    //   const sendMessage = async (event) => {
    //     event.preventDefault();
    //     if (message.trim() === "") {
    //       alert("Enter valid message");
    //       return;
    //     }
    //     const { uid, displayName, photoURL } = auth.currentUser;
    //     await addDoc(collection(db, "messages"), {
    //       text: message,
    //       name: displayName,
    //       avatar: photoURL,
    //       createdAt: serverTimestamp(),
    //       uid,
    //     });
    //     setMessage("");
    //     scroll.current.scrollIntoView({ behavior: "smooth" });
    //   };
    return (
        <form onSubmit={(event) => sendMessage(event)} className="typeBox">
            
            <input
                type="text"
                placeholder="message likh..."
                className="typeBox-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="typeBox-button">Send</button>
        </form>
    );
};

export default TypeBox;