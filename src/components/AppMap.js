import React, { useEffect, useRef, useState } from 'react'
import GoogleMapReact from "google-map-react";
// import useSupercluster from "use-supercluster";
import '../routes/styles/map.css'
import '../routes/styles/sidebar.css'
import mapStyle from './mapStyle'
import { db, firebasevalue, GeoFirestore, geoRef } from '../firebase';
import healthIcon from '../img/health.svg'
import ProfileContainer from '../components/ProfileContainer';
import { Col, Container, Row, Spinner,Button, Form } from 'react-bootstrap';
import PlacesAutocomplete, { geocodeByAddress, getLatLng} from "react-places-autocomplete";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSadCry} from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { faSmileBeam } from '@fortawesome/free-regular-svg-icons';
import AppSidebar from './AppSidebar';
import { useAuth } from '../context/AuthProvider';







// const Marker = ({children}) => children ;
function Marker({lat,lng,onMarkerClick ,children}) {
    return (
      <div onClick={onMarkerClick} lat={lat} lng={lng}>
       {children}
      </div>
    );
  }
function AppMap() {
    const [currentLocation, setCurrentLocation] = useState()
    const [locationCenter, setLocationCenter] = useState()
    const [hospitalList, setHospitalList] = useState()
    const [address,setAddress] = useState("")
    const [selectedCoordinates, setSelectedCoordinates] =useState()
    const [selectedAddrress, setSelectedAddrress] =useState()
    const [acceptedHospitalDetails,setAcceptedHospitalDetails] =useState()
    const [isSearching,setIsSearching] =useState(false)
    const [allRejected , setAllRejected] =useState(false)

    const [policeSupport , setPoliceSupport] =useState(false)

    const locationInputRef =useRef()
    const aadharRef =useRef()
    const ageRef =useRef()
    const spo2Ref =useRef()
    const covidRef =useRef()
    const rtpcrRef =useRef()
    const patientNameRef =useRef()

    const {currentUser} =useAuth()

    const mapOptions = {
        styles: mapStyle,
        disableDefaultUI:true
    };

    function success(pos) {
        var crd = pos.coords;
        setCurrentLocation({lat:crd.latitude,lng:crd.longitude})
        setLocationCenter({lat:crd.latitude,lng:crd.longitude})
      }
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }

    useEffect(()=>{
        if (navigator.geolocation) {
            var options = {
                enableHighAccuracy: true,
                timeout: 60000 ,
                maximumAge: 100
              };
            var watchID = navigator.geolocation.watchPosition(success, error, options);
            setTimeout( function() { navigator.geolocation.clearWatch( watchID ); }, 5000 );

        } else {
            // Fallback for no geolocation
            
        }
    },[])

    useEffect(()=>{
        db.collection("hospitalsList").onSnapshot((docs)=>{
            if(!docs.empty)
            {
                var hospitalLists = []
                docs.docs.forEach(doc => {
                    hospitalLists.push(doc.data())
                });
                setHospitalList(hospitalLists) 
            }
        })
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

    function findNearestHospital(e)
    {
        e.preventDefault();
        setIsSearching(true)

        const query =  GeoFirestore.collection('hospitalsList').near({
            center:new geoRef.GeoPoint(selectedCoordinates.lat,selectedCoordinates.lng),
            radius:30
        })
        var itemsProcessed = 0;

        query.get().then((value) => {
            var radiusList =[]
            value.docs.forEach((hospital)=>{
                itemsProcessed++;
                radiusList.push({
                    distance:hospital.distance,
                    ...hospital.data(),
                    hospitalId:hospital.id
                });
                if(itemsProcessed === value.docs.length) {
                    GenerateRequest(radiusList)
                  }
            })
          })
    }

    function compare(a,b)
    {
        return a.distance - b.distance;
    }

    async  function GenerateRequest(hospitalList)
    {
        
        var availableHospital = hospitalList.filter(hospital => hospital.availableBed > 0)        
        availableHospital.sort(compare)

        var patientDetails={
            name_of_patient:patientNameRef.current.value,
            aadhar:aadharRef.current.value,
            covid:covidRef.current.state.checked,
            rtpcr:rtpcrRef.current.state.checked,
            age:ageRef.current.value,
            contact:currentUser.phoneNumber,
            spo2:spo2Ref.current.value,
            address:selectedAddrress,
            pid:currentUser.uid
        }

        if(availableHospital.length > 0)
        {
            for(const [i,hospital] of availableHospital.entries())
            {
                const status = await CheckingHospital(patientDetails,hospital)
                if(status)
                    break;

                if(i === availableHospital.length -1)
                {
                    console.log(true)
                    setAllRejected(true)
                }
            }
        }else
        {
            setAllRejected(true)
        }
    }


    function CheckingHospital(patientDetails,hospital)
    {
        return new Promise ((resolve)=>{

            db.collection("hospitalsList").doc(hospital.hospitalId).update({
                newRequestCount:firebasevalue.increment(1),
                ["newRequest."+patientDetails.aadhar] : patientDetails
            })


            var timeout = setTimeout(function(){ 
                console.log("Erasing hospital request - "+hospital.hospitalId)
                db.collection("hospitalsList").doc(hospital.hospitalId).update({
                    newRequestCount:firebasevalue.increment(-1),
                    RejectedRequestCount:firebasevalue.increment(1),
                    ["rejectedPatientList."+patientDetails.aadhar] :patientDetails,
                    ["newRequest."+patientDetails.aadhar] : firebasevalue.delete()
                })
            }, 180000);




            var unsubscribe = db.collection("hospitalsList").doc(hospital.hospitalId).onSnapshot((doc)=>{
            if(doc.exists)
            {
                // check if hospital has accepted the request
                if(patientDetails.aadhar in doc.data().patientRecords)
                {
                    setAcceptedHospitalDetails(hospital)
                    clearTimeout(timeout)
                    setIsSearching(false)

                    resolve(true)
                    return unsubscribe;
                }
                // check if hospital has rejected the request
                else if(patientDetails.aadhar in doc.data().rejectedPatientList)
                {
                    clearTimeout(timeout)
                    resolve(false)
                    return unsubscribe
                }
            }


        })
    })
}

    useEffect(() => {
        var unsubscribe = db.collection("users").doc(currentUser.uid).onSnapshot((doc)=>{
            if(doc.exists)
            {
                if(doc.data().policeSupport)
                {
                    setPoliceSupport(true)
                }else
                {
                    setPoliceSupport(false)
                }
            }
            return unsubscribe
        })
    }, [currentUser.uid])

    return (
            <Container fluid >
                <Row>
                    <Col lg={3} md={4} className="sidebar">
                    <Container fluid>
                        <Row>
                            <Col lg={3} className="bg-light sidebar-menu p-o" >
                            <AppSidebar />
                            </Col>
                            <Col xs={12} lg={9} className="sidebar-form">
                                <Container fluid>
                                <Row noGutters>
                                    <Col lg={12} className="p-0">
                                        <div className="app-brand">ApCoBed</div>
                                    </Col>
                                </Row>
                                {policeSupport && acceptedHospitalDetails && (
                                    <Row noGutters> 
                                        <Col lg={12} className=" bg-green text-light p-4 police-accepted-top">
                                            <div className="police-accepted">
                                                <h6>Police has accepted your request as an emergency and will create a green coridor for you. </h6>

                                            </div>
                                        </Col>
                                        </Row>
                                )}
                                
                                <Row noGutters>
                                    <Col lg={12} className ="bg-theme p-4 text-light location-header">
                                        {!isSearching && !acceptedHospitalDetails &&(
                                            <h2>Your location ?</h2>
                                        )}
                                    
                                    {selectedAddrress && !isSearching && !acceptedHospitalDetails && (
                                        <>
                                            <span>{selectedAddrress}</span>
                                            <br />
                                            <Button variant="light" className="link-like text-light p-0" onClick={resetLocation}>Change Location</Button>
                                        </>
                                    )}

                                    {!isSearching && acceptedHospitalDetails && selectedAddrress && (
                                        <>
                                                <div className="finding-location">
                                                    <h5>Your requested has been accepted by </h5>
                                                </div>
                                                
                                            
                                        </>
                                    )}
                                    </Col>
                                    {acceptedHospitalDetails && (
                                        <Col lg={12} className=" bg-white p-4">
                                            <div className="finding-location down">
                                                <h2>{acceptedHospitalDetails.name}</h2>
                                                <h3>{acceptedHospitalDetails.hospitalAddress}</h3>
                                            </div>
                                        </Col> )}
                                    {policeSupport && acceptedHospitalDetails && (
                                        <Col lg={12} className=" bg-green text-light p-4">
                                            <div className="police-accepted police-accepted-bottom">
                                                <h6>Police has accepted your request as an emergency and will create a green coridor for you. </h6>

                                            </div>
                                        </Col> )}
                                </Row>
                                {selectedAddrress && <Row>
                                    <Col lg={12} className ={isSearching ? ("bg-light p-4 map-form-container d-none"): acceptedHospitalDetails ? ("bg-light p-4 map-form-container d-none"):("bg-light p-4 map-form-container")}>
                                            <Form onSubmit={findNearestHospital}>
                                                <Form.Group as={Row} controlId="adhaarno">
                                                    <Form.Label column sm="4">Name</Form.Label>
                                                    <Col sm="8">
                                                        <Form.Control type="text" placeholder="Enter full name" ref={patientNameRef} required />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} controlId="adhaarno" className="mt-3">
                                                    <Form.Label column sm="4">Adhaar No.</Form.Label>
                                                    <Col sm="8">
                                                        <Form.Control type="text" placeholder="Enter Adhaar No" ref={aadharRef}  required />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} controlId="age" className="mt-3">
                                                    <Form.Label column sm="4">Age</Form.Label>
                                                    <Col sm="8">
                                                        <Form.Control  type="number" placeholder="45" required ref={ageRef}/>
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} controlId="SpO2" className="mt-3">
                                                    <Form.Label column sm="4">SpO2</Form.Label>
                                                    <Col sm="8">
                                                        <Form.Control  type="number" placeholder="98" required ref={spo2Ref} />
                                                    </Col>
                                                </Form.Group>
                                                <div className="m-check">
                                                    <Form.Group as={Row} controlId="covidReport" className="mt-3">
                                                        <Form.Label column sm="4">Covid</Form.Label>
                                                        <Col sm="8">
                                                        <BootstrapSwitchButton
                                                            checked={false}
                                                            onlabel='Positive'
                                                            offlabel='Negative'
                                                            ref={covidRef}
                                                        />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} controlId="rtpcr" className="mt-3">
                                                        <Form.Label column sm="4">RTPCR</Form.Label>
                                                        <Col sm="8">
                                                        <BootstrapSwitchButton
                                                            checked={false}
                                                            onlabel='Positive'
                                                            offlabel='Negative'
                                                            ref={rtpcrRef}
                                                        />
                                                        </Col>
                                                    </Form.Group>
                                                </div>
                                                <Form.Group className="d-flex align-items-center">
                                                    <Button variant="primary" type="submit" className="theme-button-dark bg-dark">
                                                        Book me a bed
                                                    </Button>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                    </Row>}

                                    {isSearching && selectedAddrress && !allRejected &&  (
                                        <Row>
                                            <Col lg={12} className ="bg-light p-4 map-form-container">
                                                <div class="progress">
                                                    <div class="indeterminate"></div>
                                                </div>
                                                <div className="finding-location">
                                                    <span><FontAwesomeIcon icon={faSmileBeam} /></span>
                                                    <h5>Please give us some time to prepare your bed </h5>
                                                </div>
                                            
                                            </Col>
                                        </Row>
                                    )}

                                    {allRejected && (
                                    <Row>
                                        <Col lg={12} className =" p-4 failed text-light">
                                            <div className="">
                                                <span><FontAwesomeIcon icon={faSadCry} /></span>
                                                <h5>This time we failed </h5>
                                            </div>
                                        
                                        </Col>
                                    </Row>
                                )}
                                    
                                    {!selectedAddrress && (
                            <Row noGutters>
                            <Col lg={12} className ={address.length>0 ? ("bg-light p-4 suggestion-container m-full"):("bg-light p-4 suggestion-container")}>
                            
                            <PlacesAutocomplete 
                                value={address} 
                                onChange={setAddress} 
                                onSelect={handleSelect}
                                shouldFetchSuggestions={address.length > 3}
                            >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading })=>(
                                <div>
                                    <input {...getInputProps({placeholder:'Enter your Address',className:"address-input"})} ref={locationInputRef} />
                                    {loading &&  (
                                        <Container className="suggestion-item-container">
                                            <Spinner animation="border" variant="primary" />
                                        </Container>
                                    )}
                                    <div>
                                        {suggestions && suggestions.map((suggestion,key)=>{
                                            return (
                                            <Container {...getSuggestionItemProps(suggestion)} key={key} className="suggestion-item-container">
                                                <Row>
                                                    <Col xs={2}> 
                                                        <div className="icon-container">
                                                            <span><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
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
                                        
                                        {address.length < 5 ? (<div class="nf">
                                            <span><FontAwesomeIcon icon={faSmileBeam} /></span>
                                            <h6>please wite atleast 4 character for me</h6>
                                        </div>):null}
                                    </div>
                                </div>
                            )}
                                </PlacesAutocomplete>
                            </Col>    
                        </Row>
                        )}
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                    </Col>
                    <Col lg={12} className="p-0">
                    {currentLocation && (
                        <div className ="google-map-container" >
                            <ProfileContainer/>
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

                                {/* hospital location marker */}
                                {hospitalList && hospitalList.map((hospital,key)=>{
                                    return<Marker 
                                        key={key} 
                                        lat={hospital.coordinates.latitude} 
                                        lng={hospital.coordinates.longitude}
                                        onMarkerClick={() => console.log(hospital)}
                                        >
                                    <div className="marker-location"> 
                                        <img src={healthIcon} alt="health-icon" className="marker-icon" />
                                    </div>
                                </Marker>
                                })}

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
            
    )
}

export default AppMap
