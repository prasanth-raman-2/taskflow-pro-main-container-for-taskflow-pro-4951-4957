import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useTasks } from '../../hooks/useTasks'
import { formatRelative } from '../../utils/dateUtils'

const DetailsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (prefers-color-scheme: dark) {
    background-color: #333;
  }
`

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`

const DetailsTitle = styled.h1`
  font-size: 1.5rem;
  color: #2c3e50;
  
  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ActionButton = styled.button`
  background-color: ${props => props.danger ? '#e74c3c' : '#3498db'};
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
    background-color: ${props => props.danger ? '#c0392b' : '#2980b9'};
  }
`

const BackButton = styled.button`
  background-color: transparent;
  color: #718096;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f1f5f9;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  @media (prefers-color-scheme: dark) {
    border-color: #4a5568;
    
    &:hover {
      background-color: #2d3748;
    }
  }
`

const DetailsMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #4a5568;
  
  @media (prefers-color-scheme: dark) {
    color: #a0aec0;
  }
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
  }
`

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  
  ${props => {
    if (props.status === 'todo') {
      return `
        background-color: #ebf8ff;
        color: #3182ce;
      `;
    } else if (props.status === 'in-progress') {
      return `
        background-color: #fef5e7;
        color: #e67e22;
      `;
    } else {
      return `
        background-color: #f0fff4;
        color: #38a169;
      `;
    }
  }}
  
  @media (prefers-color-scheme: dark) {
    ${props => {
      if (props.status === 'todo') {
        return `
          background-color: #2c5282;
          color: #bee3f8;
        `;
      } else if (props.status === 'in-progress') {
        return `
          background-color: #804d0b;
          color: #fbd38d;
        `;
      } else {
        return `
          background-color: #1c4532;
          color: #9ae6b4;
        `;
      }
    }}
  }
`

const PriorityBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  
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

const DetailsDescription = styled.div`
  line-height: 1.7;
  margin-bottom: 2rem;
  color: #4a5568;
  white-space: pre-wrap;
  
  @media (prefers-color-scheme: dark) {
    color: #cbd5e0;
  }
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

const Tag = styled.div`
  background-color: #edf2f7;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: #3a3a3a;
    color: #e2e8f0;
  }
`

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  
  h2 {
    margin-bottom: 1rem;
    color: #4a5568;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: #718096;
  }
`

/**
 * Format date to a human-readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * PUBLIC_INTERFACE
 * TaskDetails component that displays detailed information about a task
 * @returns {JSX.Element} TaskDetails component
 */
function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getTaskById, deleteTask } = useTasks();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (taskId) {
      const foundTask = getTaskById(taskId);
      setTask(foundTask);
      setLoading(false);
    }
  }, [taskId, getTaskById]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleEdit = () => {
    navigate(`/tasks/${taskId}/edit`);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      navigate('/list');
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!task) {
    return (
      <NotFoundContainer>
        <h2>Task Not Found</h2>
        <p>The task you're looking for doesn't exist or has been deleted.</p>
        <ActionButton onClick={() => navigate('/list')}>
          Go back to task list
        </ActionButton>
      </NotFoundContainer>
    );
  }
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };
  
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return priority;
    }
  };
  
  return (
    <>
      <BackButton onClick={handleBack}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back
      </BackButton>
      
      <DetailsContainer>
        <DetailsHeader>
          <DetailsTitle>{task.title}</DetailsTitle>
          
          <ActionButtons>
            <ActionButton onClick={handleEdit}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </ActionButton>
            
            <ActionButton onClick={handleDelete} danger>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </ActionButton>
          </ActionButtons>
        </DetailsHeader>
        
        <DetailsMeta>
          <MetaItem>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            Status: <StatusBadge status={task.status}>{getStatusLabel(task.status)}</StatusBadge>
          </MetaItem>
          
          <MetaItem>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Priority: <PriorityBadge priority={task.priority}>{getPriorityLabel(task.priority)}</PriorityBadge>
          </MetaItem>
          
          {task.dueDate && (
            <MetaItem>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Due: {formatDate(task.dueDate)}
            </MetaItem>
          )}
          
          <MetaItem>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Created: {formatDate(task.createdAt)}
          </MetaItem>
          
          {task.updatedAt && (
            <MetaItem>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Updated: {formatDate(task.updatedAt)}
            </MetaItem>
          )}
        </DetailsMeta>
        
        {task.description && (
          <DetailsDescription>{task.description}</DetailsDescription>
        )}
        
        {task.tags && task.tags.length > 0 && (
          <>
            <h3>Tags</h3>
            <TagsContainer>
              {task.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagsContainer>
          </>
        )}
      </DetailsContainer>
    </>
  );
}

export default TaskDetails;
