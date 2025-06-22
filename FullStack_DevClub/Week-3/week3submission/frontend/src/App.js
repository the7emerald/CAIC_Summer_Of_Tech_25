import { Container, Col, Row } from "react-bootstrap";
import "./App.css"

import { Routes, Route, BrowserRouter } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./pages/Main";
import UserSettings from "./pages/UserSettings";
import Update from "./pages/UpdateUser";
import Chat from "./pages/Chat";

import { ProtectedRoutes, UnProtectedRoutes } from "./services/ProtectedRoutes";


function App() {

  return (
    // <BrowserRouter>
    <Routes>

      <Route element={<UnProtectedRoutes />}>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        {/* <Route path="/home" element={<UserHome />} /> */}
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/update" element={<Update />} />
        <Route path="/chat" element={<Chat />} />
      </Route>

    </Routes>
  );
}

export default App;