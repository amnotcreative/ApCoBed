import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthProvider';
import { db } from '../firebase';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';
import "./styles/PatientRecords.css"
import HospitalSidebar from '../components/HospitalSidebar'

function PatientRecords() {
 
    const {currentUser, logout} = useAuth()
    const [patientDetails, setPatientDetails] = useState()
    const [filteredPatientDetails, setFilteredPatientDetails] = useState()
    const history = useHistory()
    
    useEffect(() => {
        var unsubscribe =  db.collection("hospitalsList").doc(currentUser.uid).onSnapshot((docs)=>{
              if (docs.exists)
              {
                  var patientArray = [];
                  Object.keys(docs.data().patientRecords).forEach(key => patientArray.push({
                      name_of_patient: docs.data().patientRecords[key].name_of_patient,
                      aadhar : docs.data().patientRecords[key].aadhar,
                      age : docs.data().patientRecords[key].age,
                      contact : docs.data().patientRecords[key].contact,
                      rtpcr : docs.data().patientRecords[key].rtpcr,
                      covid : docs.data().patientRecords[key].covid,
                      spo2 : docs.data().patientRecords[key].spo2,
                      patient_uid: key
                  })
                 
                  )
                  setPatientDetails(patientArray)
                  setFilteredPatientDetails(patientArray)
              }
          })
          return unsubscribe
      }, [])

      function search(keyword)
    {
        if (keyword === "")
            setFilteredPatientDetails(patientDetails)

        else 
        {
            var newArray=patientDetails.filter(PatientDet => 
            PatientDet.name_of_patient.toLowerCase().includes(keyword.toLowerCase()) 
            || PatientDet.aadhar.toLowerCase().includes(keyword.toLowerCase())
            || PatientDet.spo2 === keyword
            || PatientDet.age === keyword
            || ((PatientDet.contact+'').indexOf(keyword) > -1) 
            )
            setFilteredPatientDetails(newArray)
        }

    }

      async function handleLogout() {    
        try {
          await logout()
          history.push("/hospital-login")
        } catch {
          console.log("Failed to log out")
        }
      }

    return (
        <Container fluid>
            <Row noGutters>
                <HospitalSidebar />

                <Col lg={11} >
                    <Container fluid className = "my-4">
                        <Row>
                            <Col>
                                <Form className ="theme-form">
                                    < Form.Group>
                                            <Form.Control type = "text" placeholder = "Search for anything but contact" onChange={event => {search(event.target.value)}}/>
                                    </ Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Container>

                    <Container fluid>
                        <Row>
                            {filteredPatientDetails && filteredPatientDetails.length>0 && filteredPatientDetails.map((Record, key) =>{return (
                            <Col lg = {3} className="patientDetails my-3" key={key}>
                                <div className= "patient-card-theme-container">
                                <h6>Name:<span>{Record.name_of_patient}</span></h6>
                                <h6>Aadhar:<span>{Record.aadhar}</span></h6>
                                <h6>Covid  :<span>{Record.covid ? "positive": "negative"}</span></h6>
                                <h6>RTPCR  :<span>{Record.rtpcr ? "positive": "negative"}</span></h6>
                                <h6>SpO2   :<span>{Record.spo2}</span></h6>
                                <h6>Age    :<span>{Record.age}</span></h6>
                                <h6>Contact:<span>{Record.contact}</span></h6>
                                </div>
                            </Col>)})}
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}


export default PatientRecords
