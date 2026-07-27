import * as React from 'react';
import "../../scss/logo.css";
import logo from "../../assets/images/users/logo.jpg";
import {
  
    CContainer
  } from '@coreui/react'
  import {
    Button,
   
  } from "react-bootstrap";
  import { FaPlus } from "react-icons/fa";
  import { useNavigate } from 'react-router-dom'
export default function Dashboard() {
  const navigate = useNavigate();
    
  return (
    <div >
   
    
      <CContainer  style={{display:'flex',justifyContent:'center'}}>
       
        <img  className='dashboardlogo'    src={logo}  alt="logo" />
       
      </CContainer>
    </div>
  );
}