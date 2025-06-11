import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import axios from 'axios'
import { Outlet, Link, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();
// get token generated on login
const token = cookies.get("LOGIN-COOKIE");


export default function Update() {


    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(0);

    const configuration = {
        method: "put",
        url: "/api/auth/profile",
        data: {
            username,
            email,
            password,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios(configuration)
            .then((result) => {
                setRegister(1);
                cookies.set("LOGIN-COOKIE", result.data.token, {
                    path: "/",
                });
                window.location.href = "/home";
            })
            .catch((error) => {
                console.log(error);
                setRegister(-1);
            });
    }

    return (
        <>
            <Container>
                <center>  <h2>Fill in the details you want to change</h2></center>
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
                                Update
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Link to="/home">
                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    Back
                                </Button>
                            </Link>
                        </Col>
                    </Row>

                    {register == 1 ? (
                        <p className="text-success">Updated Successfully</p>
                    ) : register == 0 ? (
                        <p className="text-danger"></p>
                    ) : register == 2 ? (
                        <p className="text-danger">Already Done</p>
                    ) : (
                        <p className="text-danger">Error</p>
                    )}

                </Form>
            </Container>
        </>
    )
}