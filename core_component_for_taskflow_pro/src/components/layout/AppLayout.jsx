import styled from '@emotion/styled'
import Header from './Header'
import Sidebar from './Sidebar'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const MainContent = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow: auto;
`

/**
 * AppLayout component that provides the layout structure for the application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in the content area
 * @returns {JSX.Element} The layout component with header, sidebar, and content area
 */
function AppLayout({ children }) {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <Sidebar />
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutContainer>
  )
}

export default AppLayout
