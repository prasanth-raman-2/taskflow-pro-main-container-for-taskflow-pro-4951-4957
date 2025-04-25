import { useContext } from 'react'
import { TaskContext } from '../contexts/TaskContext'

/**
 * PUBLIC_INTERFACE
 * Custom hook for accessing task-related functionality
 * @returns {Object} Task-related operations and state
 */
export function useTasks() {
  const context = useContext(TaskContext)
  
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  
  return context
}
