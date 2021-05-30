import React from 'react'
import { Image } from 'react-bootstrap'
import sadIllustration from '../img/sad.png'
import '../routes/styles/nothing-to-show.css'
function NTS() {
    return (
        <div className="nothing-to-show">
            <Image src={sadIllustration}/>
            <h4>We have nothing to show at this moment . </h4>
        </div>
    )
}

export default NTS
