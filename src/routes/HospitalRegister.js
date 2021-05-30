import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import {Form, Spinner, Container, Row, Col, Button} from 'react-bootstrap';
import { useHistory } from 'react-router'
import { useAuth } from '../context/AuthProvider'
import covidIllustration from '../img/covid.jpg'
import './styles/login.css'


function HospitalRegister() {
    const registerHospitalNameRef = useRef()
    const registerEmailRef = useRef()
    const registerPasswordRef = useRef()
    const { registerHospital } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setregistererror] = useState("")
    const history = useHistory()

    async function handleRegister(e) {
        e.preventDefault()
        if(registerPasswordRef.current.value.length < 5)
        {
            setregistererror("Password must of 5 characters")
            return;
        }
            setregistererror("")
            setLoading(true)
            await registerHospital(registerEmailRef.current.value, registerPasswordRef.current.value, registerHospitalNameRef.current.value).then((data)=>{
                history.push("/hospital-profile")
                setLoading(false)
              }).catch((data)=>{
                setregistererror(`Failed to create an account. ${data.message}`)
                setLoading(false)
              })
            setLoading(false)
    }

    return (
        <Container fluid>
            <Row className="login-container">
                <Col xs={12} lg={6} className="login-page-illustration-container">
                    <img src={covidIllustration} alt="Covid Illustration" className="img-fluid login-page-illustration"  />
                </Col>
                <Col xs={12} lg={6} className="d-flex justify-content-center flex-column">
                    <div className="page-illustration">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#0079FF" d="M42.4,-49.7C58.6,-37,78,-27.1,84.5,-11.7C91,3.7,84.7,24.5,71.5,35.5C58.2,46.5,38,47.7,20.8,51.6C3.5,55.6,-10.8,62.2,-21.2,58.4C-31.7,54.6,-38.3,40.2,-43,27.2C-47.7,14.2,-50.4,2.4,-50.9,-11.5C-51.5,-25.4,-49.8,-41.4,-41,-55.4C-32.1,-69.5,-16.1,-81.5,-1.5,-79.8C13.1,-78,26.2,-62.4,42.4,-49.7Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                    <h1> ApCoBed</h1>
                    
                    <Form className="login-form" onSubmit={handleRegister}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" ref={registerHospitalNameRef} required />
                        </Form.Group>
                        <Form.Group controlId="registerEmail">
                            <Form.Label>Hospital Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" ref={registerEmailRef} required />
                        </Form.Group>
                        <Form.Group controlId="registerPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" ref={registerPasswordRef} required/>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="theme-circle-button button-right">
                            {loading ? (
                                <Spinner animation="border" />
                            ):(<FontAwesomeIcon icon={faArrowRight} />)}
                        </Button>
                        {error && <div className="error">{error}</div>}
                    </Form>
                </Col>
            </Row>
        </Container>
        
    )
}

export default HospitalRegister
