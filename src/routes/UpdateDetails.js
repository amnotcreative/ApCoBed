import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { useAuth } from '../context/AuthProvider'
import './styles/login.css'
import '../routes/styles/map.css'
import '../routes/styles/sidebar.css'
import mapStyle from '../components/mapStyle'
import {GeoFirestore, geoRef } from '../firebase';
import { Col, Container, Row, Spinner,Button, Form } from 'react-bootstrap';
import PlacesAutocomplete, { geocodeByAddress, getLatLng} from "react-places-autocomplete";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import GoogleMapReact from "google-map-react";

const Marker = ({children}) => children ;

function UpdateDetails() {
    const updateHospitalNameRef = useRef()
    const updateAvailableBedRef = useRef()
    const updateOccupiedBedRef = useRef()
    const updateTotalBedRef = useRef()
    const updatePhoneNumberRef = useRef()
    const [loading, setLoading] = useState(false)
    const { currentUser } = useAuth()
    const history = useHistory()
    const [error, setError] = useState("")

    const [currentLocation, setCurrentLocation] = useState()
    const [locationCenter, setLocationCenter] = useState()
    const [address,setAddress] = useState("")
    const [selectedCoordinates, setSelectedCoordinates] =useState()
    const [selectedAddrress, setSelectedAddrress] =useState()

    const mapOptions = {
        styles: mapStyle,
        disableDefaultUI:true
    };

    function success(pos) {
        var crd = pos.coords;
        setCurrentLocation({lat:crd.latitude,lng:crd.longitude})
        setLocationCenter({lat:crd.latitude,lng:crd.longitude})
      }
      function errorCallback(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
    useEffect(()=>{
        if (navigator.geolocation) {
            var options = {
                enableHighAccuracy: true,
                timeout: 60000 ,
                maximumAge: 100
              };
            var watchID = navigator.geolocation.watchPosition(success, errorCallback, options);
            setTimeout( function() { navigator.geolocation.clearWatch( watchID ); }, 5000 );

        } else {
            // Fallback for no geolocation
            
        }
    },[])


    async function handleSelect(value){
        const results = await geocodeByAddress(value)
        const fetchedCoordinates  = await getLatLng(results[0])
        setSelectedCoordinates({lat:fetchedCoordinates.lat , lng:fetchedCoordinates.lng})
        setSelectedAddrress(value)
        setLocationCenter({lat:fetchedCoordinates.lat , lng:fetchedCoordinates.lng})
    }

    function resetLocation()
    {
        setSelectedCoordinates()
        setSelectedAddrress()
    }

    async function handleUpdate(e) {
        e.preventDefault()
          setError("")
          setLoading(true)
          GeoFirestore.collection("hospitalsList").doc(currentUser.uid).set({
            email: currentUser.email,
            name: updateHospitalNameRef.current.value,
            hospitalAddress: selectedAddrress,
            availableBed: updateAvailableBedRef.current.value,
            occupiedBed: updateOccupiedBedRef.current.value,
            totalBeds: updateTotalBedRef.current.value,
            phoneNumber: updatePhoneNumberRef.current.value,
            RejectedRequestCount:0,
            acceptedRequestCount:0,
            newRequestCount:0,
            rejectedPatientList:{},
            newRequest:{},
            patientRecords:{},
            coordinates: new geoRef.GeoPoint(selectedCoordinates.lat,selectedCoordinates.lng)
          }).then(()=>{
            history.push("/hospital-dashboard")
            setLoading(false)
          }).catch((error)=>{
            setError(`Failed to Update. ${error.message}`)
            console.log(error)
            setLoading(false)
          })    
        setLoading(false)
      }

    return (
        <>
                    <Container fluid>
                <Row noGutters>
                    <Col lg={3} className="sidebar">
                    <Container fluid>
                        <Row noGutters>
                            <Col lg={12}>
                                <div className="app-brand">CoBed</div>
                            </Col>
                        </Row>
                        <Row noGutters className="mt-4">
                            <Col lg={12} className ="bg-theme p-4 text-light location-header">
                            <h2>Your location ?</h2>
                            {selectedAddrress && (
                                <>
                                    <span>{selectedAddrress}</span>
                                    <br />
                                    <Button variant="light" className="link-like text-light p-0" onClick={resetLocation}>Change Location</Button>
                                </>
                            )}
                            </Col>
                        </Row>
                        {selectedAddrress && 
                        <Row>
                        <Col lg={12} className ="bg-light p-0 map-form-container">
                        <Form onSubmit={handleUpdate} className="login-form w-90">
                            <Form.Group controlId="updateName">
                                <Form.Label>Hospital Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter Name" ref={updateHospitalNameRef} defaultValue={currentUser.displayName}/>
                            </Form.Group>
                            <Form.Group as={Row} controlId="updatePhoneNumber">
                                <Form.Label column sm="6">Phone Number:</Form.Label>
                                <Col sm="6">
                                <Form.Control type="number" placeholder="Enter Contact Number" ref={updatePhoneNumberRef} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="updateTotalBeds">
                                <Form.Label column sm="6">Total Beds:</Form.Label>
                                <Col sm="6">
                                    <Form.Control type="number" placeholder="1000" ref={updateTotalBedRef} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="updateAvailableBeds">
                                <Form.Label column sm="6">Beds Available:</Form.Label>
                                <Col sm="6">
                                    <Form.Control type="number" placeholder="Enter Number of Available Beds" ref={updateAvailableBedRef} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="updateOccupiedBeds">
                                <Form.Label column sm="6">Beds Occupied:</Form.Label>
                                <Col sm="6">
                                <Form.Control type="number" placeholder="Enter Number of Occupied Beds" ref={updateOccupiedBedRef} />
                                </Col>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="theme-circle-button button-right">
                                {loading ? (
                                    <Spinner animation="border" />
                                ):(<FontAwesomeIcon icon={faArrowRight} />)}
                            </Button>
                        </Form>
                        {error && <div className="error">{error}</div>}
                            </Col>
                        </Row>}
                        {!selectedAddrress && (
                            <Row noGutters>
                            <Col lg={12} className ="bg-light p-4 suggestion-container">
                            
                            <PlacesAutocomplete 
                                value={address} 
                                onChange={setAddress} 
                                onSelect={handleSelect}
                                shouldFetchSuggestions={address.length > 3}
                            >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading })=>(
                                <div>
                                    <input {...getInputProps({placeholder:'Enter your Address',className:"address-input"})} />
                                    {loading &&  (
                                        <Container className="suggestion-item-container">
                                            <Spinner animation="border" variant="primary" />
                                        </Container>
                                    )}
                                    <div>
                                        {suggestions && suggestions.map((suggestion)=>{
                                            return (
                                            <Container {...getSuggestionItemProps(suggestion)} className="suggestion-item-container">
                                                <Row>
                                                    <Col xs={2} className="d-flex align-items-center"> 
                                                        <div className="icon-container">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                        </div>
                                                    </Col>
                                                    <Col className="suggestion-item-desc">
                                                        <h4>{suggestion.formattedSuggestion.mainText}</h4>
                                                        <span>{suggestion.formattedSuggestion.secondaryText}</span>
                                                    </Col>
                                                </Row>
                                               
                                            </Container>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                                </PlacesAutocomplete>
                            </Col>    
                        </Row>
                        )}
                    </Container>
                    </Col>
                    <Col lg={12} className="p-0">
                    {currentLocation && (
                        <div style={{height:"100vh",width:"100%",position:"relative"}}>
                            <GoogleMapReact
                            bootstrapURLKeys={{ 
                                key: "AIzaSyDSHxebGO5U_YjYrpqfH3e8DxcqTPWEMI8"
                             }}
                            defaultZoom={16}
                            defaultCenter={{lat:currentLocation.lat , lng: currentLocation.lng}}
                            center={locationCenter}
                            options={mapOptions}
                            yesIWantToUseGoogleMapApiInternals
                            >
                                {/* current location marker */}
                                <Marker lat={currentLocation.lat} lng={currentLocation.lng}>
                                    <div className="current-location"></div>
                                </Marker>
                                 {/* set address location marker */}
                                 {selectedAddrress && <Marker 
                                 lat={selectedCoordinates.lat} 
                                 lng={selectedCoordinates.lng}
                                 draggable={true}
                                 onDragend={(e) => console.log(e)}
                                 >
                                    <div className="selected-location">
                                    </div>
                                </Marker> }

                    </GoogleMapReact>
            </div>
            )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default UpdateDetails;
