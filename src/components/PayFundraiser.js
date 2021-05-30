import React,{ useRef, useState} from 'react'
import { Button, Col, Container, Form, Row, Modal} from 'react-bootstrap'
import { useAuth } from '../context/AuthProvider'
import {db, firebasevalue} from '../firebase'
import { useParams } from 'react-router-dom'
import GooglePayButton from '@google-pay/button-react';

function PayFundraiser(props) {
    
    const {id} = useParams();
    const nameRef = useRef()
    const AmountRef = useRef()
    const {currentUser}= useAuth()
    const [isAnonymous,setAnonymous] = useState(false);
    const [amount, setAmount] = useState(0);
    const [loading,setLoading] = useState(false);


    const paymentRequest = {
        
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA']
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'example'
              }
            }
          }
        ],
        merchantInfo: {
          merchantId: 'BCR2DN6TR7VJHDZH',
          merchantName: 'CoBeD'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Donate',
          totalPrice: amount,
          currencyCode: 'INR',
          countryCode: 'IN'
        }
    };

    function handleClose(){
        props.onHide()
    }

    function handleSubmit(event){
        event.preventDefault();
    }

    function handlePaymentSuccess(){
        if(isAnonymous){
            setLoading(true)
            db.collection("Fundraisers").doc(id).update({
                amountReceived: firebasevalue.increment(AmountRef.current.value),
                donatedBy: firebasevalue.arrayUnion({donator: "Anonymous", uid: currentUser.uid, amount: AmountRef.current.value})
            }).then(()=>{
                props.onHide()
                setLoading(false)
            })
        }
        else{
            setLoading(true)
            db.collection("Fundraisers").doc(id).update({
                amountReceived: firebasevalue.increment(AmountRef.current.value),
                donatedBy: firebasevalue.arrayUnion({donator: nameRef.current.value, uid: currentUser.uid, amount: AmountRef.current.value})
            }).then(()=>{
                props.onHide()
                setLoading(false)
            })
        }
    }

    return (
        <Modal centered show={props.show} onHide= {handleClose}>
            <Modal.Header>
                <Modal.Title>Donate Now</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid> 
                    <Row>
                        <Col lg={12}>
                            <Form className="theme-form" onSubmit={handleSubmit}>
                                <Form.Group controlId="nameOfDonator">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Your Name" ref={nameRef} required></Form.Control>
                                </Form.Group>
                                <Form.Group controlId="Anonymous">
                                    <Form.Label>Do you want to remain anonymous? </Form.Label>
                                    <Form.Check type="checkbox" label="Yes" onChange={(event)=>setAnonymous(event.target.checked)}></Form.Check>
                                </Form.Group>
                                <Form.Group controlId="amountDonated">
                                    <Form.Label>Amount:</Form.Label>
                                    <Form.Control type="number" placeholder="Amount" ref={AmountRef} onChange={()=>setAmount(AmountRef.current.value)} required></Form.Control>
                                </Form.Group>
                                <div className="mx-3">
                                    <GooglePayButton 
                                        environment="TEST"
                                        buttonColor="black"
                                        buttonType="donate"
                                        className="btn"
                                        paymentRequest={paymentRequest}
                                        disabled = {loading}
                                        onLoadPaymentData={paymentRequest => {
                                            console.log('load payment data', paymentRequest);
                                            handlePaymentSuccess();
                                        }}
                                    />
                                    <Button variant="secondary" className="close" onClick={handleClose}>
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

export default PayFundraiser