import React from 'react'
import { Link as RouterLink } from "react-router-dom";
import {  Typography, Link } from "@mui/material";
//import SocialAuth from "../components/SocialAuth";
import SignupForm from "../../../components/SignupForm";
import Logo from "../../../components/Logo";
import { motion } from "framer-motion";
import { useState,useEffect } from "react";
import axiosClient from "../../../axios-client";
import {
 CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  
  CRow,
} from '@coreui/react'

//////////////////////////////////
let easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
  initial: {
    y: 40,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const Register = ({ setAuth }) => {
  const [userid,setuserid]=useState(null)
  const [username,setusername]=useState('');
  const [pwchange,setpwchange]=useState(null);
  useEffect(()=>{
    getuser();
  },[])
  const getuser=()=>{
     axiosClient.get('/user').then(({data})=>{
        
       if (data.data){
     //   console.log(data.data)
        setuserid(data.data.id);
        setusername(data.data.username);
        setpwchange(data.data.passIschanged);
       // console.log(username)
        }
     }).catch(()=>{
     })}
  return (
    <div className="bg-light min-vh-100  d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} style={{width:'95%'}}>
            <CCardGroup >
              <CCard className="p-4">
                <CCardBody style={{maxHeight:"630px"}}>
                
        
                <Typography
            
            variant="body2"
            align="center"
            sx={{ mb: 2,color: "text.secondary" }}
          >
          <Logo/>
          </Typography>
                <Typography
                variant="body2"
            align="center"
            sx={{ mb: 2,color: "text.secondary" }}>
           

        تغيير كلمة السر و اسم المستخدم
            </Typography>
          


 {  username === '' ? ('') :(     

          <SignupForm pwchange={pwchange} username={username} userid={userid} />
 )
          }

          
        
      
                
          
            
          
                </CCardBody>
              </CCard>
              
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
