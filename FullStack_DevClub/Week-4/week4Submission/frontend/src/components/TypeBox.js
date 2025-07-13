import React, { useState } from "react";
import { getDatabase, set, ref, remove, onValue } from "firebase/database";
import { database, auth, getName } from "../utils/firebase";

const TypeBox = ({ partnerId }) => {
    const [message, setMessage] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault()
        const user = auth.currentUser
        if (partnerId && user && message.trim() != '') {
            const msgId = `${user.uid}-${partnerId}-${Date.now()}`
            const msgRef = ref(database, `Chat/${msgId}`);
            const currDate = new Date()

            const notifyRef = ref(database, `Notifications/message-${msgId}`);
            const myName = await getName()
            if (myName) {
                await set(notifyRef, {
                    timestamp: Date.now(),
                    message: `New message from ${myName}`,
                    relatedId: msgId,
                    type: "message",
                    userId: partnerId,
                    isRead: false
                })
            }

            await set(msgRef, {
                date: currDate.toLocaleDateString(),
                message: message,
                receiver: partnerId,
                sender: user.uid,
                status: "not seen",
                time: currDate.toLocaleTimeString()
            })

            setMessage("")
        }
    }


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