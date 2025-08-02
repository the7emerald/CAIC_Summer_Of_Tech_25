import React, { useState, useRef, useEffect } from 'react';
import { auth, database } from '../utils/firebase';
import { equalTo, orderByChild, query, ref, set, get } from 'firebase/database';

function NewCall({ partnerId }) {
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
                <button onClick={toggleDropdown} className='call-button'>Call</button>) : (<div />)}
            {isOpen && (
                <div style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', padding: '0px', zIndex: '10' }}>
                    <button className='dropButton' onClick={() => newCall('voice')} >Voice</button>
                    <button className='dropButton' onClick={() => newCall('video')}>Video</button>
                </div>
            )}
        </div>
    );
}
export default React.memo(NewCall);