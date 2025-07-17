import "./Chat.css";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ChatBox from "../components/ChatBox";
import ContactList from "../components/ContactList";
import { CallReceiver, CallSender } from "../components/CallManager";


function App() {
  const [partnerId, setPartnerId] = useState(null);
  
  return (
    <div className="AppHolder">
      <NavBar partnerId={partnerId} />
      <ContactList updatePartner={setPartnerId} partnerId={partnerId} />
      <ChatBox partnerId={partnerId} />
      <CallReceiver />
      <CallSender />
    </div>
  );
}

export default App;