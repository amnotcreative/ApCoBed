<div align="center">
  
  # ApCoBed
  
### ApCoBed is your one way solution to every problem related to COVID-19
  
</div>
  
- Locates you in real-time
  * Is it possible for an individual to know all the covid hospitals located in his/her area or in an unknown area and also keep a track of the availability of beds? 
  > Our App can!

- Finds and books bed in hospital
  * Is it possible for someone in a severe emergency situation to rush from one hospital to another, to save the life of nearest ones? 
  > One tap on our app and you will be able to book a bed in your nearest hospital.

- Can Request police to make green corridor in case of emergency
  * What if your nearest ones are in such a critical condition and every second matters but traffic becomes your enemy? 
  > In our app, once a case is regarded as an emergency by the hospital, the police will be requested to make a green corridor from the patient’s location to the hospital that had sent the request.
 
- Help with hefty costs 
  * What if everyone from around the country could help you with paying your medical bills? 
  > Our app can help you in fundraising. People can safely donate/help you. You can withdraw the money at any time you want!

- A friend in need is a friend in deed!
  * What if in your state of isolation there is atleast somebody to help you, maybe with your food?
  > You can avail this service through our app or even provide this voluntary service.

- Relish the reliefs!
  * Where would you search for covid relief supplies when you see your dear one suffering? Would you concentrate on what your patient needs or what the hospital requires? 
  > We are here to help you! You can search for and contact ambulance, oxygen and Plasma leads on your very own ApcoBed!

- Crazy Consultations
  * Do google tell you that headache of yours is due to lung cancer? Well our app won’t, cause actual doctors will be viewing your questions and answering them. 
  > Our consultation page will be always live for you!

<div align="center">
  
### Aap ke liye bed hazeer hya! 

----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
## End-Points for User

| Endpoints | Description |
|:-:|:-:|
| [/](https://apcobed.co/) | User Login or Register |
| [/profile](https://apcobed.co/profile) | Edit your Profile |
| [/dashboard](https://apcobed.co/dashboard)  | User Dashboard |
| [/leads](https://apcobed.co/leads) | Covid Emergency Supplies |
| [/help](https://apcobed.co/help) | Volunteering Service Provider | 
| [/fundraiser](https://apcobed.co/fundraiser) | Create or View Fundraisers |
| [/fundraiser/:id](https://apcobed.co/fundraiser/:id) | View or Donate to a Fundraiser |
| [/question](https://apcobed.co/question) | Ask a Doctor |
  
</center>

----------------------------------------------------------------------------------------------------------------------------------------------------------------------

## End-Points for Hospital

| Endpoints | Description |
|:-:|:-:|
| [/hospital-login](https://apcobed.co/hospital-login) | Hospital Login |
| [/hospital-register](https://apcobed.co/hospital-register) | Hospital Register |
| [/hospital-profile](https://apcobed.co/hospital-profile) | Hospital Profile |
| [/hospital-dashboard](https://apcobed.co/hospital-dashboard) | Hospital Dashboard |
| [/PatientRecords](https://apcobed.co/PatientRecords) | Hospital Patient Records |
| [/HospitalSettings](https://apcobed.co/HospitalSettings) | Hospital Settings |

----------------------------------------------------------------------------------------------------------------------------------------------------------------------

## End-Points for Police

| Endpoints | Description |
|:-:|:-:|
| [/police-login](https://apcobed.co/police-login) | Police Login |
| [/police-register](https://apcobed.co/police-register) | Police Register |
| [/police-dashboard](https://apcobed.co/police-dashboard) | Police Dashboard |
| [/police-records](https://apcobed.co/police-records) | Police Records |
| [/active-records](https://apcobed.co/active-records) | List of Ongoing Police Supported Cases|
| [/police-dashboard-settings](https://apcobed.co/police-dashboard-settings) | Police Dashboard Settings |

----------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Tech Stack

```
 ReactJS
 Firebase
 Google Map
 Google Places
 Sawo Labs
 ReactBootstrap
 ReactFontAwesome
 Google Pay
```

----------------------------------------------------------------------------------------------------------------------------------------------------------------------

## How to run the project?

</div>

1. Clone the Repo
   
   `git clone https://github.com/aritrakrbasu/apcobed`
   
2. Install Dependencies

   `npm install`

3. Create an account at [Sawo LABS](https://sawolabs.com/)

4. Create new project inside Developer Console

5. Enter the Host Name and enter `localhost` for Development Server

6. Copy generated API Key, replace `API Key inside useEffect Hook` in `src/routes/login.js`

6. Run the local server

   `npm start`

----------------------------------------------------------------------------------------------------------------------------------------------------------------------
