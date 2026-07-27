import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeClosed, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import  AppHeaderDropdown  from './header/AppHeaderDropdown'
import { useNavigate } from 'react-router-dom'
const AppHeader = (props ) => {
   const setAuth =props.setAuth;
   const username=props.username;
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const navigate = useNavigate();
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon color='gray' icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className=" d-md-flex me-auto">
         
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <CNavLink >
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
          
            <CNavLink >
            <button style={{border:"0", backgroundColor:"transparent"}} onClick={() => {
      
      navigate("/message", { replace: true })
      }}>
        
         
              <CIcon icon={cilEnvelopeClosed} size="lg" to="/message" />
              </button>
            </CNavLink>
            
          </CNavItem>
          
          <CNavItem>
            <CNavLink>
              {username}
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown setAuth={setAuth}/>
        </CHeaderNav>
      </CContainer>
      
    </CHeader>
  )
}

export default AppHeader
