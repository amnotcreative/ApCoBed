import React,{useRef, useState} from 'react'
import { Button, Col, Container, Form, Row, Modal} from 'react-bootstrap'
import { useAuth } from '../context/AuthProvider'
import {db, storageRef, timestamp} from '../firebase'


function AddFundraisers(props) {

  const fundraiserNameRef = useRef()
  const DescriptionRef = useRef()
  const patientNameRef = useRef()
  const AmountneededRef = useRef()
  const [docs, setdocs] = useState()
  const BannerRef = useRef()
  const {currentUser}= useAuth()
  const [Banner, setBanner] = useState()
  const [loading,setLoading] = useState(false)

   function handleClose(){
     props.onHide()
   }
   function handledocs(event)
   {
      var docscount= event.target.files.length
      var docslist = []
      for (var i=0; i<docscount; i++){
        docslist.push(event.target.files[i])
      }
      console.log(docslist)
      setdocs(docslist)
   }
   function handleSubmit(event)
    {
        event.preventDefault()
        setLoading(true)
        db.collection("Fundraisers").add({
            name_of_fundraiser :fundraiserNameRef.current.value,
            description :DescriptionRef.current.value,
            fundraiser_for :patientNameRef.current.value,
            amount_needed :AmountneededRef.current.value,
            amountReceived: 0,
            uploadedOn: timestamp,
            isPaymentProcessing: false,
            author :{
              name: currentUser.displayName,
              uid: currentUser.uid,
            },
            donated_by: []
        }).then((payload)=>{
          storageRef.child(`${payload.id}/${Banner.name}`).put(Banner).then((file_payload)=>{
            storageRef.child(`${payload.id}/${Banner.name}`).getDownloadURL().then((url)=>{
              db.collection("Fundraisers").doc(payload.id).update({
                banner: url
              })
            })
            
            var uploadedItemProcessed = 0;
            var uploadedDocListUrl = [];

            docs.forEach((element) => 
            {
              uploadedItemProcessed++;
              storageRef.child(`${payload.id}/${element.name}`).put(element).then(()=>{
                storageRef.child(`${payload.id}/${element.name}`).getDownloadURL().then((url)=>{
                  uploadedDocListUrl.push(url)
                }).then(()=>{
                  if(uploadedItemProcessed===docs.length){
                    console.log(uploadedDocListUrl)
                    db.collection("Fundraisers").doc(payload.id).update({
                      documentsProvided: uploadedDocListUrl
                      }).then(()=> {
                        props.onHide()
                        setLoading(false)
                    })
                  }
                })
              })

               
            })
          })
        })
       .catch((error)=>{console.log(error); setLoading(false)})
        
    }
    function handleBanner(e){
      setBanner(e.target.files[0])
      console.log(e.target)
    }
    return (
    <Modal centered show={props.show} onHide= {handleClose}>
        <Modal.Header>
            <Modal.Title>Add New Fundraiser</Modal.Title>
            </Modal.Header>
            <Modal.Body>
        <Container fluid> 
              <Row>
                <Col lg={12}>
                <Form className="theme-form" onSubmit={handleSubmit}>
                  <Form.Group className="mt-2 mb-2" controlId="Name">
                    <Form.Label>Name of the Fundraiser:</Form.Label>
                    <Form.Control type="text" placeholder="Enter the name of the fundraiser" ref={fundraiserNameRef} required/>
                  </Form.Group>
                  <Form.Group className="mt-2 mb-2" controlId="description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="Describe the condtion of the patient" ref={DescriptionRef} required/>
                  </Form.Group>
                  <Form.Group className="mt-2 mb-2" controlId="fundraiserfor">
                    <Form.Label>Fundraiser for:</Form.Label>
                    <Form.Control type="text" placeholder="Enter the name of the patient" ref={patientNameRef} required/>
                  </Form.Group>
                  <Form.Group className="mt-2 mb-2" controlId="amountneeded">
                    <Form.Label>Amount Needed:</Form.Label>
                    <Form.Control type="number" placeholder="Enter the needed amount" ref={AmountneededRef} required/>
                  </Form.Group>
                  <Form.Group className="d-flex flex-column mt-2 mb-2" controlId="amountcollected">
                    <Form.Label>Documents:</Form.Label>
                    <Form.Control multiple type="file" accept="image/*,.pdf" onChange= {handledocs} required/>
                  </Form.Group>
                  <Form.Group className="d-flex flex-column mt-2 mb-2" controlId="banner">
                    <Form.Label>Banner:</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={(e)=>handleBanner(e)} ref={BannerRef} required/>
                  </Form.Group>
                <div className="modal-btn ml-auto">
                    <Button type="submit" variant="primary" className="my-4" disabled={loading}>
                            Add Fundraiser
                    </Button>
                    <Button variant="secondary" className="my-4 mx-2" onClick={handleClose}>
                            Close
                    </Button>
                </div>
            </Form>
              </Col>
          </Row>
      </Container>
    </Modal.Body>
    </Modal>
    )
}

export default AddFundraisers
