import React from 'react'
import Jdenticon from 'react-jdenticon';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthProvider"
function ProfileContainer() {

    const {currentUser} = useAuth() 

    return (
        <div className="identicon">
            <Link to="/profile">
                <Jdenticon size="48" value={currentUser.displayName}/>
            </Link>
        </div>
    )
}

export default ProfileContainer
