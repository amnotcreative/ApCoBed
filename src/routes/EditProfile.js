import React,{ useRef, useState} from 'react'
import {Container, Row, Col, Form, Button} from 'react-bootstrap'
import './styles/EditProfile.css';
import {db, storageRef} from '../firebase';
import { useAuth } from '../context/AuthProvider';
import Jdenticon from 'react-jdenticon';
import AppSidebar from '../components/AppSidebar';

function EditProfile() {
    const {currentUser} = useAuth();
    const nameRef = useRef();
    const phoneNumberRef = useRef();
    const [isDoc,setDoc] = useState(false);
    const DoctorDocRef = useRef();
    const [loading,setLoading] = useState(false)
    function handleSubmit(e){
        e.preventDefault();
        setLoading(true)




        if(isDoc)
        {
            db.collection("users").doc(currentUser.uid).update({        
                displayName: nameRef.current.value,         
                isDoc: isDoc
            }).then(()=>{    
                storageRef.child(`${currentUser.uid}/${DoctorDocRef.current.files[0].name}`).put(DoctorDocRef.current.files[0]).then(()=>{        
                    storageRef.child(`${currentUser.uid}/${DoctorDocRef.current.files[0].name}`).getDownloadURL().then((url)=>{        
                        db.collection("users").doc(currentUser.uid).update({        
                            docCertificate: url        
                        })        
                    });
                })    
                setLoading(false)    
            }).catch((error)=>{console.log(error); setLoading(false)});  
        }else
        {
            db.collection("users").doc(currentUser.uid).update({        
                displayName: nameRef.current.value,               
            }).then(()=>{    
                setLoading(false)    
            }).catch((error)=>{console.log(error); setLoading(false)});  

        }
        
    }
    
    return (
        <Container fluid>
            <Row>
                <Col lg={1}>
                    <AppSidebar />
                </Col>
                <Col lg={11} className="p-0">
                            <Col lg={12} className="design-holder">
                                <div className="design-container"></div>
                            </Col>
                            <Container fluid className="mt-5 pt-4">
                            <Row>
                                <Col md={12} className="d-flex align-items-center justify-content-center mt-2">
                                    <div className="profile-icon img-circle mt-4">
                                        <Jdenticon size="100" value={currentUser.displayName}/>
                                    </div>
                                    
                                </Col>
                                <Col md={12} className="d-flex flex-column align-items-center justify-content-center">
                                    {currentUser.is_doc_verified && (
                                        <div className="tags">Doctor</div>
                                    )}
                                    <Form onSubmit={handleSubmit} className="theme-form">
                                        <Form.Group controlId="editName" className="m-2" aria-required>
                                            <Form.Label>Name:</Form.Label>
                                            <Form.Control type="text" defaultValue={currentUser.displayName} ref={nameRef}></Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId="number" className="m-2" aria-required>
                                            <Form.Label>Contact Number:</Form.Label>
                                            <Form.Control type="text" defaultValue={currentUser.phoneNumber} ref={phoneNumberRef} disabled></Form.Control>
                                        </Form.Group>

                                        {!currentUser.is_doc_verified && (
                                        <Form.Group controlId="isDoc" className="m-2">
                                            <Form.Label>Are you a doctor?</Form.Label>
                                            <Form.Check type="checkbox" label="Yes" onChange={(event)=>setDoc(event.target.checked)}></Form.Check>
                                            {isDoc && (
                                            <Form.File className="d-flex flex-column mt-2">
                                                <Form.File.Label> MCI Certificate:</Form.File.Label>
                                                <Form.File.Input id="Doctor-Document" className="mt-2" ref={DoctorDocRef}></Form.File.Input>
                                            </Form.File>)}
                                            </Form.Group>  
                                        )}                            
                                        <Button type="submit" variant='primary' className="m-2 w-100" disabled={loading}>Update</Button>
                                    </Form>
                                </Col>
                            </Row>
                            </Container>
                </Col>
            </Row>
        </Container>
    )
}

export default EditProfile;
