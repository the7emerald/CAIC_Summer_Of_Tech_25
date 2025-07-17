import React from "react";
import Cookies from "universal-cookie";
import { auth, handleLogout } from "../utils/firebase"
import DropdownList from "./NewComponents";
import NotificationDropdown from "./NotificationPanel";
import LangDropdown from "./LangDropdown";


const cookies = new Cookies();


export default function NavBar({ partnerId }) {


    const logout = async () => {
        await handleLogout();
        cookies.remove("LOGIN-COOKIE", { path: "/" });
        console.log("all done");
        window.location.href = "/";
    }

    const openSettings = () => {
        window.location.href = "/settings";
    }

    return (
        <nav className="nav-bar">
            <h1>CSoT Chat App</h1>
            <NotificationDropdown />
            <DropdownList partnerId={partnerId} />
            <LangDropdown/>
            <button onClick={openSettings} className="nav-button" type="button">
                Settings
            </button>
            <button onClick={logout} className="nav-button" type="button">
                Sign Out
            </button>
        </nav>
    );
};
