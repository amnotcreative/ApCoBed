import { faClinicMedical, faHandHoldingHeart, faHandsHelping, faPowerOff, faReceipt, faStethoscope, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

function AppSidebar() {
    const {logout} = useAuth()
    const history = useHistory()
    async function handleLogout() {    
        try {
          await logout()
          history.push("/")
        } catch {
          console.log("Failed to log out")
        }
      }
    return (
        <div  className="hospital-sidebar">
            <ul className = "user-sidebar-menu">
                <NavLink to="/dashboard" activeClassName="active"><li><span><FontAwesomeIcon icon = {faClinicMedical}></FontAwesomeIcon> </span>
                    <h4>Home</h4>
                </li></NavLink>
                <NavLink to="/leads" activeClassName="active"><li><span><FontAwesomeIcon icon = {faReceipt}></FontAwesomeIcon> </span>
                    <h4>Leads</h4>
                </li></NavLink>
                <NavLink to="/help" activeClassName="active"><li><span><FontAwesomeIcon icon = {faHandsHelping}></FontAwesomeIcon> </span>
                    <h4>Help</h4>
                </li></NavLink>
                <NavLink to="/question" activeClassName="active"><li><span><FontAwesomeIcon icon = {faStethoscope}></FontAwesomeIcon> </span>
                    <h4>Q/A</h4>
                </li></NavLink>
                <NavLink to="/fundraiser" activeClassName="active"><li><span><FontAwesomeIcon icon = {faHandHoldingHeart}></FontAwesomeIcon> </span>
                    <h4>Charity </h4>
                </li></NavLink>
                <NavLink to="/profile" activeClassName="active"><li><span><FontAwesomeIcon icon = {faUser}></FontAwesomeIcon> </span>
                    <h4>Profile</h4>
                </li></NavLink>
                <NavLink onClick={handleLogout} to="/login" activeClassName="active" className="m-no-show"><li><span><FontAwesomeIcon icon = {faPowerOff}></FontAwesomeIcon> </span>
                    <h4>Logout</h4>
                </li></NavLink>
            </ul>
        </div>
        
    )
}

export default AppSidebar
