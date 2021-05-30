import { faCheck, faTimes} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { db, firebasevalue} from '../firebase'
import "./styles/hospital-sidebar.css"
import { useAuth } from '../context/AuthProvider'
import { useHistory } from 'react-router'
import PoliceSidebar from '../components/PoliceSidebar'
import audio from '../img/audio.mp3'

function PoliceDashboard() {

    const {currentUser, logout} = useAuth()
    const [policeDetails, setPoliceDetails] = useState({newReq:[]})
    const history = useHistory()

    function handleAccepted(request)
    {
        db.collection("policeList").doc("policeList").update({
            acceptedRequestCount:firebasevalue.increment(1),newRequestCount:firebasevalue.increment(-1),
            ["acceptedRequests."+request.aadhar]:request,
            ["newRequest."+request.aadhar]:firebasevalue.delete(),
            ["activeRecords."+request.aadhar]:request
        }).then(()=>{
            db.collection("users").doc(request.patient_uid).update({
                policeSupport: true
            })
        })
    }

    function handleRejected(request)
    {
        db.collection("policeList").doc("policeList").update({
            RejectedRequestCount:firebasevalue.increment(1),
            newRequestCount:firebasevalue.increment(-1),
            ["newRequest."+request.aadhar]:firebasevalue.delete()
        })
    }

    useEffect(() => {
        var unsubscribe =  db.collection("policeList").doc("policeList").onSnapshot((docs)=>{
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
                      startingAddress: docs.data().newRequest[key].startingAddress,
                      endAddress: docs.data().newRequest[key].endAddress,
                      patient_uid: docs.data().newRequest[key].patient_uid
                  }))

                  if(policeDetails && policeDetails.newReq)
                    {
                        if(newReq.length > policeDetails.newReq.length)
                        {
                            (new Audio(audio)).play();
                        }
                    }

                  setPoliceDetails({
                     newReq: newReq, ...docs.data()
                  })
              }
          })
          return unsubscribe
      }, [])

      return (
        <Container fluid className = "hospital-dashboard">
           <Row noGutters> 
           <PoliceSidebar/>  
               <Col lg = {3 } className="alert-container">
               <h3>Requests</h3>
                   {policeDetails && policeDetails.newReq && policeDetails.newReq.map((request,key) => {
                       return(
                        <div className = "alert" key={key}>
                           <div className="alert-details">
                               <p>Name: {request.name_of_patient}</p>
                               <p>Aadhar: {request.aadhar}</p>
                               <p>Contact: {request.contact}</p>
                               <p>Starting Address: {request.startingAddress}</p>
                               <p>End Address: {request.endAddress}</p>
                               <p>Green Corridor Possible?</p>
                           </div>
                            <div>
                                <Button variant="success" className="hospital-theme-btn my-2 mx-2" onClick = {() => handleAccepted(request)}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                                
                                <Button variant="dark" className="bg-theme my-2 mx-2"onClick = {() => handleRejected(request)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </Button> 
                            </div>
                        </div>)
                    })}
               
               </Col>
              
               <Col lg = {7} className = "hospital-main-dashboard">
                   <Container fluid className="p-0">

                        <Row className="my-4">
                            <Col lg = {4} xs={4}> 
                                <div className = "hospital-card-theme">
                                    <div className = "hospital-card-theme-container">
                                        <h6>Accepted</h6>
                                        <h2>{policeDetails && policeDetails.acceptedRequestCount}</h2>
                                    </div>
                                </div>
                            </Col>

                            <Col lg = {4} xs={4}> 
                                <div className = "hospital-card-theme">
                                    <div className = "hospital-card-theme-container">
                                        <h6>Rejected</h6>
                                        <h2>{policeDetails && policeDetails.RejectedRequestCount}</h2>
                                    </div>
                                </div>
                            </Col>

                            <Col lg = {4} xs={4}> 
                                <div className = "hospital-card-theme">
                                    <div className = "hospital-card-theme-container">
                                        <h6>Requests</h6>
                                        <h2>{policeDetails && policeDetails.newRequestCount}</h2>
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

export default PoliceDashboard;