import React, { useRef, useState } from 'react'
import { Button, Form, Modal} from 'react-bootstrap'
import { db, timestamp } from '../firebase'
import { useAuth } from '../context/AuthProvider'



function DoctorCounsultationForm(props)
{
    const QuestionRef = useRef()
    const AnswerRef = useRef()
    const AnonymousRef = useRef()
    const {currentUser} = useAuth()
    const [loading,setLoading] = useState(false)

    function handleClose()
    {
        props.onHide()
    }

    function handleQuestion(event){
        event.preventDefault()
        setLoading(true)
        db.collection("DoctorConsultation").add({
                 question :QuestionRef.current.value,
                 is_anonymous :AnonymousRef.current.checked,
                 uploaded_on : timestamp,
                 author : {
                     name: currentUser.displayName,
                     uid : currentUser.uid,
                 }
             }).then(()=>{props.onHide()
                setLoading(false)})
             .catch((error)=>console.log)
    }

    function handleAnswers(event){
        event.preventDefault()
        setLoading(true)
        db.collection("DoctorConsultation").doc(props.question.id).update({
            answer :AnswerRef.current.value,  
            is_answered :true,
            answered_by : {
                name: currentUser.displayName,
                uid : currentUser.uid,
            }
        }).then(()=>{
            props.onHide()
            setLoading(false)
        })
        .catch((error)=>console.log)
    }


    return (
       
        <Modal centered show={props.show} onHide={handleClose}>
            <Modal.Header>
            <Modal.Title>  {props &&props.question ? props.question.question :<div className = "text-center">Add Question</div>} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {
            currentUser && !currentUser.is_doc_verified && (<Form className = "theme-form" onSubmit={handleQuestion}>
                <Form.Group controlId="Question">
                    <Form.Control as="textarea" placeholder="Enter your Question" ref={QuestionRef} rows = {8} />
                </Form.Group>
                <Form.Group className = "mt-4" controlId="isAnonymousCheckbox">
                    <Form.Check type="checkbox" label="Anonymous" ref={AnonymousRef}/>
                </Form.Group>
                <div className="modal-btn ml-auto">
                <Button type="submit" variant="primary" className="my-4" disabled={loading}>
                        Add Question
                </Button>
                <Button variant="secondary" className="my-4 mx-2" onClick={handleClose}>
                        Close
                </Button>
            </div>
            </Form>)
           }
          
            {
                
                currentUser &&currentUser.is_doc_verified &&(<Form className = "theme-form" onSubmit={handleAnswers}>
                    <Form.Group controlId="answer">
                        <Form.Control as="textarea" placeholder="Enter your answer" ref={AnswerRef} rows = {8} />
                    </Form.Group>
                     
                    <div className="modal-btn ml-auto">
                <Button type="submit" variant="primary" className="my-4" disabled={loading}>
                        Add Answer
                </Button>
                <Button variant="secondary" className="my-4 mx-2" onClick={handleClose}>
                        Close
                </Button>
            </div>
              </Form>)
            }

            </Modal.Body>      
                
        </Modal>
    )
}

export default DoctorCounsultationForm
