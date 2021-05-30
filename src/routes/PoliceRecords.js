import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthProvider';
import { db } from '../firebase';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';
import "./styles/PatientRecords.css"
import PoliceSidebar from '../components/PoliceSidebar';

function PoliceRecords() {

    const [patientDetails, setPatientDetails] = useState()
    const [filteredPatientDetails, setFilteredPatientDetails] = useState()
    
    useEffect(() => {
        var unsubscribe =  db.collection("policeList").doc("policeList").onSnapshot((docs)=>{
            if (docs.exists)
            {
                var patientArray = [];
                console.log(docs.data().acceptedRequests)
                Object.keys(docs.data().acceptedRequests).forEach(key => patientArray.push({
                    name_of_patient: docs.data().acceptedRequests[key].name_of_patient,
                    aadhar : docs.data().acceptedRequests[key].aadhar,
                    age : docs.data().acceptedRequests[key].age,
                    contact : docs.data().acceptedRequests[key].contact,
                    rtpcr : docs.data().acceptedRequests[key].rtpcr,
                    covid : docs.data().acceptedRequests[key].covid,
                    spo2 : docs.data().acceptedRequests[key].spo2,
                    source: docs.data().acceptedRequests[key].startingAddress,
                    destination: docs.data().acceptedRequests[key].endAddress,
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
            || PatientDet.source === keyword
            || PatientDet.end === keyword
            || ((PatientDet.contact+'').indexOf(keyword) > -1) 
            )
            setFilteredPatientDetails(newArray)
        }

    }

    return (
        <Container fluid>
            <Row noGutters>
                <PoliceSidebar />

                <Col lg={9} >
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
                            <Col lg = {5} className="patientDetails" key={key}>
                                <div className= "patient-card-theme-container">
                                <h6>Name:<span>{Record.name_of_patient}</span></h6>
                                <h6>Aadhar:<span>{Record.aadhar}</span></h6>
                                <h6>Covid  :<span>{Record.covid ? "positive": "negative"}</span></h6>
                                <h6>RTPCR  :<span>{Record.rtpcr ? "positive": "negative"}</span></h6>
                                <h6>SpO2   :<span>{Record.spo2}</span></h6>
                                <h6>Age    :<span>{Record.age}</span></h6>
                                <h6>Contact:<span>{Record.contact}</span></h6>
                                <h6>Patient's Address:<span>{Record.source}</span></h6>
                                <h6>Hospital's Address:<span>{Record.destination}</span></h6>
                                </div>
                            </Col>)})}
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}


export default PoliceRecords
