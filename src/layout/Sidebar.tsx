import React, { useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/imgs/wideLogo.png'

export interface SidebarProps {
  backgroundColor: string
  routes: Array<{
    path: string
    layout: string
    name: string
    icon: string
    component: React.ComponentType<any>
    pro?: boolean
    redirect?: boolean
  }>
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const sidebar = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Verifies if routeName is the active one (in browser input)
  const activeRoute = (routeName: string) => {
    return location.pathname.indexOf(routeName) > -1 ? 'bg-blue-500 text-white' : 'text-gray-700'
  }

  useEffect(() => {
    // Code for managing scroll, if needed, can be added here.
    return () => {
      // Cleanup scroll functionality if implemented.
    }
  }, [])

  return (
    <div className={`sidebar bg-${props.backgroundColor} h-full min-h-screen p-4`}>
      <div className='sidebar-wrapper' ref={sidebar}>
        <ul className='nav space-y-4'>
          {props.routes.map((prop, key) => {
            if (prop.redirect) return null
            return (
              <li className={activeRoute(prop.layout + prop.path) + (prop.pro ? ' active active-pro' : '')} key={key}>
                <NavLink
                  to={prop.layout + prop.path}
                  className={`nav-link flex items-center p-2 rounded-lg hover:bg-blue-400 hover:text-white ${activeRoute(
                    prop.layout + prop.path
                  )}`}
                >
                  <i className={`now-ui-icons ${prop.icon} mr-3`} />
                  <p className='font-medium'>{prop.name}</p>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
