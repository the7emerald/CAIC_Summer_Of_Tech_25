import React, { useEffect, useRef, useState } from "react";
import { database, auth } from "../utils/firebase";
import { getDatabase, set, ref, remove, onValue } from "firebase/database";
import Contact from "./Contact";


const ContactList = ({ updatePartner, partnerId }) => {

  const [contactList, setChatContacts] = useState(null);
  const [loading, setLoading] = useState(true);

  let currentUser = auth.currentUser;

  useEffect(() => {
    setTimeout(async () => {
      currentUser = auth.currentUser;
      console.log(currentUser);
      if (currentUser) {
        const chatListRef = ref(database, `ChatList/${currentUser.uid}`);
        onValue(chatListRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const contacts = Object.keys(data);
            setChatContacts(contacts);
            console.log(contactList);
            if (contactList) setLoading(false)
          }
        });
      }
    }, 1000);
  }, [currentUser]);

  useEffect(()=>{
if(contactList)setLoading(false)
  },[contactList])


  return (
    <main className="chat-list">
      <div className="contacts-wrapper">
        {loading ?
          (
            <div className="loading-spinner">Loading chats...</div>
          ) : (
            contactList?.map((contact) => (
              <Contact
                userid={contact}
                updatePartner={updatePartner}
                partnerId={partnerId}
                key={contact}
              />
            ))
          )
        }

      </div>
    </main>
  );
};

export default ContactList;