
import { Container, Col, Row } from "react-bootstrap";
import Register from "./Register";
import Login from "./Login";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import React, { useState, useEffect } from 'react'
import { Outlet, Link } from "react-router-dom";

function Main() {

    return (
        <>
            <Container>
                <Form >
                    <Row>
                        <center>
                            <h2>
                                Welcome
                            </h2>
                        </center>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <center>
                                <Link to="register"><Button
                                    variant="primary"
                                    type="submit"
                                >
                                    Register
                                </Button></Link>
                            </center>
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={6}>
                            <center>
                                <Link to="login"><Button
                                    variant="primary"
                                    type="submit"
                                >
                                    Login
                                </Button></Link>
                            </center>

                        </Col>
                    </Row>
                </Form>
            </Container>

        </>
    );
}

export default Main;