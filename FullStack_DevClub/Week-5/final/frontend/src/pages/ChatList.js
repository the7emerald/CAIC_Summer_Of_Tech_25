import "./Chat.css";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ContactListMobile from "../components/ContactListMobile";
import { CallReceiver, CallSender } from "../components/CallManager";
import { useNavigate } from 'react-router-dom';


function ChatList() {
    const navigate = useNavigate();
    const [partnerId, setPartnerId] = useState(null);

    const openChat = (id) => {
        console.log(id)
        setPartnerId(id)
        navigate('/chat', { state: { pId: id } });
    }

    return (
        <div className="AppHolder">
            <NavBar partnerId={partnerId} />
            <ContactListMobile updatePartner={openChat} partnerId={partnerId} />
            <CallReceiver />
        </div>
    );
}

export default ChatList;