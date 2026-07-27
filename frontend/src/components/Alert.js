import React, { useState, useEffect } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useNavigate } from 'react-router-dom';
const SuccessAlert = (props) => {
const nav=props.nav;
const showAlert=props.showAlert;
const setShowAlert=props.setShowAlert;
const navigate = useNavigate();
  const handleShowAlert = () => {
    setShowAlert(true);
  };

  useEffect(() => {
    let timeout;
    if (showAlert) {
      timeout = setTimeout(() => {
        setShowAlert(false);
        if(nav!==""){
          navigate(nav, { replace: true })
        }
        
      }, 2000); // Auto close after 2 seconds
    }
    return () => clearTimeout(timeout);
  }, [showAlert]);

  const handleConfirm = () => {
    setShowAlert(false);
  };

  return (
    <div>
      
      <SweetAlert
        success
        show={showAlert}
        title="Success"
        showConfirm={false}
        showConfirmButton={false}
       // onConfirm={handleConfirm}
      >
        Your operation was successful
      </SweetAlert>
    </div>
  );
};

export default SuccessAlert;