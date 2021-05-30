import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React,{useEffect, useState} from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import AddLeadServices from '../components/AddLeadServices'
import AppSidebar from '../components/AppSidebar'
import NTS from '../components/NTS'
import PageHeader from '../components/PageHeader'
import {db} from '../firebase'
import bloodIcon from "../img/blood-drop.svg"
import oxygenIcon from "../img/oxygen.svg"
import telephoneIcon from "../img/telephone.svg"
import ambulanceIcon from "../img/ambulance.svg"
import { useAuth } from '../context/AuthProvider'

function Leads() { 
    const [volunteerServices,setVolunteerServices] =useState([])
    const [filteredVolunteerServices,setFilteredVolunteerServices] =useState([])
    const [filter,setFilter]=useState("all")
    const [show, setShow] = useState(false);
    const[pageLoading,setPageLoading] =useState(true)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {currentUser}= useAuth()
    
    useEffect(() => {

        var unSubscribe = db.collection("leads").orderBy("uploaded_on","desc").onSnapshot((docs)=>{
            if(!docs.empty)
            {
                console.log("if")
                var volunteerservices=[]
                docs.forEach((volunteerDet)=>{
                    if(volunteerDet.exists)
                    {
                        volunteerservices.push({id:volunteerDet.id,...volunteerDet.data()})
                    }
                })
                setVolunteerServices(volunteerservices)
                setFilteredVolunteerServices(volunteerservices)
                setPageLoading(false)
            }
            else
            {
                setVolunteerServices([])
                setFilteredVolunteerServices([])
                setPageLoading(false)
            }
        })

        return unSubscribe
    }, [])

    function handleFilter(filter)
    {
        setFilter(filter)
        if(volunteerServices.length > 0)
        {
            if(filter !== 'all')
            {
                const filteredList = volunteerServices.filter(volunteerService => volunteerService.type===filter)
                setFilteredVolunteerServices(filteredList)
            }
            else
            {
                setFilteredVolunteerServices(volunteerServices)
            }
        }
    } 

    function deleteCard(id){
        console.log(id)
        db.collection("leads").doc(id).delete()
    }


    return (
        <>
        <Container fluid>
            <Row>
                <Col lg={1}>
                    <AppSidebar />
                </Col>
                <Col lg={11}>
                    <PageHeader heading="Happy to Help!!" subHeading="Here you will get details of all covid related services" />
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <div className="page-header-small">
                                <Button variant="light" className={filter === 'all' && "theme-btn-selected shadow-none"} onClick={()=>{handleFilter('all')}}>All</Button>
                                <Button variant="light" className={filter === 'oxygen' && "theme-btn-selected"} onClick={()=>{handleFilter('oxygen')}}>Oxygen</Button>
                                <Button variant="light" className={filter === 'plasma' && "theme-btn-selected"} onClick={()=>{handleFilter('plasma')}}>Plasma</Button>
                                <Button variant="light" className={filter === 'ambulance' && "theme-btn-selected"} onClick={()=>{handleFilter('ambulance')}}>Ambulance</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>

        {!pageLoading && (<div className="item-container">
        {filteredVolunteerServices && filteredVolunteerServices.length > 0 && filteredVolunteerServices.map((volunteerService,key)=>{
            return(
                <Container fluid key={key}>
                    <Row>
                        <div className="list-item">
                            <Container fluid>
                                <Row>
                                    <Col xs={2} className="list-container">
                                        {volunteerService.type === "oxygen" && (
                                            <img src={oxygenIcon} className="item-icon" alt="Oxygen-icon"/>
                                        )}
                                        {volunteerService.type === "plasma" &&(
                                            <img src={bloodIcon} className="item-icon" alt="plasma-icon" />
                                        )}
                                        {volunteerService.type === "ambulance" &&(
                                            <img src={ambulanceIcon} className="item-icon" alt="ambulance-icon" />
                                        )}
                                        
                                    </Col>
                                    <Col xs={9} lg={10} className="list-details">
                                        <h1>{volunteerService.name_of_provider }</h1>
                                        <h2>{volunteerService.timings}</h2>
                                        <h2>{volunteerService.number}</h2>
                                        <h3>{volunteerService.locations}</h3>
                                    </Col>
                                    <Col xs={1} className="list-details list-container">
                                        {volunteerService.is_verified && (
                                            <span className="verified"><FontAwesomeIcon icon={faCheck} />Verified</span>
                                        )}
                                        <a href={`tel:${volunteerService.number}`}><img src={telephoneIcon} alt="call-icon" className="item-icon-small" /></a>
                                        {(volunteerService.author.id===currentUser.uid) && (<div className="delete-container">
                                        <Button variant='light' onClick={()=>{deleteCard(volunteerService.id)}}><FontAwesomeIcon icon={faTimes} /></Button>
                                        </div>)}
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Row>
                </Container>
                
            )
        })}
        {filteredVolunteerServices && filteredVolunteerServices.length <1 &&(
            <NTS />
        )}
        </div>)

        }
        

                <Button className="floating-r-btn bg-dark text-light" onClick={handleShow} >
                    Add Lead
                </Button>

                <AddLeadServices show={show} onHide={handleClose} />
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default Leads
