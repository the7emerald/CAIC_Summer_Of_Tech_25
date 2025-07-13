
import React, { useEffect, useState } from "react";
import { ref, set } from 'firebase/database';
import { database } from "../utils/firebase";
import { JaaSMeeting } from "@jitsi/react-sdk"
import Cookies from "universal-cookie";
const cookies = new Cookies()


function Call({ callType }) {

    const [api, setApi] = useState(null)

    const handleApiReady = (jitsiApi) => {
        setApi(jitsiApi)
    }

    const changeCallStatus = async (newStatus) => {
        const callRef = ref(database, `CallRequests/${key}/status`);
        await set(callRef, newStatus)
    }


    useEffect(() => {
        if (api) {
            api.addListener('readyToClose', async () => {
                await changeCallStatus('success')
                cookies.remove("JITSI-COOKIE", { path: "/" });
                window.location.href = '/chat'
            })
        }
    })

    const data = cookies.get("JITSI-COOKIE");

    if (!data) {
        return (<div>Nobody wants to talk to u!</div>)
    }
    const room = data.room;
    const jwtToken = data.token;
    const type = data.type
    const key = data.key



    return (
        <div style={{ height: "100vh", display: "grid", flexDirection: "column" }}>
            {
                (callType === 'video' && type === 'video') ?
                    (
                        <JaaSMeeting
                            appId={"vpaas-magic-cookie-b24439535c154e6db6e54aadc36b02c3"}
                            roomName={room}
                            jwt={jwtToken}
                            configOverwrite={{
                                disableLocalVideoFlip: true,
                                backgroundAlpha: 0.5,
                                prejoinPageEnabled: false,
                                startWithVideoMuted: true
                            }}
                            interfaceConfigOverwrite={{
                                VIDEO_LAYOUT_FIT: 'nocrop',
                                TOOLBAR_BUTTONS: [
                                    'microphone', 'camera', 'desktop', 'hangup'
                                ],
                            }}
                            onApiReady={handleApiReady}
                        />
                    ) : (
                        (callType === 'voice' && type === 'voice') ?
                            (
                                <JaaSMeeting
                                    appId={"vpaas-magic-cookie-b24439535c154e6db6e54aadc36b02c3"}
                                    roomName={room}
                                    jwt={jwtToken}
                                    configOverwrite={{
                                        disableLocalVideoFlip: true,
                                        backgroundAlpha: 0.5,
                                        prejoinPageEnabled: false,
                                        startWithVideoMuted: true
                                    }}
                                    interfaceConfigOverwrite={{
                                        VIDEO_LAYOUT_FIT: 'nocrop',
                                        TOOLBAR_BUTTONS: [
                                            'microphone', 'hangup'
                                        ],
                                    }}
                                    onApiReady={handleApiReady}
                                />
                            ) : (
                                <></>
                            )
                    )
            }
        </div>
    );
}

export default Call;



