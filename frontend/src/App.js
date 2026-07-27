import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes,Navigate } from 'react-router-dom';
import { useState,useEffect } from "react";
import './scss/style.scss';
import axiosClient from './axios-client';

import { useStateContext } from "./contexts/ContextProvider";
{/*
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)*/}

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/profile/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const CostumerInterface = React.lazy(() => import('./views/pages/Customers/CustomerInterface'))
function App() {
  
  const {token}=useStateContext();
  //token ? (true):(false)
  const [username,setusername]=useState('');
  const [Role,setRole]=useState('');
  const [userid,setuserid]=useState(null);
  const [pwchange,setpwchange]=useState(1);
  const [Nav,setNav]=useState(null);
  const [auth, setAuth] = useState(token ? (true):(false))
  
   
   
   
 const getsujet=()=>{
    axiosClient.get('/user').then(({data})=>{  
   
     if (data.data){
      
      setusername(data.data.username);
      setRole(data.data.role);
      setuserid(data.data.id);
      setpwchange(data.data.passIschanged)
      setNav(data.data.items)
      
      }
   }).catch(()=>{
    setAuth(false);
    localStorage.removeItem('ACESS_TOKEN')
  })
  }
  if(auth && username==="" && Nav===null)getsujet();
    return (
      <div>
    
      <HashRouter>
        <Suspense >
          <Routes>
            <Route exact path="/login"  element={auth ? (
              <Navigate to="/"  replace />
            ):(<Login setAuth={setAuth} setRole={setRole} setpwchange={setpwchange} setusername={setusername} setuserid={setuserid} setNav={setNav}/>)} />
            <Route exact path="/register" name="Register Page" element={auth ? (
              <Navigate to="/"  replace />
            ):(<Register setAuth={setAuth}/>)} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
           
            <Route
          path="*"
          name="Home"
          element={
            auth ? (
              
              pwchange!=="0" ? (
                Nav!==null ? (
                  Role=='Costumer'? (
                    <CostumerInterface setAuth={setAuth}/>
                  ):(
              <DefaultLayout setAuth={setAuth} username={username} Nav={Nav} userid={userid}/>
              )):(''))
            :(<Register />)
          ) : (
              <Navigate to="/login"  replace />
            )
          }
        />
         </Routes>
        </Suspense>
      </HashRouter>
      
      </div>
    )
  }

export default App
