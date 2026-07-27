import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {

  cilLockLocked,
  cilSettings,

  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axiosClient from "../../axios-client";
import userimg from '../../assets/images/users/logo.jpg'
import { useStateContext } from "../../contexts/ContextProvider";

const AppHeaderDropdown = ({ setAuth }) => {
  const {user,token,setUser,setToken}=useStateContext();
  
  const onLogout =(ev)=>{
    ev.preventDefault();
    axiosClient.post('/logout').then((res)=>{
       //console.log(res);
       if(res.data.message==="LOGOUT"){

        setUser({});
        setToken(null);
        setAuth(false);
        localStorage.removeItem('ACESS_TOKEN')
       }
        //window.location.reload(true);

    })
    //setAuth(false);
    //setUser({});
    //setToken(null);
  }
  const navigate = useNavigate();
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={userimg} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem style={{display:'flex',justifyContent:'right'}}>
        <button style={{border:"0", backgroundColor:"transparent"}} onClick={() => {
      
      navigate("/profile", { replace: true })
      }}>
          
          Profile
          <CIcon icon={cilUser} className="mx-2" />
          </button>
        </CDropdownItem>
       {/* <CDropdownItem style={{display:'flex',justifyContent:'right'}}>
        <button style={{border:"0", backgroundColor:"transparent"}} onClick={() => {
      
      navigate("/", { replace: true })
      }}>
          
          الإعدادات
          <CIcon icon={cilSettings} className="mx-2" />
          </button>
        </CDropdownItem>*/}
        
        
        <CDropdownDivider />
        <CDropdownItem  style={{display:'flex',justifyContent:'right'}}>
        <button style={{border:"0", backgroundColor:"transparent"}} onClick={onLogout}>
          Deconnecter
          <CIcon icon={cilLockLocked} className="mx-2" />
          </button>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown;
