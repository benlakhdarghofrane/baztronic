import React from 'react'
import { Link as RouterLink } from "react-router-dom";
import {  Typography, Link } from "@mui/material";

import {
  
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  
  CRow,
} from '@coreui/react'
import LoginForm from "../../../components/LoginForm";
//import SocialAuth from "../components/SocialAuth";
import Logo from "../../../components/Logo";
import { Box } from '@mui/system';
//////////////////////////////////
const Login = (props) => {
const  setpwchange=props.setpwchange;
 const setusername=props.setusername;
 const setRole=props.setRole;
 const setuserid=props.setuserid;
 
 const setNav=props.setNav;
  const setAuth =props.setAuth;
  return (
    <div id="login" className="bg-light min-vh-100 d-flex flex-row align-items-center">
     
          <LoginForm setAuth={setAuth} setRole={setRole} setpwchange={setpwchange} setuserid={setuserid} setusername={setusername} setNav={setNav}/>

    </div>
  )
}

export default Login
