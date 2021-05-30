import { Button, Form, Modal } from 'react-bootstrap'
import React, { useRef, useState } from 'react'
import { db,timestamp } from '../firebase'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { useAuth } from "../context/AuthProvider"

function AddLeadServices(props) {
    const providerNameRef =useRef()
    const serviceareaRef =useRef()
    const numberRef =useRef()
    const timingsRef =useRef()
    const typeRef =useRef()
    const [is_verified,setIsVerified] = useState(false)
    const {currentUser} = useAuth()
    const [loading,setLoading] = useState(false)

    function handleClose()
    {
        props.onHide()
    }

    function AddService(event)
    {
        event.preventDefault()
        setLoading(true)
        db.collection("leads").add({
            locations: serviceareaRef.current.value,
            name_of_provider: providerNameRef.current.value,
            number: numberRef.current.value,
            timings: timingsRef.current.value,
            type: typeRef.current.value,
            author: {
                name:currentUser.displayName,
                id:currentUser.uid,
            },
            uploaded_on: timestamp,
            is_verified
        }).then(()=>{
            props.onHide()
            setLoading(false)
        }).catch(()=>{setLoading(false)})
    }
    return (
        <Modal centered show={props.show} onHide={handleClose}>
            <Modal.Header>
            <Modal.Title>Add New Volunteering Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            <Form className="theme-form" onSubmit={AddService}>
                <Form.Group controlId="providerName">
                    <Form.Label>Provider Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter service provider name" ref={providerNameRef} required/>
                </Form.Group>
                <Form.Group controlId="providerLocation">
                    <Form.Label>Service Areas</Form.Label>
                    <Form.Control type="text" placeholder="Enter service area" ref={serviceareaRef} required/>
                </Form.Group>
                <Form.Group controlId="phoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter service provider Number"  ref={numberRef} required/>
                </Form.Group>
                <Form.Group controlId="timings">
                    <Form.Label>Timings</Form.Label>
                    <Form.Control type="text" placeholder="Enter service provider Timings" ref={timingsRef} required/>
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Type</Form.Label>
                    <Form.Control as="select" custom ref={typeRef} required>
                        <option value="oxygen">Oxygen</option>
                        <option value="plasma">Plasma</option>
                        <option value="ambulance">Ambulance</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Verified</Form.Label>
                    <BootstrapSwitchButton
                    checked={true}
                    onlabel='Yes'
                    offlabel='No'
                    onChange={(checked) => {
                        setIsVerified(checked)
                    }}
                />
                </Form.Group>
            <div className="modal-btn ml-auto">
                <Button type="submit" variant="primary" className="my-4" disabled={loading}>
                        Add Service
                </Button>
                <Button variant="secondary" className="my-4 mx-2" onClick={handleClose}>
                        Close
                </Button>
            </div>
        </Form>
            </Modal.Body>
            
                
                
        </Modal>
    )
}

export default AddLeadServices
