import { Button, Form, Toast } from 'react-bootstrap'
import React, { useState, useRef } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { db} from '../firebase'
import "./styles/hospital-sidebar.css"
import './styles/EditProfile.css';
import { useAuth } from '../context/AuthProvider'
import Jdenticon from 'react-jdenticon'
import PoliceSidebar from '../components/PoliceSidebar'
import { useHistory } from 'react-router'

function DashboardSettings() {

    const {currentUser, logout} = useAuth()
    const [successState, setSuccessState] = useState(false)
    const NameRef = useRef()
    const phoneNumberRef = useRef()
    const history = useHistory()

    async function handleLogout() {    
        try {
          await logout()
          history.push("/police-login")
        } catch {
          console.log("Failed to log out")
        }
      }

    function handleUpdate(e){
        e.preventDefault()
        db.collection("users").doc(currentUser.uid).update({        
            displayName: NameRef.current.value,         
            phoneNumber: phoneNumberRef.current.value  
        }).then((response)=>{
            console.log(response)
            setSuccessState(true)
        }).catch((error)=>console.log(error));  
    }

    return (
        <Container fluid className = "hospital-dashboard">
           <Row noGutters>
                <PoliceSidebar/>

                <Col lg = {11} className = "hospital-main-dashboard d-flex align-items-center">
                   <Container fluid className="p-0">
                        <Row>
                            <Col md="12" className="d-flex align-items-center justify-content-center mt-2">
                                <div className="profile-icon img-circle mt-4">
                                    <Jdenticon size="100" value={currentUser.displayName}/>
                                </div>
                            </Col>
                            
                            <Col md="12" className="d-flex flex-column align-items-center justify-content-center">
                                <Form onSubmit={handleUpdate} className="theme-form profile-form">

                                    <Form.Group controlId="PoliceNameUpdate" className="m-2">
                                        <Form.Label>Name:</Form.Label>
                                        <Form.Control type="text" defaultValue={currentUser.displayName} ref={NameRef} aria-required/>
                                    </Form.Group>

                                    <Form.Group controlId="PoliceNumberUpdate" className="m-2">
                                        <Form.Label>Contact Number:</Form.Label>
                                        <Form.Control type="number" defaultValue={currentUser.phoneNumber} ref={phoneNumberRef} aria-required/>
                                    </Form.Group>

                                    <Form.Group controlId="Email" className="m-2">
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control type="email" defaultValue={currentUser.email} disabled/>
                                    </Form.Group>

                                    <div className="my-5">
                                    <Button type="submit" variant='dark' className="mx-4">Update</Button>
                                    <Button onClick={handleLogout} variant='dark' className="mx-4">Log Out</Button>
                                    </div>
                                </Form>
                            </Col>
                            {successState && <Toast className="w-50" onClose={() => setSuccessState(false)} show={successState} delay={3000} autohide>
                                                    <Toast.Header>
                                                        <strong className="mr-auto">Success</strong>
                                                    </Toast.Header>
                                                </Toast>}
                        </Row>
                   </Container>
                </Col>
            </Row>
        </Container>
    )
}

export default DashboardSettings
