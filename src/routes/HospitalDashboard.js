import { faCheck, faTimes} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { db, firebasevalue} from '../firebase'
import "./styles/hospital-sidebar.css"
import { useAuth } from '../context/AuthProvider'
import { useHistory } from 'react-router'
import HospitalSidebar from '../components/HospitalSidebar'
import audio from '../img/audio.mp3'
function HospitalDashboard() {

    const {currentUser } = useAuth()
    const [hospitalDetails, setHospitalDetails] = useState({newReq:[]})
    const history = useHistory()

    function handleAccepted(request)
    {
        db.collection("hospitalsList").doc(currentUser.uid).update({acceptedRequestCount:firebasevalue.increment(1),newRequestCount:firebasevalue.increment(-1),
        occupiedBed:firebasevalue.increment(1), 
       availableBed:firebasevalue.increment(-1), 
       ["patientRecords."+request.aadhar]:request,
       ["newRequest."+request.aadhar]:firebasevalue.delete()
    })
    }

    function handleRejected(request)
    {
        db.collection("hospitalsList").doc(currentUser.uid).update({
        RejectedRequestCount:firebasevalue.increment(1),
        newRequestCount:firebasevalue.increment(-1),
        ["newRequest."+request.aadhar]:firebasevalue.delete(),
        ["rejectedPatientList."+request.aadhar]:request,
        ["newRequest."+request.aadhar]:firebasevalue.delete()
        })
    }

    function handleEmergency(request)
    {
        console.log(request)
        db.collection("hospitalsList").doc(currentUser.uid).update({
            acceptedRequestCount:firebasevalue.increment(1),
            newRequestCount:firebasevalue.increment(-1),
            ["patientRecords."+request.aadhar]:request,
            ["newRequest."+request.aadhar]:firebasevalue.delete(), 
            occupiedBed:firebasevalue.increment(1), 
            availableBed:firebasevalue.increment(-1) 
         }).then(()=> {
             db.collection("policeList").doc("policeList").update({
                newRequestCount:firebasevalue.increment(1),
                ["newRequest."+request.aadhar]:{
                    startingAddress:request.address,
                    endAddress:hospitalDetails.hospitalAddress,
                    ...request
                },
             })
         })
    }

    useEffect(() => {
      var unsubscribe =  db.collection("hospitalsList").doc(currentUser.uid).onSnapshot((docs)=>{
            if (docs.exists)
            {
                var newReq = [];
                Object.keys(docs.data().newRequest).forEach(key => newReq.push({
                    name_of_patient: docs.data().newRequest[key].name_of_patient,
                    aadhar : docs.data().newRequest[key].aadhar,
                    age : docs.data().newRequest[key].age,
                    contact : docs.data().newRequest[key].contact,
                    rtpcr : docs.data().newRequest[key].rtpcr,
                    covid : docs.data().newRequest[key].covid,
                    spo2 : docs.data().newRequest[key].spo2,
                    patient_uid : docs.data().newRequest[key].pid,
                    address: docs.data().newRequest[key].address
                }))


                if(hospitalDetails && hospitalDetails.newReq)
                {
                    if(newReq.length > hospitalDetails.newReq.length)
                    {
                        (new Audio(audio)).play();
                    }
                }
                setHospitalDetails({
                   newReq: newReq, ...docs.data()
                })
            }else
            {
                history.push("/hospital-profile")
            }
        })
        return unsubscribe
    }, [])
    return (
             <Container fluid className = "hospital-dashboard">
                <Row noGutters>
                    <HospitalSidebar />
                    <Col lg = {3 } className="alert-container">
                    <h3>Requests</h3>
                        {hospitalDetails && hospitalDetails.newReq && hospitalDetails.newReq.map((request,key) => {
                            return(<div className = "alert" controlId={key} key={key}>
                                <div className="alert-details">
                                    <p>Name: {request.name_of_patient}</p>
                                    <p>Aadhar:{request.aadhar}</p>
                                    <p>Covid  :{request.covid ? "positive": "negative"}</p>
                                    <p>RTPCR  :{request.rtpcr ? "positive": "negative"}</p>
                                    <p>SpO2:{request.spo2}</p>
                                    <p>Age    :{request.age}</p>
                                    <p>Contact:{request.contact}</p>
                                </div>
                                <div>
                                <Button variant="success" className="hospital-theme-btn my-2 mx-2" onClick = {() => handleAccepted(request)}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                                
                                <Button variant="dark" className="bg-theme my-2 mx-2" onClick = {() => handleRejected(request)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </Button> 
        
                                <Button variant="danger" className="my-2 mx-2" onClick = {() => handleEmergency(request)}>
                                Emergency Admission
                                </Button> 

                                </div>
                         </div>)
                        })}
                    
                    </Col>
                   
                    <Col lg = {7} className = "hospital-main-dashboard">
                        <Container fluid className="p-0">
                           
                            <Row className="my-3">
                                <Col lg = {6} xs={6}>
                                    <div className = "hospital-card-theme">
                                        <div className = "hospital-card-theme-container">
                                    <h6>Available Beds</h6>
                                    <h2>{hospitalDetails && hospitalDetails.availableBed}</h2>
                                    </div>
                                    </div>
                                </Col>
                                
                                <Col lg = {6} xs={6}> 
                                <div className = "hospital-card-theme">
                                <div className = "hospital-card-theme-container">
                                 <h6>Occupied Beds</h6>
                                 <h2>{hospitalDetails && hospitalDetails.occupiedBed}</h2>
                                 </div>
                                 </div>
                                </Col>
                            </Row>

                            <Row className="my-4">
                            <Col lg = {4} xs={4}> 
                                <div className = "hospital-card-theme">
                                <div className = "hospital-card-theme-container">
                                 <h6>Accepted</h6>
                                 <h2>{hospitalDetails && hospitalDetails.acceptedRequestCount}</h2>
                                 </div>
                                 </div>
                             </Col>

                             <Col lg = {4} xs={4}> 
                                <div className = "hospital-card-theme">
                                <div className = "hospital-card-theme-container">
                                 <h6>Rejected</h6>
                                 <h2>{hospitalDetails && hospitalDetails.RejectedRequestCount}</h2>
                                 </div>
                                 </div>
                             </Col>

                             <Col lg = {4} xs={4}> 
                                <div className = "hospital-card-theme">
                                <div className = "hospital-card-theme-container">
                                 <h6>Pending</h6>
                                 <h2>{hospitalDetails && hospitalDetails.newRequestCount}</h2>
                                 </div>
                                 </div>
                             </Col>
                            
                            </Row>
                        </Container>
                    </Col> 
                </Row>
             </Container>
        
    )
}

export default HospitalDashboard
