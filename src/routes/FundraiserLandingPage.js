import React,{useEffect, useState} from 'react'
import {db} from '../firebase'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Image, ProgressBar, Button } from 'react-bootstrap';
import './styles/fundraiserLanding.css'
import './styles/EditProfile.css'
import PayFundraiser from '../components/PayFundraiser'
import Withdraw from '../components/Withdraw'
import { useAuth } from '../context/AuthProvider'
import { useHistory } from 'react-router'
import NotFound from '../components/NotFound';


function FundraiserLandingPage() {
    const history = useHistory();
    const {id} = useParams();
    const [fundraiser, setFundraiserData] = useState();
    const [progress,setProgress] = useState();
    const [show, setShow] = useState(false);
    const [withdrawShow, setWithdrawShow] = useState(false);
    const [notFound,setNotFound]=useState(false)
    const [loading,setLoading]=useState(true)
    const {currentUser} = useAuth();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleWithdrawClose = () => setWithdrawShow(false);
    const handleWithdrawShow = () => setWithdrawShow(true);

    useEffect(()=>{


        var unsubscribe = db.collection("Fundraisers").doc(id).onSnapshot((docs)=>{
            if(docs.exists){
                setFundraiserData(docs.data())
                setProgress((docs.data().amountReceived/docs.data().amount_needed)*100);
                setLoading(false)
            }else
            {
                setNotFound(true)
                setLoading(false)
            }
        });

        return unsubscribe;
    },[])

    return (
        <>
        {!notFound && !loading && (
            <>
            <Container fluid>
            <Row >
                <div className="design-container">
                    <div className="app-brand-landing text-light">ApCoBed</div>
                </div>
            </Row>
        </Container>

        {fundraiser &&
        <div>
            <Container>
                <Row>
                    <Col lg={12}>
                        <Image className="img-fluid fundraiserBanner" src={fundraiser.banner} />                              
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <div className="tags-small text-center my-1 tags"> {"Fundraiser by: " + fundraiser.author.name}</div>
                        <div className="fundraiser-details no-border">
                            <h1>{fundraiser.name_of_fundraiser}</h1>
                            <h3>Fundraiser For: {fundraiser.fundraiser_for}</h3>
                            <span className="goal">Goal: {"Rs. " + fundraiser.amount_needed}</span>
                            <ProgressBar animated now={progress} label={"Rs. "+fundraiser.amountReceived} />
                            <p>{fundraiser.description}</p>
                            <div className="d-flex align-items-center" >
                                {fundraiser.documentsProvided.map((document,key) => {
                                    return(
                                        <a href={document} target="_blank" rel="noreferrer">
                                            <div className="doc-render mx-2">
                                                <Image className="fundraiser-doc-render" src={document} />
                                            </div>
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                        {/* if user logged in and is not author*/}
                        {currentUser && (!(currentUser.uid===fundraiser.author.uid) &&
                        (<Button className="floating-r-btn bg-dark text-light" onClick={()=>{
                            if((currentUser===undefined) || (currentUser===null)){
                                history.push('/')
                            }
                            else{
                                handleShow();
                            }
                        }}>
                            Donate Now
                        </Button>))}

                        {/* if user logged in and is author*/}

                        {currentUser && (currentUser.uid===fundraiser.author.uid) &&
                        (<Button className="floating-r-btn bg-dark text-light" onClick={()=>{
                            if(fundraiser.amountReceived){
                                handleWithdrawShow();
                            }
                        }}>
                            Withdraw
                        </Button>)}

                        {/* if user logged not*/}

                        {!currentUser &&
                        (<Button className="floating-r-btn bg-dark text-light" onClick={()=>{
                            if((currentUser===undefined) || (currentUser===null)){
                                history.push('/')
                            }
                            else{
                                handleShow();
                            }
                        }}>
                            Donate Now
                        </Button>)}
                        <PayFundraiser show={show} onHide={handleClose} />
                        <Withdraw show={withdrawShow} onHide={handleWithdrawClose} />
                    </Col>
                </Row>
            </Container>
        </div>}
        </>
        )}
        {notFound && !loading && <NotFound />}
            
        </>
    )
}

export default FundraiserLandingPage
