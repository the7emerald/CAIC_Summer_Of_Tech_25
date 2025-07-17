import React from 'react';
import { ref, set } from "firebase/database";
import { database } from "../utils/firebase";


const NotificationItem = ({ data }) => {

    const dismiss = async () => {
        const notifyRef = ref(database, `Notifications/${data.type}-${data.relatedId}/isRead`)
        await set(notifyRef, true)
    }

    return (
        <div className={`notification ${data.type}`}>
            {data.message}
            <button onClick={dismiss} className="notificationDismiss" >X</button>
        </div>
    );
};

export default NotificationItem;