import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'


import  logo from '../assets/images/logodash.png'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
const AppSidebar = (props) => {
 
  const Nav=props.Nav;
 
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/" style={{ backgroundImage:`url(${logo})` ,backgroundRepeat:'no-repeat',  backgroundSize:'100%', backgroundColor:'skyblue'}}>
       </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar style={{ direction:"rtl"}}>
        <AppSidebarNav  Nav={Nav} />
      
        </SimpleBar>
      </CSidebarNav>
      
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
