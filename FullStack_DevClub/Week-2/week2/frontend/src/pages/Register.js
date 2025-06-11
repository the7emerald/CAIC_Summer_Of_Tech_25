import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import axios from 'axios'
import { Outlet, Link, redirect } from "react-router-dom";


export default function Register() {


    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState("");

    const configuration = {
        method: "post",
        url: "/api/auth/register",
        data: {
            username,
            email,
            password,
        },
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios(configuration)
            .then((result) => {
                window.location.href = "/login";
                setRegister(1);
                console.log(result);
            })
            .catch((error) => {
                console.log(error.response.data);
                setRegister(error.response.data);
            });
    }

    return (
        <>
            <Container>
                <center>  <h2>Register</h2></center>
                <Form onSubmit={(e) => handleSubmit(e)}>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Username (min 3 characters)"
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
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
                                Register
                            </Button>
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

                    {/* {register == 1 ? (
                        <p className="text-success">You Are Registered Successfully</p>
                    ) : register == 0 ? (
                        <p className="text-danger"></p>
                    ) : register == 2 ? (
                        <p className="text-danger">Already Done</p>
                    ) : (
                        <p className="text-danger">Error</p>
                    )} */}

                    {register == 1 ? (
                        <p className="text-success">You Are Registered Successfully</p>
                    ) : (
                        <p className="text-danger">{register}</p>
                    )}


                </Form>
            </Container>
        </>
    )
}