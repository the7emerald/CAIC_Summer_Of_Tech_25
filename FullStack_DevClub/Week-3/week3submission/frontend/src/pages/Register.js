import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import axios from 'axios'
import { Outlet, Link, redirect } from "react-router-dom";
import { authAPI } from '../services/api';
import { handleRegister } from '../utils/firebase';


export default function Register() {


    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        authAPI.register({ username, password, email })
            .then(async (result) => {
                try {
                    setRegister(true);
                    console.log(result);
                    handleRegister(result.data.username, result.data.email, result.data.password).then(result => {
                        console.log("regisetred");
                        window.location.href = "/login";
                    });
                }
                catch (error) {
                    console.log(error);
                }
            })
            .catch((error) => {
                console.log(error.response.data.errors);
                setErrors(error.response.data.errors);
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
                    {errors.username ? (
                        <p className="text-danger">{errors.username.message}</p>
                    ) : (
                        <p className="text-danger"></p>
                    )}

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
                    {errors.email ? (
                        <p className="text-danger">{errors.email.message}</p>
                    ) : (
                        <p className="text-danger"></p>
                    )}

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
                    {errors.password ? (
                        <p className="text-danger">{errors.password.message}</p>
                    ) : (
                        <p className="text-danger"></p>
                    )}

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

                    {register ? (
                        <p className="text-success">You Are Registered Successfully</p>
                    ) : (
                        <p className="text-danger">{register}</p>
                    )}


                </Form>
            </Container>
        </>
    )
}