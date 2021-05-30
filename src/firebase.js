import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import "firebase/auth"
import * as geofirestore from 'geofirestore';

const app = firebase.initializeApp({
  apiKey: "AIzaSyDDEahev_KUcn6lyh59o8o5ysqtcobkI3g",
  authDomain: "hackon-covidsol.firebaseapp.com",
  projectId: "hackon-covidsol",
  storageBucket: "hackon-covidsol.appspot.com",
  messagingSenderId: "775421897807",
  appId: "1:775421897807:web:dafc3dce7b22a6e0988e3a",
  measurementId: "G-8EK77MB0DG"
})

export const auth = app.auth()
export const db = firebase.firestore();
export var provider = new firebase.auth.GoogleAuthProvider();
export const firebasevalue = firebase.firestore.FieldValue;
export const storageRef = firebase.storage().ref();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp()
export const GeoFirestore = geofirestore.initializeApp(db);
export const geoRef = firebase.firestore
export default app