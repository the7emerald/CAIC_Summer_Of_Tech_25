import React, { useEffect, useRef, useState } from "react";

import { auth, database } from "../utils/firebase";
import { ref, onValue, set } from "firebase/database";

const Message = ({ msgData }) => {
    const [data, setData] = useState([]);
    const [showTranslate, setShowTranslate] = useState(false);
    const [transText, setText] = useState(null)


    if (msgData[1].sender != auth.currentUser.uid) {
        const msgRef = ref(database, `Chat/${msgData[0]}/status`)
        set(msgRef, 'seen')
        const notifyRef = ref(database, `Notifications/message-${msgData[0]}/isRead`)
        set(notifyRef, true)

    }

    function normalizeWidths() {
        const box1 = document.getElementById(`box1-${msgData[0]}`);
        console.log(box1)
        box1.style.width = 'max-content';

    }

    function syncWidths() {
        const box1 = document.getElementById(`box1-${msgData[0]}`);
        const box2 = document.getElementById(`box2-${msgData[0]}`);
        console.log(box1)
        console.log(box2)
        const width1 = box1.clientWidth;
        const width2 = box2.clientWidth;
        const maxWidth = Math.max(width1, width2) + 2 + 'px';
        box1.style.width = maxWidth;
        box2.style.width = maxWidth;
    }

    useEffect(() => {
        setData(data);
    }, [msgData])

    const translate = async () => {
        if (!transText) {
            await getTranslation()
        }
        setTimeout(() => {
            console.log(!showTranslate)
            if (!showTranslate) syncWidths()
                else normalizeWidths()
        }, 0)
        setShowTranslate(!showTranslate)
    }

    const getTranslation = async () => {
        // will get the translated text here
        // google cloud requires billing and stuff 🫤
        await setText("translated text comes here")
    }

    return (
        <>
            {msgData == [] ? (<></>) :
                (
                    <>
                        <div className={`chat-bubble-wrapper`}>
                            {msgData[1].sender === auth.currentUser.uid ?
                                (
                                    <>
                                        <button onClick={translate} className={`translate-button right`}>🔃</button>
                                        <div id={`box1-${msgData[0]}`} className={`chat-bubble text right ${msgData[1].status === "seen" ? "seen" : ""}`}>
                                            {msgData[1].message}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div id={`box1-${msgData[0]}`} className={`chat-bubble text left`}>
                                            {msgData[1].message}
                                        </div>
                                        <button onClick={translate} className={`translate-button`}>🔃</button>
                                    </>
                                )
                            }
                        </div>
                        {showTranslate ?
                            (
                                <div id={`box2-${msgData[0]}`} className={`chat-bubble translate${msgData[1].sender === auth.currentUser.uid ? " right" : ""}`}>
                                    {transText}
                                </div>
                            ) : (
                                <></>
                            )
                        }
                    </>
                )

            }

        </>
    );
};

export default Message;