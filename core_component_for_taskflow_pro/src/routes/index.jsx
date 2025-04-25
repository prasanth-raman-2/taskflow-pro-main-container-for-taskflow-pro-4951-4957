import { Routes, Route, Navigate } from 'react-router-dom'
import TaskBoard from '../components/tasks/TaskBoard'
import TaskList from '../components/tasks/TaskList'
import TaskDetails from '../components/tasks/TaskDetails'
import TaskForm from '../components/tasks/TaskForm'

/**
 * PUBLIC_INTERFACE
 * Defines the routes for the application
 * @returns {JSX.Element} The Routes component with all defined routes
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/board" element={<TaskBoard />} />
      <Route path="/list" element={<TaskList />} />
      <Route path="/tasks/:taskId" element={<TaskDetails />} />
      <Route path="/tasks/new" element={<TaskForm />} />
      <Route path="/tasks/:taskId/edit" element={<TaskForm />} />
      <Route path="/" element={<Navigate to="/board" replace />} />
    </Routes>
  )
}

export default AppRoutes
