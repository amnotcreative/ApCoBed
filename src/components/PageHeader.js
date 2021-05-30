import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

function PageHeader(props) {
    return (
        <Container fluid className="p-0">
            <Row noGutters>
                <Col lg={12} className="p-0">
                <div className="page-header text-white bg-theme">
                    {props.heading}
                    <span>{props.subHeading}</span>
                </div>
                </Col>
            </Row>
        </Container>
    )
}

export default PageHeader
