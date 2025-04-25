import { useState } from 'react'
import styled from '@emotion/styled'
import { useTaskFilters } from '../../hooks/useTaskFilters'
import { TaskStatus, TaskPriority } from '../../types/Task'
import { useTasks } from '../../hooks/useTasks'

const FiltersContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (prefers-color-scheme: dark) {
    background-color: #333;
  }
`

const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
`

const FilterGroup = styled.div`
  flex: 1;
  min-width: 120px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
  
  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #cbd5e0;
  background-color: white;
  font-size: 0.9rem;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #444;
    color: white;
    border-color: #555;
  }
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #cbd5e0;
  font-size: 0.9rem;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #444;
    color: white;
    border-color: #555;
  }
`

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`

const FilterButton = styled.button`
  background-color: ${props => props.isPrimary ? '#3498db' : 'transparent'};
  color: ${props => props.isPrimary ? 'white' : '#718096'};
  border: ${props => props.isPrimary ? 'none' : '1px solid #cbd5e0'};
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: ${props => props.isPrimary ? '500' : 'normal'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.isPrimary ? '#2980b9' : '#f1f5f9'};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  @media (prefers-color-scheme: dark) {
    border-color: ${props => props.isPrimary ? 'none' : '#4a5568'};
    
    &:hover {
      background-color: ${props => props.isPrimary ? '#2980b9' : '#2d3748'};
    }
  }
`

/**
 * PUBLIC_INTERFACE
 * TaskFilters component that provides filtering controls for tasks
 * @returns {JSX.Element} TaskFilters component
 */
function TaskFilters() {
  const { filters, updateFilters, clearFilters } = useTaskFilters()
  const { getAllTags } = useTasks()
  
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || '',
    priority: filters.priority || '',
    search: filters.search || '',
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleApplyFilters = () => {
    // Filter out empty values
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([_, value]) => value !== '')
    )
    updateFilters(nonEmptyFilters)
  }
  
  const handleClearFilters = () => {
    setLocalFilters({
      status: '',
      priority: '',
      search: '',
    })
    clearFilters()
  }
  
  return (
    <FiltersContainer>
      <FiltersRow>
        <FilterGroup>
          <Label htmlFor="search">Search</Label>
          <Input 
            type="text" 
            id="search" 
            name="search" 
            placeholder="Search tasks..." 
            value={localFilters.search} 
            onChange={handleChange} 
          />
        </FilterGroup>
        
        <FilterGroup>
          <Label htmlFor="status">Status</Label>
          <Select 
            id="status" 
            name="status" 
            value={localFilters.status} 
            onChange={handleChange}
          >
            <option value="">All Statuses</option>
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </Select>
        </FilterGroup>
        
        <FilterGroup>
          <Label htmlFor="priority">Priority</Label>
          <Select 
            id="priority" 
            name="priority" 
            value={localFilters.priority} 
            onChange={handleChange}
          >
            <option value="">All Priorities</option>
            <option value={TaskPriority.HIGH}>High</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.LOW}>Low</option>
          </Select>
        </FilterGroup>
      </FiltersRow>
      
      <FilterActions>
        <FilterButton onClick={handleClearFilters}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          Clear Filters
        </FilterButton>
        
        <FilterButton onClick={handleApplyFilters} isPrimary>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Apply Filters
        </FilterButton>
      </FilterActions>
    </FiltersContainer>
  )
}

export default TaskFilters
