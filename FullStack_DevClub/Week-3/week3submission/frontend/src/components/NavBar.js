import React from "react";
import Cookies from "universal-cookie";
import { authAPI } from "../services/api";
import { auth, handleLogin, handleLogout } from "../utils/firebase"


const cookies = new Cookies();


export default function NavBar() {

    // authAPI.viewUser()
    //     .then(async (result) => {
    //         // console.log("hmm");
    //         // assign the message in our result to the message we initialized above
    //         // console.log(result);
    //         const user = result.data;
    //         const userUID = await handleLogin(user.email, user.password);
    //         console.log(userUID);
    //         // console.log(user);
    //         // cookies.remove("LOGIN-COOKIE", { path: "/" });
    //         // window.location.href = "/";
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         // error = new Error();
    //         logout();
    //     });

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
            <div className="nav-buttons">
                <button onClick={openSettings} className="settings" type="button">
                    Settings
                </button>
                <button onClick={logout} className="log-out" type="button">
                    Sign Out
                </button>
            </div>
        </nav>
    );
};
