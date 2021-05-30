import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"

export default function PolicePrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth()

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/police-login" />
      }}
    ></Route>
  )
}