import React, { useRef, useState } from "react";
import { getDatabase, set, ref, remove, onValue } from "firebase/database";
import { database, auth, getName } from "../utils/firebase";
import FileUploader from "./fileUploader";

const TypeBox = ({ partnerId }) => {
    const [message, setMessage] = useState("");
    // const [urls, setUrls] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const buttonRef = useRef(null)

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
                messageType: 'text',
                time: currDate.toLocaleTimeString()
            })

            setMessage("")
        }
    }

    const uploadedFiles = async (url) => {
        setShowUpload(false)
        // setUrls(url)
        const urls = url
        console.log(url)
        const user = auth.currentUser
        if (partnerId && user) {
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
                message: `Sent a ${urls.type}`,
                receiver: partnerId,
                sender: user.uid,
                status: "not seen",
                time: currDate.toLocaleTimeString(),
                messageType: urls.type,
                mediaUrl: urls.mediaUrl,
                thumbnailUrl: urls.thumbnailUrl
            })

        }
    }

    const toggleUpload = () => {
        setShowUpload(!showUpload)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            buttonRef.current.click(); 
        }
    };

    return (
        <>
            <div className="typeBox-wrapper">
                <div className="typeBox">
                    <button onClick={toggleUpload} className={`upload-button`}>{(!showUpload) ? "📁" : "💬"}</button>
                    {showUpload ? (
                        <FileUploader uploadedFiles={uploadedFiles} />
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="message likh..."
                                className="typeBox-input"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button ref={buttonRef} onClick={(event) => sendMessage(event)} type="submit" className="typeBox-button">Send</button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default React.memo(TypeBox);