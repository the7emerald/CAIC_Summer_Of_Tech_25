import React, { useEffect, useRef, useState } from "react";
import { database, auth } from "../utils/firebase";
import { getDatabase, set, ref, remove, onValue } from "firebase/database";
import Contact from "./Contact";

// import Message from "./Message";

const ContactList = ({updatePartner}) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const q = query(
//       collection(db, "messages"),
//       orderBy("createdAt", "desc"),
//       limit(50)
//     );

//     const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
//       const fetchedMessages = [];
//       QuerySnapshot.forEach((doc) => {
//         fetchedMessages.push({ ...doc.data(), id: doc.id });
//       });
//       const sortedMessages = fetchedMessages.sort(
//         (a, b) => a.createdAt - b.createdAt
//       );
//       setMessages(sortedMessages);
//     });
//     return () => unsubscribe;
//   }, []);

  const [contactList, setChatContacts] = useState();
  
  let currentUser = auth.currentUser;
  useEffect(() => {
    const timer = setTimeout(async () => {

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
    }, 500);
  }, [currentUser]);

  return (
    <main className="chat-list">
      <div className="contacts-wrapper">
        {contactList?.map((contact) => (
          <Contact 
          userid={contact}
          updatePartner={updatePartner} />
        ))}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      {/* <span ref={scroll}></span> */}
    </main>
  );
};

export default ContactList;