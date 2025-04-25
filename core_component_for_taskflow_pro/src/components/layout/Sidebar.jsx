import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'

const SidebarContainer = styled.nav`
  width: 220px;
  background-color: #f5f7fa;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    position: absolute;
    height: calc(100vh - 60px);
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    z-index: 100;
  }
`

const NavSection = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #7a869a;
    margin-bottom: 0.5rem;
    padding: 0 0.5rem;
  }
`

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const NavItem = styled.li`
  margin-bottom: 0.25rem;
`

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: #4a5568;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  
  svg {
    margin-right: 10px;
  }
  
  &:hover {
    background-color: rgba(44, 62, 80, 0.1);
  }
  
  &.active {
    background-color: rgba(44, 62, 80, 0.15);
    color: #2c3e50;
    font-weight: 500;
  }
`

const CreateButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: background-color 0.2s;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #2980b9;
  }
`

const MobileToggle = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
  }
`

/**
 * Sidebar component for navigation
 * @returns {JSX.Element} The sidebar with navigation links
 */
function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <CreateButton>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Task
        </CreateButton>
        
        <NavSection>
          <h3>Tasks</h3>
          <NavList>
            <NavItem>
              <StyledNavLink to="/board">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Board View
              </StyledNavLink>
            </NavItem>
            <NavItem>
              <StyledNavLink to="/list">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                List View
              </StyledNavLink>
            </NavItem>
          </NavList>
        </NavSection>
        
        <NavSection>
          <h3>Categories</h3>
          <NavList>
            <NavItem>
              <StyledNavLink to="/list?status=todo">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                To Do
              </StyledNavLink>
            </NavItem>
            <NavItem>
              <StyledNavLink to="/list?status=in-progress">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L5 12 12 22 19 12z"></path>
                </svg>
                In Progress
              </StyledNavLink>
            </NavItem>
            <NavItem>
              <StyledNavLink to="/list?status=completed">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Completed
              </StyledNavLink>
            </NavItem>
          </NavList>
        </NavSection>
      </SidebarContainer>
      
      <MobileToggle onClick={toggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </MobileToggle>
    </>
  )
}

export default Sidebar
