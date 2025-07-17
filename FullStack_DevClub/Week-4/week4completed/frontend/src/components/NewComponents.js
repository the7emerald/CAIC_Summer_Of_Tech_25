import React, { useState, useRef, useEffect } from 'react';
import { auth, database } from '../utils/firebase';
import { equalTo, orderByChild, query, ref, set, get } from 'firebase/database';

function DropdownButton({ partnerId }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const newChat = async () => {
        const newUser = prompt('Please enter username to start chat with')
        const usersRef = ref(database, `ChatUsers`)
        const queryRef = query(usersRef, orderByChild('username'), equalTo(newUser))
        get(queryRef)
            .then(async (snapshot) => {
                if (snapshot.exists()) {
                    const newId = Object.keys(snapshot.val())[0]

                    const user = auth.currentUser
                    const listRef1 = ref(database, `ChatList/${user.uid}/${newId}`);
                    const listRef2 = ref(database, `ChatList/${newId}/${user.uid}`);
                    await set(listRef1, newId)
                    await set(listRef2, user.uid)
                }
                else {
                    console.log("no data")
                    alert("Invalid Username")
                    return
                }
            })
            .catch(error => {
                console.error(error)
                return
            })
    }

    const newCall = async (type) => {
        setIsOpen(false)
        if (partnerId) {

            const user = auth.currentUser
            const callRef = ref(database, `CallRequests/${user.uid}-${partnerId}-${Date.now()}`);
            await set(callRef, { caller: user.uid, receiver: partnerId, callType: type, status: 'pending', timestamp: Date.now() })
            // window.location.href = `/call/${type}`;
        }
        else {
            console.log("no data")
            alert("Invalid Username")
            return
        }
    }


    return (
        <div ref={dropdownRef} >
            {(partnerId) ? (
                <button onClick={toggleDropdown} className='nav-button'>Call</button>) : (<div />)}
            {isOpen && (
                <div style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', padding: '0px' }}>
                    <button className='dropButton' onClick={() => newCall('voice')} >Voice</button>
                    <button className='dropButton' onClick={() => newCall('video')}>Video</button>
                </div>
            )}
            <button className='nav-button' onClick={newChat}>New Chat</button>
        </div>
    );
}
export default DropdownButton;