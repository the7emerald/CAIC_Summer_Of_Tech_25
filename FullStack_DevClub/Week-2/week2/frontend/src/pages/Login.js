import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import axios from 'axios'
import { Outlet, Link } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Login() {


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(0);

    const configuration = {
        method: "post",
        url: "/api/auth/login",
        data: {
            username,
            password,
        },
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios(configuration)
            .then((result) => {
                setLogin(1);
                console.log(result);
                cookies.set("LOGIN-COOKIE", result.data.token, {
                    path: "/",
                });
                window.location.href = "/home";
            })
            .catch((error) => {
                console.log(error);
                setLogin(-1);
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
                    ) : login == 0 ? (
                        <p className="text-danger"></p>
                    ) : login == 2 ? (
                        <p className="text-danger">Already Done</p>
                    ) : (
                        <p className="text-danger">Error</p>
                    )}
                </Form>
            </Container>
        </>
    )
}