import { faCogs, faPowerOff, faThLarge, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import React, { useEffect } from 'react'
import { Col } from 'react-bootstrap'
import { NavLink, useHistory } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

function PoliceSidebar() {

    const {currentUser, logout} = useAuth()
    const history = useHistory()

    async function handleLogout() {    
        try {
          await logout()
          history.push("/hospital-login")
        } catch {
          console.log("Failed to log out")
        }
      }
      useEffect(()=>{
        if(currentUser && currentUser.isHospital === undefined)
        {
            handleLogout()
        }
      },[currentUser])

    return (
        <Col lg={1} className = "hospital-sidebar-container">
                   <div  className="hospital-sidebar">
                       <div className="hospital-app-brand">
                       <h3> ApCoBed </h3>
                       </div>
                       <ul className = "hospital-sidebar-menu">
                       <NavLink activeClassName = "active" to="/hospital-dashboard"> <li><span><FontAwesomeIcon icon = {faThLarge}></FontAwesomeIcon> </span>
                               <h4>Dashboard</h4>
                           </li>
                           </NavLink>
                           <NavLink activeClassName = "active" to="/PatientRecords"><li><span><FontAwesomeIcon icon = {faUser}></FontAwesomeIcon> </span>
                           <h4>Records</h4>
                           </li>
                           </NavLink>
                           <NavLink activeClassName = "active" to="/HospitalSettings"> <li><span><FontAwesomeIcon icon = {faCogs}></FontAwesomeIcon> </span>
                               <h4>Settings</h4>
                           </li>
                           </NavLink>
                       </ul>
                       <div className="sidebar-down">
                           <h5> {currentUser.displayName.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')} </h5>
                           <Button variant="light" onClick={handleLogout} className="hospital-logout-btn"><FontAwesomeIcon icon = {faPowerOff}></FontAwesomeIcon> Logout</Button>
                       </div>
                   </div>
               </Col>
    )
}

export default PoliceSidebar
