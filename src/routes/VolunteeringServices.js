import React,{useEffect, useState} from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import AddVolunteeringServices from '../components/AddVolunteeringServices'
import AppSidebar from '../components/AppSidebar'
import NTS from '../components/NTS'
import PageHeader from '../components/PageHeader'
import {db} from '../firebase'
import { useAuth } from '../context/AuthProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function VolunteeringService() { 
    const [filteredVolunteerServices,setFilteredVolunteerServices] =useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const[pageLoading,setPageLoading] =useState(true)
    const {currentUser}= useAuth()
    
    useEffect(() => {
        var unSubscribe = db.collection("volunteeringServices").onSnapshot((docs)=>{
            if(!docs.empty)
            {
                var volunteerservices=[]
                docs.forEach((volunteerDet)=>{
                    volunteerservices.push({id:volunteerDet.id,...volunteerDet.data()})
                })
                setFilteredVolunteerServices(volunteerservices)
                setPageLoading(false)
            }else
            {
                setFilteredVolunteerServices([])
                setPageLoading(false)
            }
        })

        return unSubscribe
    }, [])

    function deleteCard(id){
        db.collection("volunteeringServices").doc(id).delete()
    }

    return (
        <>
        <Container fluid>
            <Row>
                <Col lg={1}>
                    <AppSidebar />
                </Col>
                <Col lg={11}>
                <PageHeader heading="Volunteering Services" subHeading="Here you will get details of all services provided by volunteers" />
                <Container fluid>
                    <Row>
                        <div className="page-header-small">
                        </div>
                    </Row>
                </Container>
       
        <div className="item-container">
            <Container fluid>
                <Row>
        {filteredVolunteerServices.length > 0 && filteredVolunteerServices.map((volunteerService,key)=>{
            return(
                <Col lg={3}>
                    <Card>
                        <Card.Img variant="top" src={volunteerService.bannerURL} className="card-top-volunteer" />
                        <Card.Body>
                            <div className="tags-small text-center">{volunteerService.type}</div>
                            <div className="list-details no-border">
                                        <h1>{volunteerService.name_of_provider }</h1>
                                        <h2>{volunteerService.timings}</h2>
                                        <h2>{volunteerService.number}</h2>
                                        <h3>{volunteerService.locations}</h3>
                            </div>
                            {(volunteerService.author.id==currentUser.uid) && (<div className="delete-container">
                                <Button variant='light' onClick={()=>{deleteCard(volunteerService.id)}}><FontAwesomeIcon icon={faTimes} /></Button>
                            </div>)}
                        </Card.Body>
                        </Card>
                </Col>
                
            )
        })}
        {filteredVolunteerServices && filteredVolunteerServices.length <1 &&(
            <NTS />
        )}
        </Row>
        </Container>
        </div>

                <Button className="floating-r-btn bg-dark text-light" onClick={handleShow} >
                    Add New Service
                </Button>

                <AddVolunteeringServices show={show} onHide={handleClose} />
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default VolunteeringService
