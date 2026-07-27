import React, { useState, useEffect } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useNavigate } from 'react-router-dom';
const ErrorAlert = (props) => {
const nav=props.nav;
const err=props.err;
const showAlert=props.showAlert;
const setShowAlert=props.setShowAlert;
const customConfirmBtnStyle = {
  backgroundColor: 'skyblue',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
const navigate = useNavigate();
 
  

  const handleConfirm = () => {
    setShowAlert(false);
  };

  return (
    <div>
      
      <SweetAlert
        error 
        show={showAlert}
        title="Error"
        //showConfirm={false}
        confirmText="OK"
       confirmStyle={customConfirmBtnStyle}
       closeOnClickOutside={true}
        onConfirm={handleConfirm}
      >
        {err}
      </SweetAlert>
    </div>
  );
};

export default ErrorAlert;