import React, { useEffect, useRef, useState } from "react";
import { auth, database, getPrefLang } from "../utils/firebase";
import { ref, onValue, set } from "firebase/database";
import axios from 'axios';


const Message = ({ msgData }) => {
    const [data, setData] = useState([]);
    const [showTranslate, setShowTranslate] = useState(false);
    const [transText, setText] = useState(null)
    const [viewerOpen, setViewerOpen] = useState(false);
    const [targetLang, setTargetLang] = useState('en');
    let currentUser = auth.currentUser

    if (msgData[1].sender != auth.currentUser.uid) {
        const msgRef = ref(database, `Chat/${msgData[0]}/status`)
        set(msgRef, 'seen')
        if (msgData[1].messageType != "call") {
            const notifyRef = ref(database, `Notifications/message-${msgData[0]}/isRead`)
            set(notifyRef, true)
        }
    }

    function normalizeWidths() {
        const box1 = document.getElementById(`box1-${msgData[0]}`);
        console.log(box1)
        box1.style.width = 'max-content';

    }

    function syncWidths() {
        const box1 = document.getElementById(`box1-${msgData[0]}`);
        const box2 = document.getElementById(`box2-${msgData[0]}`);
        box1.style.width = 'max-content';
        box2.style.width = 'max-content';
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

    useEffect(() => {
        currentUser = auth.currentUser
        const userRef = ref(database, `ChatUsers/${currentUser.uid}/preferredLanguage`);

        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setTargetLang(data);
                console.log(data);
            }
        });
    }, [currentUser])

    useEffect(() => {
        if (showTranslate) {
            handleLangChange()
        }
        else if (transText) {
            getTranslation()
        }
    }, [targetLang])

    const handleLangChange = async () => {
        await getTranslation();
        setTimeout(() => {
            syncWidths()
        }, 0)
    }

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
        const subscriptionKey = process.env.REACT_APP_TRANSLATOR_KEY;
        const region = process.env.REACT_APP_TRANSLATOR_REGION;
        const endpoint = 'https://api.cognitive.microsofttranslator.com';

        try {
            const response = await axios.post(
                `${endpoint}/translate?api-version=3.0&to=${targetLang}`,
                [{ Text: msgData[1].message }],
                {
                    headers: {
                        'Ocp-Apim-Subscription-Key': subscriptionKey,
                        'Ocp-Apim-Subscription-Region': region,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const translation = response.data[0]?.translations[0]?.text;
            setText(translation);
        } catch (error) {
            console.error('Translation error:', error);
            alert('Failed to translate text');
        }
    }

    const downloadMedia = async () => {
        try {
            const response = await fetch(msgData[1].mediaUrl);
            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;

            const extension = msgData[1].mediaUrl.split('.').pop().split('?')[0];
            a.download = `CSoTChatAppMediaAt${Date.now()}.${extension}`;

            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (eror) {
            console.error(eror);
            alert('Download failed');
        }
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
                                        {msgData[1].messageType === "video" || msgData[1].messageType === "image" ?
                                            (
                                                <>
                                                    <button onClick={downloadMedia} className={`translate-button right`}>⬇️</button>
                                                    <div id={`box1-${msgData[0]}`} className={`chat-bubble text right ${msgData[1].status === "seen" ? "seen" : ""}`}>
                                                        <img style={{ cursor: 'pointer' }} onClick={() => { setViewerOpen(true) }} src={msgData[1].thumbnailUrl} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {msgData[1].messageType === "call" ?
                                                        (
                                                            <>
                                                                <div id={`box1-${msgData[0]}`} className={`chat-bubble call right ${msgData[1].status === "seen" ? "seen" : ""}`}>
                                                                    {msgData[1].message}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={translate} className={`translate-button right`}>🔃</button>
                                                                <div id={`box1-${msgData[0]}`} className={`chat-bubble text right ${msgData[1].status === "seen" ? "seen" : ""}`}>
                                                                    {msgData[1].message}
                                                                </div>
                                                            </>
                                                        )}
                                                </>
                                            )
                                        }
                                    </>
                                ) : (
                                    <>
                                        {msgData[1].messageType === "video" || msgData[1].messageType === "image" ?
                                            (
                                                <>
                                                    <div id={`box1-${msgData[0]}`} className={`chat-bubble text left`}>
                                                        <img style={{ cursor: 'pointer' }} onClick={() => { setViewerOpen(true) }} src={msgData[1].thumbnailUrl} />
                                                    </div>
                                                    <button onClick={downloadMedia} className={`translate-button`}>⬇️</button>
                                                </>
                                            ) : (
                                                <>
                                                    {msgData[1].messageType === "call" ?
                                                        (
                                                            <>
                                                                <div id={`box1-${msgData[0]}`} className={`chat-bubble call left`}>
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
                                                        )}
                                                </>
                                            )
                                        }
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

                        {viewerOpen && (
                            <div
                                className="mediaViewer"
                                onClick={() => setViewerOpen(false)}>
                                <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setViewerOpen(false)}
                                        className="mediaViewer-button"
                                    >X</button>

                                    {msgData[1].mediaUrl.includes('.mp4') ? (
                                        <video src={msgData[1].mediaUrl} controls style={{ maxHeight: '80vh', maxWidth: '90vw' }} />
                                    ) : (
                                        <img src={msgData[1].mediaUrl} alt="full" style={{ maxHeight: '80vh', maxWidth: '90vw' }} />
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )

            }

        </>
    );
};

export default React.memo(Message);