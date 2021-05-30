import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "../firebase"



const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password, name) {
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password).then(function(result) {
        const user = auth.currentUser;
        user.updateProfile({
          displayName: name
        }).then((result)=> {
          db.collection("users").doc(user.uid).set({
            displayName:name,
            uid:user.uid,
            email:email
          }).then(()=>{
            resolve()
          })
          .catch(error => reject("error creating profile"));
        })
        .catch(error => reject(error));
      })
      .catch(error => reject(error));
    })
  }



  function createUser(payload)
  {
    db.collection("users").doc(payload.user_id).onSnapshot((doc)=>{

      if(!doc.exists)
      {
        db.collection("users").doc(payload.user_id).set({
          displayName:"",
          uid:payload.user_id,
          phoneNumber:payload.identifier
          })
      }else
      {
          setCurrentUser(doc.data())
      }
    })
  }









  function registerHospital(email, password, Hname,Haddress,Hpincode) {
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password).then(function(result) {
        const user = auth.currentUser;
        user.updateProfile({
          displayName: Hname
        }).then((result)=>{
          db.collection("users").doc(user.uid).set({
            displayName:Hname,
            uid:user.uid,
            email:email,
            isHospital:true,
          }).then(()=>{
            resolve()
          })
          .catch(error => reject("error creating profile"));
        })
        .catch(error => reject(error));
      })
      .catch(error => reject(error));
    })
  } 

  function login(email, password) {
    return new Promise((resolve, reject) => {
      db.collection("users").where("email","==",email).onSnapshot((docs)=>{
        if(!docs.empty)
        {
          docs.forEach(doc=>{
            if(doc.exists)
          {
              if(doc.data().isHospital === undefined && doc.data().isPolice === undefined) 
              {
                auth.signInWithEmailAndPassword(email, password).then(() => {
                  resolve()
                })
                .catch(error => reject(error));
              }
              else
              {
                reject({message:"Not registered as an user"})
              }
          }
          else
          {
            reject({message:"no such account exists"})
          }
          })
        }
        else
        {
          reject({message:"no such account exists"})
        }
      })
    })
  }

  function hospitalLogin(email, password) {
    return new Promise((resolve, reject) => {
      db.collection("users").where("email","==",email).get().then((docs)=>{
        if(docs.empty)
        {
          reject({message:"no such account exists"})
        }
        else
        {
          docs.forEach(doc=>{
            if(doc.exists)
            {
                if(doc.data().isHospital)
                {
                  auth.signInWithEmailAndPassword(email, password).then(() => {
                    resolve()
                  })
                  .catch(error => reject(error));
                }
                else
                {
                  reject({message:"Not a hospital"})
                }
            }
            else
            {
              reject({message:"no such account exists"})
            }
          })
        }
      })
    })
  }

  function registerPolice(email, password, Pname) {
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password).then(function(result) {
        const user = auth.currentUser;
        user.updateProfile({
          displayName: Pname
        }).then((result)=>{
          db.collection("users").doc(user.uid).set({
            displayName:Pname,
            uid:user.uid,
            email:email,
            isPolice:true,
          }).then(()=>{

            db.collection("policeList").doc("policeList").set({
              newRequest:{},
              acceptedRequests:{},
              rejectedRequests:{},
              activeRecords:{},
              acceptedRequestCount:0,
              RejectedRequestCount:0,
              newRequestCount:0
            }).then(()=> resolve())
            .catch(error => reject("error creating profile"));
          })
          .catch(error => reject("error creating profile"));
        })
        .catch(error => reject(error));
      })
      .catch(error => reject(error));
    })
  }

  function policeLogin(email, password) {
    return new Promise((resolve, reject) => {
      db.collection("users").where("email","==",email).get().then((docs)=>{
        docs.forEach(doc=>{
          if(doc.exists)
        {
            if(doc.data().isPolice)
            {
              auth.signInWithEmailAndPassword(email, password).then(() => {
                resolve()
              })
              .catch(error => reject(error));
            }
            else
            {
              reject({message:"Not Police Station"})
            }
        }
        else
        {
          reject({message:"No such Police Stations Exist"})
        }
        })
      })
    })
  }

  function logout() {
    sessionStorage.clear();  
        setCurrentUser()
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user && user.uid)
      {
        db.collection("users").doc(user.uid).get().then((docs)=>{
          if(!docs.empty)
            {
              setCurrentUser(docs.data())
              setLoading(false)
            }
          })
      }else
        setLoading(false)
      
    })

    return unsubscribe
  }, [])



  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    registerHospital,
    hospitalLogin,
    registerPolice,
    policeLogin,
    createUser
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}