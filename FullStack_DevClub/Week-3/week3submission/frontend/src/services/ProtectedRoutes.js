import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export function ProtectedRoutes({ component: Component, ...rest }) {
    const token = cookies.get("LOGIN-COOKIE");
    return (
        (token) ?
            (<Outlet />) :
            (<Navigate to='/login' />)
    )
}


export function UnProtectedRoutes({ component: Component, ...rest }) {
    const token = cookies.get("LOGIN-COOKIE");
    return (
        (!token) ?
            (<Outlet />) :
            (<Navigate to='/chat' />)
    )
}
