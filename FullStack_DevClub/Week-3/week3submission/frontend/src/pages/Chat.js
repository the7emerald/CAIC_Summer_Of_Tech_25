import "./Chat.css";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ChatBox from "../components/ChatBox";
import { getChatList, getCurrentUser } from "../utils/firebase";
import { getDatabase, set, ref, remove, onValue } from "firebase/database";
import { database, auth } from "../utils/firebase";
import ContactList from "../components/ContactList";




function App() {
  const [partnerId, setPartnerId] = useState(null);
  
  return (
    <div className="AppHolder">
      <NavBar />
      <ContactList updatePartner={setPartnerId} />
      <ChatBox partnerId={partnerId} />

    </div>
  );
}

export default App;