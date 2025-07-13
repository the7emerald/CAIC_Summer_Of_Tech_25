import React, { useEffect, useState } from "react";
import { database, auth, getName } from "../utils/firebase";
import { equalTo, orderByChild, query, ref, get, onValue, set } from 'firebase/database';
import { authAPI } from "../services/api"
import Cookies from "universal-cookie";
const cookies = new Cookies();


class CustomAlert {
    constructor(role) {
        this.render = function (dialog) {
            var winW = window.innerWidth;
            var winH = window.innerHeight;
            var dialogoverlay = document.getElementById('dialogoverlay');
            var dialogbox = document.getElementById(`dialogbox${role}`);
            dialogoverlay.style.display = "block";
            dialogoverlay.style.height = winH + "px";
            dialogbox.style.left = (winW / 2) - (550 * .5) + "px";
            dialogbox.style.top = "100px";
            dialogbox.style.display = "block";
            document.getElementById(`dialogboxhead${role}`).innerHTML = "Call Alert";
            document.getElementById(`dialogboxbody${role}`).innerHTML = dialog;
        };
        this.ok = function () {
            document.getElementById(`dialogbox${role}`).style.display = "none";
            document.getElementById('dialogoverlay').style.display = "none";
        };
    }
}

const changeCallStatus = async (newStatus, key) => {
    const callRef = ref(database, `CallRequests/${key}/status`);
    await set(callRef, newStatus)
}

const executeCall = async (callData, key) => {
    const myName = await getName()

    const jitsiData = { uid: auth.currentUser.uid, room: `${callData.callType}-${key}`, name: myName }
    console.log(jitsiData)
    await authAPI.getJitsiToken(jitsiData)
        .then((result) => {
            console.log(result.data.token);
            const jitsiCookie = { type: callData.callType, token: result.data.token, room: `${callData.callType}-${key}`, key: key }
            cookies.set("JITSI-COOKIE", jitsiCookie, {
                path: "/",
            });
        })
        .catch((error) => {
            console.log(error.response.data);
        });

    window.location.href = `/call/${callData.callType}`

}


const CallReceiver = () => {

    let currentUser = auth.currentUser;
    let key = null
    const AlertBox = new CustomAlert('R');
    let callData = null

    const gotCall = async (caller) => {
        AlertBox.render(`You have a call from ${caller}`)
    }

    const acceptCall = async () => {
        AlertBox.ok()
        changeCallStatus('ongoing', key)
        executeCall(callData, key)
    }

    const declineCall = async () => {
        AlertBox.ok()
        changeCallStatus('declined', key)
    }

    const checkForCall = async () => {
        const callReqRef = ref(database, `CallRequests`);
        const queryRef = query(callReqRef, orderByChild('receiver'), equalTo(currentUser.uid))
        get(queryRef)
            .then(async (snapshot) => {
                if (snapshot.exists()) {
                    let callerId = null
                    for (const [k, element] of Object.entries(snapshot.val())) {
                        if (element['status'] === 'pending') {
                            callerId = element['caller']
                            key = k
                            callData = element
                            break;
                        }
                    }
                    if (callerId) {
                        const userRef = ref(database, `ChatUsers/${callerId}/username`)
                        get(userRef)
                            .then(async (snap) => {
                                if (snap.exists()) {
                                    gotCall(snap.val())
                                }
                            })
                    }
                    else {
                        AlertBox.ok()
                    }
                }

            })
            .catch(error => {
                console.error(error)
                return
            })

    }

    useEffect(() => {
        setTimeout(function () {
            currentUser = auth.currentUser;
            if (currentUser) {
                const callReqRef = ref(database, `CallRequests`);
                onValue(callReqRef, async (snapshot) => {
                    const data = await snapshot.val();
                    if (data) {
                        checkForCall()
                    }
                })
            }
        }, 1000)
    }, [currentUser]);

    return (<>
        <div id="dialogoverlay"></div>
        <div id="dialogboxR">
            <div>
                <div id="dialogboxheadR"></div>
                <div id="dialogboxbodyR"></div>
                <div id="dialogboxfootR">
                    <button onClick={acceptCall}>Accept</button>
                    <button onClick={declineCall}>Decline</button>
                </div>
            </div>
        </div>
    </>
    );
};

const CallSender = () => {

    const [state, setState] = useState(null)
    let currentUser = auth.currentUser;
    // let key = null
    const [key, setKey] = useState()
    const AlertBox = new CustomAlert('S');
    const [callData,setCallData]=useState(null)

    const notifyMissedCall = async () => {

        const callRef = ref(database, `CallRequests/${key}`)
        let data = null
        console.log(key)
        await get(callRef)
            .then(async (snap) => {
                if (snap.exists()) {
                    data = snap.val()
                    console.log(data)
                }
            })

        console.log(data)
        const notifyRef = ref(database, `Notifications/call-${key}`);
        const myName = await getName()
        await set(notifyRef, { userId: data.receiver, type: "call", message: `Missed ${data.callType} call from ${myName}`, isRead: false, timestamp: Date.now(), relatedId: key })

    }

    useEffect(() => {
        const callRef = ref(database, `CallRequests/${key}/status`);
        if (key) {
            onValue(callRef, async (snapshot) => {
                const data = await snapshot.val();
                if (data) {
                    if (data === "declined") {
                        console.log("declined")
                        AlertBox.ok()
                        setState(data)
                        setTimeout(() => {
                            AlertBox.render(`Call Declined`)
                        }, 0)
                        setKey(null)
                    }
                    if (data === "ongoing") {
                        AlertBox.ok()
                        setState(data)
                        console.log(callData)
                        await executeCall(callData, key)
                        // window.location.href = `/call/${callData.callType}`
                    }
                }
            })
        }
    }, [key, currentUser])


    const sentCall = async (caller) => {
        setState("pending")
        AlertBox.render(`Calling ${caller}`)

    }


    const endCall = async () => {
        await notifyMissedCall()
        AlertBox.ok()
        changeCallStatus('ended', key)
    }


    const checkForCall = async () => {
        const callReqRef = ref(database, `CallRequests`);
        const queryRef = query(callReqRef, orderByChild('caller'), equalTo(currentUser.uid))
        get(queryRef)
            .then(async (snapshot) => {
                if (snapshot.exists()) {
                    console.log(Object.values(snapshot.val()))
                    let receiverId = null
                    for (const [k, element] of Object.entries(snapshot.val())) {
                        if (element['status'] === 'pending') {
                            // key = k
                            setCallData(element)
                            receiverId = element['receiver']
                            setKey(k)
                            break;
                        }
                    }
                    if (receiverId) {
                        const userRef = ref(database, `ChatUsers/${receiverId}/username`)
                        get(userRef)
                            .then(async (snap) => {
                                if (snap.exists()) {
                                    sentCall(snap.val())
                                }
                            })
                    }
                }

            })
            .catch(error => {
                console.error(error)
                return
            })

    }

    useEffect(() => {
        setTimeout(function () {
            currentUser = auth.currentUser;
            if (currentUser) {
                const callReqRef = ref(database, `CallRequests`);
                onValue(callReqRef, async (snapshot) => {
                    const data = await snapshot.val();
                    if (data) {
                        checkForCall()
                    }
                })
            }
        }, 1000)
    }, [currentUser]);

    return (
        <>
            <div id="dialogoverlay"></div>
            <div id="dialogboxS">
                <div>
                    <div id="dialogboxheadS"></div>
                    <div id="dialogboxbodyS"></div>
                    <div id="dialogboxfootS">
                        {
                            (state === "pending") ?
                                (
                                    <button onClick={endCall}>End Call</button>
                                ) : (
                                    <button onClick={AlertBox.ok}>Ok</button>
                                )
                        }

                    </div>
                </div>
            </div>

        </>
    );
};

export { CallReceiver, CallSender };