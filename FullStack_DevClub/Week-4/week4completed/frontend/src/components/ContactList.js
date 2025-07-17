import React, { useEffect, useRef, useState } from "react";
import { database, auth } from "../utils/firebase";
import { getDatabase, set, ref, remove, onValue } from "firebase/database";
import Contact from "./Contact";


const ContactList = ({ updatePartner, partnerId }) => {

  const [contactList, setChatContacts] = useState();

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
          }
        });
      }
    }, 1000);
  }, [currentUser]);

  return (
    <main className="chat-list">
      <div className="contacts-wrapper">
        {contactList?.map((contact) => (
          <Contact
            userid={contact}
            updatePartner={updatePartner}
            partnerId={partnerId}
            key={contact}
          />
        ))}
      </div>
    </main>
  );
};

export default ContactList;