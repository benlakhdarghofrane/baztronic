import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
//import PropTypes from 'prop-types'
import { CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'


export const AppSidebarNav = (props) => {
  const items=props.Nav;
  const location = useLocation()
  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { component, nameEN, badge, icon,nameAR,nameFR, ...rest } = item
    const Component = component
    return (
      <Component
      style={{direction:'ltr'}}
        {...(rest.to &&
          !rest.subitems && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(nameEN, <CIcon icon={icon} customClassName="nav-icon"/>)}
      </Component>
    )
  }
  const navGroup = (item, index) => {
    const { component,icon, nameEN,nameAR,nameFR, ...rest } = item
    const Component = component
    return (
      <Component
      style={{direction:'ltr'}}
        idx={String(index)}
        key={index}
        toggler={navLink(nameEN, <CIcon icon={icon} customClassName="nav-icon" />
        )}
       // visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.subitems?.map((item, index) =>
          item.subitems ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <React.Fragment>
    
      {items &&
        items.map((item, index) => (item.subitems ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

//AppSidebarNav.propTypes = {
//  items: PropTypes.arrayOf(PropTypes.any).isRequired,
//}