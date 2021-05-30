import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { AuthProvider } from './context/AuthProvider';
import Leads from './routes/Leads';
import VolunteeringServices from './routes/VolunteeringServices';
import PrivateRoute from './components/PrivateRoute'
import Login from './routes/Login'
import HomePage from './routes/HomePage'
import DoctorConsultation from './routes/DoctorConsultation';
import EditProfile from './routes/EditProfile';
import UpdateDetails from './routes/UpdateDetails';
import HospitalLogin from './routes/HospitalLogin';
import HospitalRegister from './routes/HospitalRegister';
import HospitalDashboard from './routes/HospitalDashboard';
import PoliceDashboard from './routes/PoliceDashboard';
import Fundraiser from './routes/Fundraiser';
import FundraiserLandingPage from './routes/FundraiserLandingPage';
import PatientRecords from './routes/PatientRecords';
import PoliceRecords from './routes/PoliceRecords';
import HospitalSettings from './routes/HospitalSettings';
import DashboardSettings from './routes/PoliceDashboardSettings';
import PoliceRegister from './routes/PoliceRegister';
import PoliceLogin from './routes/PoliceLogin';
import PolicePrivateRoute from './components/PolicePrivateRoute';
import HospitalPrivateRoute from './components/HospitalPrivateRoute';
import ActiveRecords from './routes/ActiveCases';
import NotFound from './components/NotFound'
function App() {
  return (
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/hospital-login" component={HospitalLogin} />
            <Route exact path="/hospital-register" component={HospitalRegister} />
            <Route exact path="/police-register" component={PoliceRegister} />
            <Route exact path="/police-login" component={PoliceLogin} />
            <Route exact path="/fundraiser/:id" component={FundraiserLandingPage}/>
            <Route exact path="/" component={Login} />
            <PrivateRoute exact path="/dashboard" component={HomePage} />
            <PrivateRoute exact path="/leads" component={Leads} />
            <PrivateRoute exact path="/help" component={VolunteeringServices} />
            <PrivateRoute exact path="/profile" component={EditProfile} />
            <PrivateRoute exact path="/fundraiser" component={Fundraiser} />
            <PrivateRoute exact path="/question" component={DoctorConsultation} />
            <HospitalPrivateRoute exact path="/hospital-profile" component={UpdateDetails} />
            <HospitalPrivateRoute exact path="/hospital-dashboard" component={HospitalDashboard} />
            <HospitalPrivateRoute exact path="/PatientRecords" component={PatientRecords} />
            <HospitalPrivateRoute exact path="/HospitalSettings" component={HospitalSettings}/>
            <PolicePrivateRoute exact path="/active-records" component={ActiveRecords}/>
            <PolicePrivateRoute exact path="/police-dashboard-settings" component={DashboardSettings} />
            <PolicePrivateRoute exact path="/police-dashboard" component={PoliceDashboard} />
            <PolicePrivateRoute exact path="/police-records" component={PoliceRecords} />
            <Route path='*' exact={true} component={NotFound} />

          </Switch>
        </AuthProvider>
      </Router>
    
  );
}

export default App;