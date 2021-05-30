import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useAuth } from '../context/AuthProvider'
import { db } from '../firebase'
import '../App.css'
import HospitalSidebar from '../components/HospitalSidebar'
import Jdenticon from 'react-jdenticon'

function HospitalSettings() {

    const {currentUser, logout} = useAuth()
    const history = useHistory()
    const HospitalNameRef = useRef()
    const TotalBedsRef = useRef()
    const AvailableBedsRef = useRef()
    const OccupiedBedsRef = useRef()
    const [loading,setLoading] = useState(false)
    const [hospitalDetails,setHospitalDetails] = useState()

    async function handleLogout() {    
        try {
          await logout()
          history.push("/hospital-login")
        } catch {
          console.log("Failed to log out")
        }
      }

    function handleUpdate(event)
    {
        event.preventDefault()
        setLoading(true)
        db.collection("hospitalsList").doc(currentUser.uid).update({
            displayName: parseInt(HospitalNameRef.current.value),
            availableBed: parseInt(AvailableBedsRef.current.value),
            totalBeds : parseInt(TotalBedsRef.current.value),
            occupiedBed : parseInt(OccupiedBedsRef.current.value)
        })

        db.collection("users").doc(currentUser.uid).update({
            displayName:HospitalNameRef.current.value,
        }).then(()=>{setLoading(false)}).catch(()=>{setLoading(false)})
    }

    useEffect(() => {
        var unsubscribe = db.collection("hospitalsList").doc(currentUser.uid).onSnapshot((doc)=>{
            if(doc.exists)
            {
                setHospitalDetails(doc.data())
            }
        })

        return unsubscribe;

    }, [])

    return (
        <Container fluid>
            <Row noGutters>
                <HospitalSidebar />
                <Col lg={2} />
                <Col lg={7} className="hospital-main-dashboard">
                    <Container fluid className="p-0">
                        <Row className="d-flex align-items-center">
                            <Col md="12" className="d-flex align-items-center justify-content-center mt-2">
                                <div className="profile-icon img-circle mt-4">
                                    <Jdenticon size="100" value={currentUser.displayName}/>
                                </div>
                            </Col>
                            <Col md="12" className="d-flex flex-column align-items-center justify-content-center mt-5">
                                <Form  onSubmit= {handleUpdate} className="theme-form">
                                    <Form.Group controlId="hospital-name">
                                        <Form.Label>Name:</Form.Label>
                                        <Form.Control type="text" placeholder="Enter a new name" defaultValue = {currentUser.displayName} ref={HospitalNameRef} aria-required/>
                                    </Form.Group>

                                    <Form.Group controlId="total-beds">
                                        <Form.Label>Total Beds:</Form.Label>
                                        <Form.Control type="number" placeholder="Enter the total number of beds"  defaultValue={hospitalDetails && hospitalDetails.totalBeds}  ref={TotalBedsRef} aria-required/>
                                    </Form.Group>

                                    <Form.Group controlId="available-beds">
                                        <Form.Label>Available Beds:</Form.Label>
                                        <Form.Control type="number" placeholder="Enter the available number of beds" defaultValue={hospitalDetails && hospitalDetails.availableBed}  ref={AvailableBedsRef} aria-required/>
                                    </Form.Group>

                                    
                                    <Form.Group controlId="occupied-beds">
                                        <Form.Label>Occupied Beds:</Form.Label>
                                        <Form.Control type="number" placeholder="Enter the occupied number of beds" defaultValue={hospitalDetails && hospitalDetails.occupiedBed} ref={OccupiedBedsRef} aria-required/>
                                    </Form.Group>

                                    <div className="modal-btn ml-auto">
                                        <Button type="submit" variant="primary" className="my-4" disabled={loading}>
                                                Save Changes
                                        </Button>

                                        <Button variant="secondary" className="bg-danger my-4 mx-2" onClick={handleLogout}>
                                                Logout
                                        </Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </Col>
                
       
        </Row>
    </Container>
    )
}

export default HospitalSettings
