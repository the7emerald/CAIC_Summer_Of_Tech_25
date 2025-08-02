import "./Chat.css";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ChatBox from "../components/ChatBox";
import ContactList from "../components/ContactList";
import { CallReceiver, CallSender } from "../components/CallManager";
import { useLocation } from 'react-router-dom';


function App() {
  const location = useLocation();
  const { pId } = location.state || {};
  const [partnerId, setPartnerId] = useState(pId);

  return (
    <div className="AppHolder">
      <NavBar partnerId={partnerId} />
      <ContactList updatePartner={setPartnerId} partnerId={partnerId} />
      <ChatBox partnerId={partnerId} />
      <CallReceiver />
      <CallSender partnerId={partnerId} />
    </div>
  );
}

export default App;