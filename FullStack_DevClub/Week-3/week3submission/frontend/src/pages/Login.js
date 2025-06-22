import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import axios from 'axios'
import { Outlet, Link } from "react-router-dom";
import { authAPI } from "../services/api"
import { handleLogin } from '../utils/firebase';
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Login() {


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(0);
    const [errors, setErrors] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        await authAPI.login({ username, password })
            .then((result) => {
                setLogin(1);
                console.log(result);
                cookies.set("LOGIN-COOKIE", result.data.accessToken, {
                    path: "/",
                    // httpOnly: true
                });
            })
            .catch((error) => {
                console.log(error.response.data);
                setErrors(error.response.data);
                setLogin(-1);
            });
        console.log("hi");
        authAPI.viewUser()
            .then(async (result) => {
                // console.log("hmm");
                // assign the message in our result to the message we initialized above
                // console.log(result);
                const user = result.data;
                const userUID = await handleLogin(user.email, user.password);
                if (userUID) {
                    console.log(userUID);
                    window.location.href = "/chat";
                }
                else {
                    cookies.remove("LOGIN-COOKIE", { path: "/" });
                    console.log("all done");
                    window.location.href = "/";
                }

                // console.log(user);
                // cookies.remove("LOGIN-COOKIE", { path: "/" });
                // window.location.href = "/";
            })
            .catch((error) => {
                console.log(error);
                // error = new Error();
                cookies.remove("LOGIN-COOKIE", { path: "/" });
                console.log("all done");
                window.location.href = "/";
            });
    }

    return (
        <>
            <Container>
                <h2>Login</h2>
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Username"
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </Form.Group>

                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Button
                                variant="primary"
                                type="submit"
                                onClick={(e) => handleSubmit(e)}
                            >
                                Login
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Link to="/register">
                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    New User
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Link to="/">
                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    Back
                                </Button>
                            </Link>
                        </Col>
                    </Row>


                    {login == 1 ? (
                        <p className="text-success">You Are logged in Successfully</p>
                    ) : login == -1 ? (
                        <p className="text-danger">{errors}</p>
                    ) : (
                        <p className="text-danger"></p>
                    )}
                </Form>
            </Container>
        </>
    )
}