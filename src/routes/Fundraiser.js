import React,{useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useAuth } from '../context/AuthProvider'
import {db} from '../firebase'
import AddFundraisers from '../components/AddFundraisers'
import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import './styles/fundraiserLanding.css'
import AppSidebar from '../components/AppSidebar'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import NTS from '../components/NTS'

function Fundraiser() {
    const [fundraiserFilteredList, setfundraiserFilteredList] = useState()
    const [fundraiserList, setfundraiserList] = useState([])
    const [filter,setFilter]=useState("all")
    const [show, setShow] = useState(false);
    const[pageLoading,setPageLoading] =useState(true)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {currentUser}= useAuth()
    useEffect(() => {
       db.collection("Fundraisers").onSnapshot((docs)=>{
        
        if (!docs.empty)
           
           {
               var fundraisers=[]
               docs.forEach((doc)=>fundraisers.push({id:doc.id,...doc.data()}))
               setfundraiserFilteredList(fundraisers)
               setfundraiserList(fundraisers)
               setPageLoading(false)
           }else
           {
                setfundraiserFilteredList([])
                setfundraiserList([])
                setPageLoading(false)
           }
       }) 
    }, [])
    function handleFilter(filter){
        if(fundraiserList.length >0 )
        {
            if (filter === "my"){
                var filteredList = fundraiserList.filter(fundraiser => fundraiser.author.uid===currentUser.uid)
                setfundraiserFilteredList(filteredList)
            }
            else{
                setfundraiserFilteredList(fundraiserList)
            }
        }
    }

    function deleteCard(id){
        db.collection("Fundraisers").doc(id).delete()
    }

    return(
    <> 
     <Container fluid>
            <Row>
                <Col lg={1}>
                    <AppSidebar />
                </Col>
                <Col lg={11}>
                <PageHeader heading="Fundraisers" subHeading="Let's help each other!" />
                <Container fluid>
                    <Row>
                        <div className="page-header-small">
                            <Button variant="light" className={filter === 'all' && "theme-btn-selected shadow-none"} onClick={()=>{
                                handleFilter('all')
                                setFilter('all')
                            }}>All</Button>
                            <Button variant="light" className={filter === 'my' && "theme-btn-selected shadow-none"} onClick={()=>{
                                handleFilter('my')
                                setFilter('my')
                            }}>My Fundraisers</Button>
                        </div>
                    </Row>
                </Container>
    

         {!pageLoading && <div className="item-container">
            <Container fluid>
                <Row>
                    {fundraiserFilteredList && fundraiserFilteredList.length > 0 && fundraiserFilteredList.map((fundraiser,key)=>{
                        const description = fundraiser.description.length<=100?fundraiser.description.slice(0,100):fundraiser.description.slice(0,100)+" ...";
                        return(
                            <Col lg={4}>
                                <div className="p-2">
                                    <Card>
                                        <Link to={"/fundraiser/"+fundraiser.id}>
                                            <Card.Img className="card-item-banner" variant="top" src={fundraiser.banner} />
                                            <Card.Body>
                                                <div className="tags-small text-center my-1">{fundraiser.fundraiser_for}</div>
                                                <div className="list-details no-border">
                                                            <h1>{fundraiser.name_of_fundraiser}</h1>
                                                            <h2>{description}</h2>
                                                            <h2>{fundraiser.fundraiser_for}</h2>
                                                            <h3>Goal: Rs.{fundraiser.amount_needed}</h3>
                                                </div>
                                            </Card.Body>
                                        </Link>
                                        {(fundraiser.author.uid===currentUser.uid) && (<div className="delete-container">
                                            <Button variant='light' onClick={()=>{deleteCard(fundraiser.id)}}><FontAwesomeIcon icon={faTimes} /></Button>
                                        </div>)}
                                    </Card>
                                </div>
                            </Col>
                            
                        )
                    })}
                </Row>
            </Container>
            {fundraiserFilteredList && fundraiserFilteredList.length <1 && <NTS />}
        </div>}

         <Button className="floating-r-btn bg-dark text-light" onClick={handleShow} >
                    Add Fundraiser
                </Button>
         <AddFundraisers show={show} onHide={handleClose}></AddFundraisers> 
         </Col>
    </Row>
    </Container>
    </>
  )

}

export default Fundraiser