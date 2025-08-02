import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { auth, handleLogout } from "../utils/firebase"
import NewCall from "./NewCall";
import NotificationDropdown from "./NotificationPanel";
import LangDropdown from "./LangDropdown";
import "./navbar.css"
import NewChat from "./NewChat";


const cookies = new Cookies();


const NavBar = ({ partnerId }) => {
    const [isOpen, setIsOpen] = useState(false);

    const logout = async () => {
        await handleLogout();
        cookies.remove("LOGIN-COOKIE", { path: "/" });
        console.log("all done");
        window.location.href = "/";
    }

    const openSettings = () => {
        window.location.href = "/settings";
    }

    // return (
    // <nav className="nav-bar">
    //     <h1>CSoT Chat App</h1>
    //     <NotificationDropdown />
    //     <NewComponents partnerId={partnerId} />
    //     <LangDropdown />
    //     <button onClick={openSettings} className="nav-button" type="button">
    //         Settings
    //     </button>
    //     <button onClick={logout} className="nav-button" type="button">
    //         Sign Out
    //     </button>
    // </nav>
    // );
    return (
        <nav className="nav-bar">
            <h1>CSoT Chat App</h1>

            <NotificationDropdown />
            <NewCall partnerId={partnerId} />
            <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                <LangDropdown />
                <NewChat />
                <button onClick={openSettings} className="nav-button" type="button">
                    Settings
                </button>
                <button onClick={logout} className="nav-button" type="button">
                    Sign Out
                </button>
            </div>
            <div className="chats" onClick={() => window.location.href='/chat-list'}>
                🗪
            </div>
            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </nav>
    );
};

export default React.memo(NavBar);