import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useTasks } from '../../hooks/useTasks'
import { TaskStatus, TaskPriority, createTask } from '../../types/Task'

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  
  @media (prefers-color-scheme: dark) {
    background-color: #333;
  }
`

const FormTitle = styled.h1`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  
  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
`

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
  
  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #cbd5e0;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #444;
    color: white;
    border-color: #555;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #cbd5e0;
  font-size: 1rem;
  min-height: 120px;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #444;
    color: white;
    border-color: #555;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #cbd5e0;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #444;
    color: white;
    border-color: #555;
  }
`

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  & > div {
    flex: 1;
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0;
  }
`

const TagsInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  min-height: 54px;
  
  @media (prefers-color-scheme: dark) {
    border-color: #555;
  }
`

const Tag = styled.div`
  background-color: #e2e8f0;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #4a5568;
    color: #e2e8f0;
  }
`

const TagInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 0.9rem;
  background-color: transparent;
  
  @media (prefers-color-scheme: dark) {
    color: white;
  }
`

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`

const Button = styled.button`
  background-color: ${props => props.primary ? '#3498db' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#718096'};
  border: ${props => props.primary ? 'none' : '1px solid #cbd5e0'};
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: ${props => props.primary ? '500' : 'normal'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? '#2980b9' : '#f1f5f9'};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  @media (prefers-color-scheme: dark) {
    border-color: ${props => props.primary ? 'none' : '#4a5568'};
    
    &:hover {
      background-color: ${props => props.primary ? '#2980b9' : '#4a5568'};
      color: ${props => !props.primary && 'white'};
    }
  }
`

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.5rem;
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

/**
 * PUBLIC_INTERFACE
 * TaskForm component for creating and editing tasks
 * @returns {JSX.Element} TaskForm component
 */
function TaskForm() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getTaskById, addTask, updateTask } = useTasks();
  
  const isEditMode = !!taskId;
  
  // Create an empty form state
  const emptyFormState = {
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    tags: [],
  };
  
  const [formData, setFormData] = useState(emptyFormState);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  
  // Load task data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const task = getTaskById(taskId);
      
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          tags: task.tags || [],
        });
      } else {
        // Task not found, redirect to list
        navigate('/list');
      }
    }
  }, [isEditMode, taskId, getTaskById, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    } else if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      // Remove the last tag if backspace is pressed and input is empty
      removeTag(formData.tags.length - 1);
    }
  };
  
  const addTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };
  
  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate + 'T00:00:00').toISOString() : null,
      };
      
      if (isEditMode) {
        updateTask(taskId, taskData);
        navigate(`/tasks/${taskId}`);
      } else {
        const newTask = addTask(taskData);
        navigate(`/tasks/${newTask.id}`);
      }
    }
  };
  
  const handleCancel = () => {
    navigate(isEditMode ? `/tasks/${taskId}` : '/list');
  };
  
  return (
    <>
      <BackButton onClick={handleCancel}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back
      </BackButton>
      
      <FormContainer>
        <FormTitle>{isEditMode ? 'Edit Task' : 'Create New Task'}</FormTitle>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title*</Label>
            <Input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Enter task title"
              autoFocus 
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Enter task description"
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="status">Status</Label>
              <Select 
                id="status" 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
              >
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                id="priority" 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange}
              >
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
              </Select>
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input 
              type="date" 
              id="dueDate" 
              name="dueDate" 
              value={formData.dueDate} 
              onChange={handleChange} 
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Tags</Label>
            <TagsInput>
              {formData.tags.map((tag, index) => (
                <Tag key={index}>
                  {tag}
                  <svg 
                    onClick={() => removeTag(index)}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Tag>
              ))}
              <TagInput 
                type="text" 
                value={tagInput} 
                onChange={handleTagInputChange} 
                onKeyDown={handleTagInputKeyDown} 
                placeholder="Type and press Enter to add tags"
              />
            </TagsInput>
          </FormGroup>
          
          <FormActions>
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" primary>
              {isEditMode ? 'Update Task' : 'Create Task'}
            </Button>
          </FormActions>
        </form>
      </FormContainer>
    </>
  );
}

export default TaskForm;
