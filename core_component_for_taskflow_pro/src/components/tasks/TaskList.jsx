import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useTasks } from '../../hooks/useTasks'
import TaskItem from './TaskItem'
import TaskFilters from './TaskFilters'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const ListTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  
  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
`

const CreateButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background-color: #2980b9;
  }
`

const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const EmptyState = styled.div`
  padding: 3rem 1rem;
  text-align: center;
  color: #a0aec0;
  
  h3 {
    margin-bottom: 1rem;
    color: #4a5568;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
`

/**
 * PUBLIC_INTERFACE
 * TaskList component that displays a list of tasks
 * @returns {JSX.Element} TaskList component
 */
function TaskList() {
  const navigate = useNavigate()
  const { getFilteredTasks } = useTasks()
  const tasks = getFilteredTasks()
  
  const handleCreateTask = () => {
    navigate('/tasks/new')
  }
  
  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>Tasks</ListTitle>
        <CreateButton onClick={handleCreateTask}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Task
        </CreateButton>
      </ListHeader>
      
      <TaskFilters />
      
      {tasks.length > 0 ? (
        <TasksGrid>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </TasksGrid>
      ) : (
        <EmptyState>
          <h3>No tasks found</h3>
          <p>There are no tasks matching your filters, or you haven't created any tasks yet.</p>
          <CreateButton onClick={handleCreateTask}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create your first task
          </CreateButton>
        </EmptyState>
      )}
    </ListContainer>
  )
}

export default TaskList
