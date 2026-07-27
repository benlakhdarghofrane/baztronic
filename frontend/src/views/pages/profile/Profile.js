import axiosClient from '../../../axios-client';
import React, { useState,useEffect } from "react";
import Logo from "../../../components/Logo";
import {  Typography, Link } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {CFormSelect,CSpinner, CButton,CModalFooter,CModalHeader,CModalBody,CModalTitle,CModal } from '@coreui/react';
import SignupForm from "../../../components/SignupForm";
import {
  CForm,CFormInput,
  CCard,
   CCardBody,
   CCardGroup,
   CCol,
   CContainer,
   
   CRow,
 } from '@coreui/react'
    
      
        const Profile = () => {
            const [user,setuser]=useState(null);
            const [loading,setLoading]=useState(false);
            const [affiche,setaffiche]=useState(false);
            const [modifier,setmodifier]=useState(true);
         //   console.log(user)
            useEffect(()=>{
                getuser();
              },[])
              async function getuser(){
                setLoading(true);
                try{
                 let res= await axiosClient.get('/user')
                 .then((res)=>res)
                     if (res.data.data){
                        setuser(res.data.data);
                       // console.log(res.data.data)
                        setLoading(false);
                     }
                    }
      
                    catch (err){setLoading(false);}
                  
                   }
      
          return (
        <div> 
        
        {user!==null ? (
          <div>
          <CModal visible={affiche} onClose={() => setaffiche(false)}>
          <CModalHeader>
       </CModalHeader>
        <CModalBody >
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
        <SignupForm pwchange={user.passIschanged} username={user.username} userid={user.id} />
       </CCardBody>
       </CCard>
       </CCardGroup>
       </CCol>
       </CRow>
       </CContainer>
        </CModalBody>
       
      </CModal>
         <CForm className="row g-3" style={{display:'flex',justifyContent:'center', direction:'rtl'}}
           >
         
            <CCol md={6} >
              <CFormInput
                type="text"
                id="01"
                label="اسم المستخدم"
                disabled={modifier}
                defaultValue={user.username}
              />
            </CCol>
            
            <CCol md={6}>
              <CFormInput
                type="text"
                id="02"
                
                label="البريد الالكتروني"
                disabled={modifier}
                defaultValue={user.email}
                
              />
            </CCol>
            {user.admin? (<CCol md={6} >
              <CFormInput
                type="text"
                id="03"
                
                label=""
                disabled={modifier}
                defaultValue="الديوان الوطني للخدمات الجامعية"
                
              />
            </CCol>):(<CCol md={6} >
              <CFormInput
                type="text"
                id="03"
                
                label="المديرية"
                disabled={modifier}
                defaultValue={user.douAR}
                
              />
            </CCol>)}
            
            </CForm>
            <div className='mt-4' style={{display:'flex',justifyContent:'center'}}>
            <CButton color="success"  onClick={() => 
                setaffiche(true)}>
                تغيير كلمة المرور
                </CButton>
                </div>
            
            
            
           
          </div>
          ):('')}
          </div>
        
    )}
    export default Profile; 