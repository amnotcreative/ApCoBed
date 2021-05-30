import React from 'react'
import { Image } from 'react-bootstrap'
import illustration from '../img/404.png'
import '../routes/styles/nothing-to-show.css'
function NotFound() {
    return (
        <div className="nothing-to-show">
            <Image src={illustration}/>
            <h4>You just lost your way man . </h4>
        </div>
    )
}

export default NotFound
