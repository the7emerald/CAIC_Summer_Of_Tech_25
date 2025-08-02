import React, { useState, useRef, useEffect } from 'react';
import { auth, database } from '../utils/firebase';
import { equalTo, orderByChild, query, ref, set, get } from 'firebase/database';

function NewChat({ partnerId }) {


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

    return (
        <div >
            <button className='nav-button' onClick={newChat}>New Chat</button>
        </div>
    );
}
export default React.memo(NewChat);