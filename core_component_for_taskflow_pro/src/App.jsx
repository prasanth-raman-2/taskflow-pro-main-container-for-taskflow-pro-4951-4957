import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { TaskProvider } from './contexts/TaskContext'
import AppLayout from './components/layout/AppLayout'
import AppRoutes from './routes'

/**
 * Main App component that wraps the entire application with the necessary providers
 * @returns {JSX.Element} The root component of the application
 */
function App() {
  return (
    <TaskProvider>
      <Router>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </Router>
    </TaskProvider>
  )
}

export default App
