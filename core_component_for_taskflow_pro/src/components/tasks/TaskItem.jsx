import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useTasks } from '../../hooks/useTasks'
import { TaskPriority } from '../../types/Task'

const ItemContainer = styled.div`
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #333;
  }
`

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`

const ItemTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
  
  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
`

const ItemDescription = styled.div`
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (prefers-color-scheme: dark) {
    color: #a0aec0;
  }
`

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #718096;
`

const Priority = styled.div`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    if (props.priority === 'high') {
      return `
        color: #e74c3c;
        background-color: rgba(231, 76, 60, 0.1);
      `;
    } else if (props.priority === 'medium') {
      return `
        color: #f39c12;
        background-color: rgba(243, 156, 18, 0.1);
      `;
    } else {
      return `
        color: #27ae60;
        background-color: rgba(39, 174, 96, 0.1);
      `;
    }
  }}
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

const Tag = styled.div`
  background-color: #edf2f7;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: #3a3a3a;
    color: #e2e8f0;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #718096;
  transition: color 0.2s;
  
  &:hover {
    color: #3498db;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const DueDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.overdue ? '#e74c3c' : '#718096'};
  
  svg {
    width: 14px;
    height: 14px;
  }
`

/**
 * Truncates text to the specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, length = 140) {
  if (!text || text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}

/**
 * Check if a date is in the past
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if the date is in the past
 */
function isOverdue(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
}

/**
 * Format date to a human-readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * PUBLIC_INTERFACE
 * TaskItem component that displays a single task
 * @param {Object} props - Component props
 * @param {Task} props.task - Task data to display
 * @param {Function} [props.onStatusChange] - Callback when status changes
 * @returns {JSX.Element} TaskItem component
 */
function TaskItem({ task, onStatusChange }) {
  const navigate = useNavigate();
  const { updateTask } = useTasks();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    navigate(`/tasks/${task.id}`);
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/tasks/${task.id}/edit`);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      // Handle task deletion
    }
  };
  
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'High';
      case TaskPriority.MEDIUM:
        return 'Medium';
      case TaskPriority.LOW:
        return 'Low';
      default:
        return 'Medium';
    }
  };
  
  return (
    <ItemContainer 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ItemHeader>
        <ItemTitle>{task.title}</ItemTitle>
        <Priority priority={task.priority}>
          {getPriorityLabel(task.priority)}
        </Priority>
      </ItemHeader>
      
      {task.description && (
        <ItemDescription>
          {truncateText(task.description, 120)}
        </ItemDescription>
      )}
      
      {task.tags && task.tags.length > 0 && (
        <TagsContainer>
          {task.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsContainer>
      )}
      
      <ItemMeta>
        {task.dueDate && (
          <DueDate overdue={isOverdue(task.dueDate)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(task.dueDate)}
          </DueDate>
        )}
        
        {isHovered && (
          <ActionButtons>
            <ActionButton onClick={handleEdit} title="Edit task">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </ActionButton>
            
            <ActionButton onClick={handleDelete} title="Delete task">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </ActionButton>
          </ActionButtons>
        )}
      </ItemMeta>
    </ItemContainer>
  );
}

export default TaskItem;
