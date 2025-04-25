import { useEffect } from 'react'
import styled from '@emotion/styled'
import { useTasks } from '../../hooks/useTasks'
import { useTaskFilters } from '../../hooks/useTaskFilters'
import { TaskStatus } from '../../types/Task'
import TaskItem from './TaskItem'
import TaskFilters from './TaskFilters'

const BoardContainer = styled.div`
  margin-top: 1rem;
`

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  height: calc(100vh - 200px);
  overflow-x: auto;
`

const Column = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2d3748' : '#f1f5f9'};
  border-radius: 8px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
`

const ColumnHeader = styled.div`
  padding: 1rem;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#4a5568'};
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ColumnContent = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const TaskCount = styled.span`
  background-color: ${props => props.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#4a5568'};
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
`

const EmptyState = styled.div`
  padding: 1rem;
  text-align: center;
  color: #a0aec0;
  font-size: 0.9rem;
`

/**
 * PUBLIC_INTERFACE
 * TaskBoard component that displays tasks in a kanban-style board
 * @returns {JSX.Element} TaskBoard component
 */
function TaskBoard() {
  const { updateFilters, filters } = useTaskFilters()
  const { getFilteredTasks } = useTasks()
  const tasks = getFilteredTasks()
  
  // Organize tasks by status
  const tasksByStatus = {
    [TaskStatus.TODO]: tasks.filter(task => task.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.COMPLETED]: tasks.filter(task => task.status === TaskStatus.COMPLETED)
  }
  
  // Default to light theme
  const theme = 'light'
  
  // Column configuration
  const columns = [
    { id: TaskStatus.TODO, title: 'To Do' },
    { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
    { id: TaskStatus.COMPLETED, title: 'Completed' }
  ]
  
  // Update status filter when clicking on a status in the sidebar
  useEffect(() => {
    if (filters.status) {
      // Scroll to the column matching the status filter
      const column = document.getElementById(`column-${filters.status}`)
      if (column) {
        column.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [filters.status])
  
  return (
    <BoardContainer>
      <TaskFilters />
      
      <Board>
        {columns.map(column => (
          <Column key={column.id} theme={theme} id={`column-${column.id}`}>
            <ColumnHeader theme={theme}>
              <div>{column.title}</div>
              <TaskCount theme={theme}>
                {tasksByStatus[column.id].length}
              </TaskCount>
            </ColumnHeader>
            
            <ColumnContent>
              {tasksByStatus[column.id].length > 0 ? (
                tasksByStatus[column.id].map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onStatusChange={(newStatus) => {
                      // Update task status via the task item
                    }} 
                  />
                ))
              ) : (
                <EmptyState>No tasks in this column</EmptyState>
              )}
            </ColumnContent>
          </Column>
        ))}
      </Board>
    </BoardContainer>
  )
}

export default TaskBoard
