import { Button, Form, Image, Modal } from 'react-bootstrap'
import React, { useRef, useState } from 'react'
import { db,storageRef,timestamp } from '../firebase'
import { useAuth } from "../context/AuthProvider"
import dummyImage from '../img/dummyimg.jpg'
function AddVolunteeringServices(props) {
    const providerNameRef =useRef()
    const serviceareaRef =useRef()
    const numberRef =useRef()
    const timingsRef =useRef()
    const bannerRef =useRef()
    const serviceProvidedRef =useRef()
    const [banner , setBanner] = useState(dummyImage)
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
        db.collection("volunteeringServices").add({
            locations: serviceareaRef.current.value,
            name_of_provider: providerNameRef.current.value,
            number: numberRef.current.value,
            timings: timingsRef.current.value,
            type: serviceProvidedRef.current.value,
            author: {
                name:currentUser.displayName,
                id:currentUser.uid,
            },
            uploaded_on: timestamp,
        }).then((payload)=>{
            console.log(bannerRef.current.files[0].name)
            storageRef.child(`${payload.id}/${bannerRef.current.files[0].name}`).put(bannerRef.current.files[0]).then(()=>{
                storageRef.child(`${payload.id}/${bannerRef.current.files[0].name}`).getDownloadURL().then((url)=>{
                    db.collection("volunteeringServices").doc(payload.id).update({
                        bannerURL:url
                    }).then(()=>
                    {
                        props.onHide()
                        setBanner(dummyImage)
                        setLoading(false)
                    }
                    )
                })
            })
        }).catch(()=>{setLoading(false)})
    }

    function showImage(e)
    {
        e.preventDefault()
        if(e.target.files[0])
        {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onloadend = function (e) {
                setBanner(reader.result)
            }
            reader.readAsDataURL(file)
        }
        
    }
    return (
        <Modal centered show={props.show} onHide={handleClose}>
            <Modal.Body>
            <Form className="theme-form" onSubmit={AddService}>
                <Image fluid src={banner} className="form-image" onClick={()=>{bannerRef.current.click()}}/>
                <Form.File 
                        id="custom-file"
                        label="Custom file input"
                        custom
                        accept="image/*"
                        className="hidden"
                        onChange={(e)=>showImage(e)} 
                        ref={bannerRef}
                        required
                    />
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
                <Form.Group controlId="timings">
                    <Form.Label>Services Provided</Form.Label>
                    <Form.Control type="text" placeholder="Enter service provided" ref={serviceProvidedRef} required/>
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

export default AddVolunteeringServices
