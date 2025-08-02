import React, { useState, useRef, useEffect, useMemo } from 'react';
import NotificationItem from './NotificationItem';
import { database, auth } from "../utils/firebase";
import { ref, onValue, set } from "firebase/database";

const NotificationDropdown = () => {


    const [isOpen, setIsOpen] = useState(false);
    const [rawData, setRawData] = useState(null);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const [notifications, setNotifications] = useState(null);

    let currentUser = auth.currentUser;

    useEffect(() => {
        setTimeout(() => {
            currentUser = auth.currentUser;

            if (currentUser) {
                const notifyRef = ref(database, 'Notifications');
                onValue(notifyRef, async (snapshot) => {
                    const data = await snapshot.val();
                    if (data) {
                        setRawData(data)
                    }
                });
            }
        }, 1000);
    }, [currentUser]);

    const filterNotifications = useMemo(() => {
        if (rawData) {
            const myNotifications = Object.entries(rawData)
                .filter(([id, msg]) =>
                    (msg.userId === currentUser.uid) && (!msg.isRead)
                )
                .sort((a, b) => b[1].timestamp - a[1].timestamp);

            setNotifications(myNotifications);
            console.log(myNotifications)
        }
    }, [rawData])


    const readAll = async () => {
        await notifications.map(async (notification) => {
            const notifyRef = ref(database, `Notifications/${notification[1].type}-${notification[1].relatedId}/isRead`)
            await set(notifyRef, true)
        })

    }

    return (
        <div className="notification-dropdown" ref={dropdownRef}>
            <button className="notification-bell" onClick={toggleDropdown}>
                🔔
                {notifications?.length > 0 && (
                    <span className="notification-count">{notifications.length}</span>
                )}
            </button>

            {isOpen && (
                <div className="dropdown-content">
                    {notifications.length === 0 ? (
                        <p className="no-notifications">No new notifications</p>
                    ) : (
                        <>
                            <button className='dropdown-all' onClick={readAll}>Read All</button>
                            {notifications.map((notification) => (<NotificationItem data={notification[1]} />))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;