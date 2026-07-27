import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useState } from 'react';
import { CModalBody,CModal,CModalFooter,CButton,CModalHeader } from '@coreui/react';
import {CNavGroup, CNavItem } from '@coreui/react'
import { CSpinner } from '@coreui/react';
import Loading from "../components/Loading";
import {
  cilCog,
  cilDescription,
  cilEnvelopeClosed,
  cilHome,cilGroup,cilMoney,
  cilCart,cilChartLine
  
} from '@coreui/icons'
import AlertErr from '../components/AlertErr'
//import axiosClient from '../axios-client';
//import { log10 } from 'core-js/core/number';
const DefaultLayout = (props) => {
  const Nav1=props.Nav;
 
  const setAuth=props.setAuth;
  const username=props.username;
  const userid=props.userid;
  const [visible,setVisible]=useState(true);
  const [showerr,setshowerr]=useState(false);
  const [Err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  function transformData(originalData) {
   
    const transformedItems = originalData.map(item => {
     // console.log(item)
     
     let subitems = [];
     let Icon=null;
     if (item.nameEN==='dashboard'){
      Icon=cilChartLine
     }
     
     else if(item.nameEN==='Users' || item.nameEN==='Clients' || item.nameEN==='Suppliers' ) {
      Icon=cilGroup
     }
     else if(item.nameEN==='products' || item.nameEN==='Deposits' || item.nameEN==='Receipt order' || item.nameEN==='Sales Order' ) {
      Icon=cilCart
     }
     else if(item.nameEN==='Debts') {
      Icon=cilMoney
     }
     else{
      Icon=cilDescription
     }
     
     if(item.nameEN!=="dashboard")
     {
     if (item.create === "1" ) {
       subitems.push({
         nameAR: 'إضافة',
         nameFR: 'Ajouter',
         nameEN: 'Add',
         component: CNavItem,
         to: `${item.nameEN}/Add`,
       });
     }
 
     subitems.push({
       nameAR: 'قائمة',
       nameFR: 'Liste',
       nameEN: 'Liste',
       component: CNavItem,
       to: `${item.nameEN}/Liste`,
     });
     return { ...item,component:CNavItem,icon:Icon,to:`${item.nameEN}`};
    } 
    else{
      return { ...item,component:CNavItem,icon:Icon,to:'dashboard'};
      
    }
      
    });
  
    return {  nav: transformedItems  };

  }
  const data = transformData(Nav1);
  return (
    <div >
    {username===""  ? (
      <div>
      
      <CModal visible={visible} onClose={() => setVisible(false)}>
      
      <CModalBody style={{direction:'rtl'}}>
        
        <div className='row' style={{display:'flex',justifyContent:'center'}}>
       <div style={{textAlign:'center'}}>  Please wait!</div>
        <CSpinner color="success"/>
        </div>
      </CModalBody>
      
    </CModal>

     
      </div>):(
      <div>
      {loading && <Loading/>}
      <AppSidebar  Nav={data.nav}/>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader setAuth={setAuth} username={username}/>
        <div className="body flex-grow-1 px-3">
          <AppContent  Nav={data.nav} setErr={setErr} setshowerr={setshowerr}  userid={userid} setLoading={setLoading}/>
          <AlertErr setShowAlert={setshowerr} showAlert={showerr} err={Err}/>
          {/*
          <CModal visible={showerr} onClose={() => setshowerr(false)}>
  
      <CModalHeader closeButton/>
      <CModalBody style={{direction:'rtl'}}>
        
        <div className='row' style={{display:'flex',justifyContent:'center'}}>
       <div style={{textAlign:'center'}}>{Err}</div>
       
        </div>
      </CModalBody>
   <CModalFooter style={{direction:'rtl', display:'flex',justifyContent: 'center'}}>
        
        <CButton color="success"  onClick={() => 
              setshowerr(false)}>ok</CButton>
      </CModalFooter>
      
      </CModal>
    */} 
        </div>
        <AppFooter />
      </div>
      </div>
      )}
    </div>
  )
}

export default DefaultLayout
