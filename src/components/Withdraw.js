import React,{useEffect, useRef, useState} from 'react'
import { Button, Col, Container, Form, Row, Modal} from 'react-bootstrap'
import { useAuth } from '../context/AuthProvider'
import {db} from '../firebase'
import { useParams } from 'react-router-dom'

function Withdraw(props) {
    
    const {id} = useParams();
    const nameRef = useRef()
    const AmountRef = useRef()
    const AccountNumberRef = useRef()
    const IfscCodeRef = useRef()
    const [loading,setLoading] = useState(false);
    const [fundraiser, setFundraiserData] = useState();

    useEffect(()=>{

        var unsubscribe = db.collection("Fundraisers").doc(id).onSnapshot((docs)=>{
                                if(docs.exists){
                                    setFundraiserData(docs.data())
                                }
                            });
        return unsubscribe;
    },[])

    function handleClose(){
        props.onHide()
    }

    function handleSubmit(event){
        event.preventDefault();
        setLoading(true);
        db.collection("Fundraisers").doc(id).update({
            isPaymentProcessing: true,
            accountNumber: AccountNumberRef.current.value,
            ifscCode: IfscCodeRef.current.value,
            authorBankName: nameRef.current.value,
            withdrawalAmount: AmountRef.current.value
        }).then(() => {
            setLoading(false);
        })
    }

    return (
        <>
            {fundraiser &&
            <Modal centered show={props.show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Withdraw Now</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid> 
                    <Row>
                        <Col lg={12}>
                            <Form className="theme-form" onSubmit={handleSubmit}>
                                <Form.Group controlId="nameOfDonator">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Your Name Registered in Bank" ref={nameRef} required disabled={fundraiser.isPaymentProcessing}></Form.Control>
                                </Form.Group>
                                <Form.Group controlId="amountDonated">
                                    <Form.Label>Amount:</Form.Label>
                                    <Form.Control type="number" placeholder="Amount" min={0} max={fundraiser.amountReceived} ref={AmountRef} required disabled={fundraiser.isPaymentProcessing}></Form.Control>
                                </Form.Group>
                                <Form.Group controlId="bankAccountNumber">
                                    <Form.Label>Bank Account Number:</Form.Label>
                                    <Form.Control type="number" placeholder="Bank Account Number" ref={AccountNumberRef} required disabled={fundraiser.isPaymentProcessing}></Form.Control>
                                </Form.Group>
                                <Form.Group controlId="IFSC Code">
                                    <Form.Label>Bank IFSC Code:</Form.Label>
                                    <Form.Control type="text" placeholder="IFSC Code of Bank" ref={IfscCodeRef} required disabled={fundraiser.isPaymentProcessing}></Form.Control>
                                </Form.Group>
                                {fundraiser.isPaymentProcessing && <Form.Label>Your Payment is processing, please wait.</Form.Label>}
                                <Row className="d-flex mx-5 my-3 w-100">
                                    <div>
                                        <Button variant="primary mx-5" type="submit" disabled={loading && fundraiser.isPaymentProcessing}>
                                            Withdraw
                                        </Button>
                                        <Button variant="danger" className="close" onClick={handleClose}>
                                            Close
                                        </Button>
                                    </div>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            </Modal>}
        </>
    )
}

export default Withdraw