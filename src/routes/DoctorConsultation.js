import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import  { useEffect, useState } from 'react'
import { db } from '../firebase'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../context/AuthProvider'
import DoctorCounsultationForm from '../components/DoctorCounsultationForm'
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Accordion from 'react-bootstrap/Accordion'
import AppSidebar from '../components/AppSidebar'
import NTS from '../components/NTS'


function DoctorConsultation() {

    const [questions, setQuestions]= useState([])
    const [filteredQuestions, setFilteredQuestions] = useState([])
    const [filter, setFilter] = useState("all")
    const {currentUser} = useAuth()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [selectedQuestion, setSelectedQuestion ] = useState()
    const[pageLoading,setPageLoading] =useState(true)


    function handleShowAnswer(question)
    {
        setShow(true)
        setSelectedQuestion(question)
    }

    function deleteCard(id){
        db.collection("DoctorConsultation").doc(id).delete()
    }

    function handleFilter(filter)
    {
        setFilter(filter)
        if(questions.length>0)
        {
            if(filter === 'myquestions')
            {
                const filteredList = questions.filter(question => question.author.uid === currentUser.uid)
                setFilteredQuestions(filteredList)
            }
            else if (filter === 'all')
            {
                setFilteredQuestions(questions)
            }

            else if (filter === 'answeredquestions')
            {
                const filteredList = questions.filter(question => !question.is_answered)
                setFilteredQuestions(filteredList)
            }
        }
    } 

    useEffect(() => {
        var unsubscribe = db.collection("DoctorConsultation").orderBy("uploaded_on", "desc").onSnapshot((docs)=>{
            if(!docs.empty)
            {
                var questionsList = [];
                docs.docs.forEach((doc)=>{
                    questionsList.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                console.log(questionsList)
                setQuestions(questionsList)
                setFilteredQuestions(questionsList)
                setPageLoading(false)
            }else
            {
                setQuestions([])
                setFilteredQuestions([])
                setPageLoading(false)
            }
        })  
        return unsubscribe
    }, [])

    function search(keyword)
    {
        if (keyword === "")
            setFilteredQuestions(questions)
        else 
        {
            var newArray=questions.filter(question => question.question.toLowerCase().includes(keyword.toLowerCase()))
            setFilteredQuestions(newArray)
        }

    }
    


    return (
        <Container fluid>

            <Row>
                <Col lg={1}>
                    <AppSidebar/>
                </Col>
                <Col lg={11}>
                    <PageHeader heading="Doctor Consultations" subHeading="We will be happy to help you. We will overcome this together !" />

                    <Container fluid>
                        <Row>
                            <div className="page-header-small">
                                <Button variant="light" className={filter === 'all' && "theme-btn-selected shadow-none"} onClick={()=>{handleFilter('all')}}>All Questions</Button>

                            {
                            currentUser && currentUser.is_doc_verified ? (<Button variant="light" className={filter === 'answeredquestions' && "theme-btn-selected"} onClick={()=>{handleFilter('answeredquestions')}}>Unanswered Question</Button>) : (<Button variant="light" className={filter === 'myquestions' && "theme-btn-selected"} onClick={()=>{handleFilter('myquestions')}}>My Questions</Button>)
                            }  


                            </div>
                        </Row>
                        </Container>
                        <Container fluid>
                    <Row>
                    <Col>
                    <Form className ="theme-form">
                        < Form.Group>
                                <Form.Control type = "text" placeholder = "Search for keywords" onChange={event => {search(event.target.value)}}/>
                        </ Form.Group>
                    </Form>
                    </Col>
                    </Row>
                </Container>
            {!pageLoading && filteredQuestions && filteredQuestions.length > 0 && filteredQuestions.map((question,key)=>{
                    return (
                        <Container fluid key={key}>
                    <Row>
                        <Accordion>
                        <div className="list-item my-3">
                            <Container fluid>
                                <Row>
                                    <Col xs className="list-details p-0">
                                            {(question.author.uid===currentUser.uid) && (<div className="delete-container">
                                                <Button variant='light' onClick={()=>{deleteCard(question.id)}}><FontAwesomeIcon icon={faTimes} /></Button>
                                            </div>)}
                                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                                <h1>{question.question}</h1> 
                                            </Accordion.Toggle>

                                        <Accordion.Collapse eventKey="0" className="answered-section">
                                             <Card.Body>{question.is_answered?(
                                                 <>
                                                 {question.answer}
                                                 <h6>~ By <span>Dr. {question.answered_by.name}</span> </h6>
                                                 </> ):"Yet to be Answered"}</Card.Body>
                                        </Accordion.Collapse>

                                    </Col>
                                    
                                    {currentUser && currentUser.is_doc_verified && (
                                        <Col className="list-details list-container">
                                            <Button variant = "light" onClick={()=>handleShowAnswer(question)}>
                                            <FontAwesomeIcon icon={faPen} />
                                            </Button> 
                                        </Col>)
                                    }      
                                   
                                </Row>
                            </Container>
                        </div>
                        </Accordion>
                    </Row>
                </Container>)
                })
            }

            {!pageLoading && filteredQuestions && filteredQuestions.length <1 &&(
                        <NTS />
                    )}

          {
               currentUser && !currentUser.is_doc_verified && ( 
               <>
                    <Button className="floating-r-btn bg-dark text-light" onClick={handleShow} >
                        Add Question
                    </Button>
                   
                </>)
          }

           <DoctorCounsultationForm show={show} onHide={handleClose} question = {selectedQuestion} />

        
        </Col>
          </Row>
          </Container>
    )}

export default DoctorConsultation