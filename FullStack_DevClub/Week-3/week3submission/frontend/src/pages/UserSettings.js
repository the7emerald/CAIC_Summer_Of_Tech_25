
import React, { useEffect, useState } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import axios from 'axios'
import { Button, Container } from "react-bootstrap";
import { authAPI } from "../services/api";
import Cookies from "universal-cookie";
import { handleDelete, handleLogout } from "../utils/firebase";
const cookies = new Cookies();

const token = cookies.get("LOGIN-COOKIE");

export default function UserSettings() {
    const [view, setView] = useState("");


    const logout = async () => {
        await handleLogout();
        cookies.remove("LOGIN-COOKIE", { path: "/" });
        console.log("all done");
        window.location.href = "/";
    }

    const deleteUser = async () => {
        let result = window.confirm("sure?");
        // destroy the cookie
        if (!result) {
            return;
        }
        // cookies.remove("LOGIN-COOKIE", { path: "/" });
        // redirect user to the landing page
        // window.location.href = "/";
        // const configuration = {
        //     method: "delete",
        //     url: "/api/auth/profile",
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // };

        authAPI.deleteUser()
            .then(async (result) => {
                // console.log("hmm");
                // assign the message in our result to the message we initialized above
                handleDelete().then((result) => {
                    console.log(result);
                    cookies.remove("LOGIN-COOKIE", { path: "/" });
                    window.location.href = "/";
                })
                    .catch((error) => {
                        console.log(error);
                    })
            })
            .catch((error) => {
                console.log(error);
                handleLogout();
                cookies.remove("LOGIN-COOKIE", { path: "/" });
                window.location.href = "/";

                // error = new Error();
            });
    }

    const viewUser = () => {
        // let result = window.confirm("sure?");
        // destroy the cookie
        // if (!result) {
        // return;
        // }
        // cookies.remove("LOGIN-COOKIE", { path: "/" });
        // redirect user to the landing page
        // window.location.href = "/";
        // const configuration = {
        //     method: "get",
        //     url: "/api/auth/profile",
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // };

        authAPI.viewUser()
            .then((result) => {
                // console.log("hmm");
                // assign the message in our result to the message we initialized above
                // console.log(result);
                setView(result.data)
                console.log(result.data);
                // cookies.remove("LOGIN-COOKIE", { path: "/" });
                // window.location.href = "/";
            })
            .catch((error) => {
                console.log(error);
                // error = new Error();
            });
    }

    const hideUser = () => {
        setView("");
    }


    return (
        <>
            <div>
                <Container>
                    <h1 className="text-center">User Home Page</h1>
                    <Button type="submit" variant="primary" onClick={() => window.location.href = "/chat"}>
                        Chat
                    </Button>
                    <Button type="submit" variant="primary" onClick={() => window.location.href = "/update"}>
                        Update Details
                    </Button>
                    {(!view) ?
                        (<Button type="submit" variant="primary" onClick={() => viewUser()}>
                            View Details
                        </Button>) :
                        (<Button type="submit" variant="primary" onClick={() => hideUser()}>
                            Hide Details
                        </Button>)
                    }
                    <Button type="submit" variant="danger" onClick={() => logout()}>
                        Logout
                    </Button>
                    <Button type="submit" variant="danger" onClick={() => deleteUser()}>
                        Delete
                    </Button>
                    {(view) ?
                        (<h3 className="text-center ">Username: {view.username}<br />Email ID: {view.email}</h3>) : (<h3></h3>)}
                </Container>
            </div >

        </>
    );
}