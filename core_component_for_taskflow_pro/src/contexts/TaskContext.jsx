import { createContext, useEffect, useState } from 'react'
import * as taskStorage from '../utils/taskStorage'

/**
 * Context for task management
 * @type {React.Context}
 */
export const TaskContext = createContext(null)

/**
 * PUBLIC_INTERFACE
 * Provider component for TaskContext
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context provider
 */
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [sortConfig, setSortConfig] = useState({ by: 'createdAt', direction: 'desc' })
  
  // Load tasks from storage on component mount
  useEffect(() => {
    // Initialize storage with sample data if needed
    taskStorage.initializeWithSampleTasks()
    
    // Load all tasks
    const loadTasks = () => {
      setIsLoading(true)
      try {
        const loadedTasks = taskStorage.getAllTasks()
        setTasks(loadedTasks)
      } catch (error) {
        console.error('Failed to load tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTasks()
  }, [])
  
  // Get filtered and sorted tasks
  const getFilteredTasks = () => {
    const filteredTasks = taskStorage.filterTasks(filters)
    return taskStorage.sortTasks(filteredTasks, sortConfig.by, sortConfig.direction)
  }
  
  // Add a new task
  const addTask = (taskData) => {
    const newTask = taskStorage.addTask(taskData)
    setTasks([...tasks, newTask])
    return newTask
  }
  
  // Update an existing task
  const updateTask = (taskId, updates) => {
    const updatedTask = taskStorage.updateTask(taskId, updates)
    
    if (updatedTask) {
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ))
    }
    
    return updatedTask
  }
  
  // Delete a task
  const deleteTask = (taskId) => {
    const success = taskStorage.deleteTask(taskId)
    
    if (success) {
      setTasks(tasks.filter(task => task.id !== taskId))
    }
    
    return success
  }
  
  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }))
  }
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({})
  }
  
  // Update sort configuration
  const updateSort = (by, direction) => {
    setSortConfig({ by, direction })
  }
  
  // Get task by id
  const getTaskById = (taskId) => {
    return taskStorage.getTaskById(taskId)
  }
  
  const contextValue = {
    tasks,
    isLoading,
    filters,
    sortConfig,
    getFilteredTasks,
    addTask,
    updateTask,
    deleteTask,
    updateFilters,
    clearFilters,
    updateSort,
    getTaskById
  }
  
  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
}
