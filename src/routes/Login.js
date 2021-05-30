import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useAuth } from '../context/AuthProvider'
import covidIllustration from '../img/covid.jpg'
import './styles/login.css'
import Sawo from "sawo"

function Login() {
    const { createUser,currentUser} = useAuth()
    const history = useHistory()


    useEffect(()=>{
        if(currentUser && currentUser.uid)
        {
            history.push("/dashboard")
        }
    },[currentUser])


    useEffect(() => {
        var config = {
            containerID: "sawo-container",
            identifierType: "phone_number_sms",
            apiKey: "a4597531-fb49-487a-a215-66e84a97d9ce",
            onSuccess: (payload) => {
                createUser(payload)
            },
          };
          let sawo = new Sawo(config);
          sawo.showForm();
       }, []);


    return (
        <Container fluid>
            <Row className="login-container">
                <Col xs={12} lg={6} className="login-page-illustration-container">
                    <img src={covidIllustration} className="img-fluid login-page-illustration" alt="Covid-Illustration" />
                </Col>
                <Col xs={12} lg={6} className="d-flex justify-content-center flex-column">
                    <div className="page-illustration">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#0079FF" d="M42.4,-49.7C58.6,-37,78,-27.1,84.5,-11.7C91,3.7,84.7,24.5,71.5,35.5C58.2,46.5,38,47.7,20.8,51.6C3.5,55.6,-10.8,62.2,-21.2,58.4C-31.7,54.6,-38.3,40.2,-43,27.2C-47.7,14.2,-50.4,2.4,-50.9,-11.5C-51.5,-25.4,-49.8,-41.4,-41,-55.4C-32.1,-69.5,-16.1,-81.5,-1.5,-79.8C13.1,-78,26.2,-62.4,42.4,-49.7Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                    <h1> ApCoBed</h1>
                    <div className="d-flex flex-column align-items-center">
                        <div
                        id="sawo-container"
                        style={{ height: "200px", width: "300px" }}
                        ></div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Login
