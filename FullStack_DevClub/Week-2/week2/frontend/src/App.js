import { Container, Col, Row } from "react-bootstrap";
import "./App.css"

import { Routes, Route, BrowserRouter } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./pages/Main";
import UserHome from "./pages/UserHome";
import Update from "./pages/UpdateUser";
import Chat from "./pages/Chat";

import ProtectedRoutes from "./utils/ProtectedRoutes";


function App() {

  return (
    // <BrowserRouter>
    <Routes>

      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="home" element={<UserHome />} />
        <Route path="update" element={<Update />} />
        <Route path="chat" element={<Chat />} />
      </Route>

    </Routes>
  );
}

export default App;