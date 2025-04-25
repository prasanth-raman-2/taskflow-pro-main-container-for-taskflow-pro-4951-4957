import { createTask } from '../types/Task';

const STORAGE_KEY = 'taskflow_tasks';

/**
 * PUBLIC_INTERFACE
 * Retrieves all tasks from local storage
 * @returns {Task[]} Array of task objects
 */
export function getAllTasks() {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
}

/**
 * PUBLIC_INTERFACE
 * Saves all tasks to local storage
 * @param {Task[]} tasks - Array of task objects to save
 */
export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * PUBLIC_INTERFACE
 * Retrieves a single task by ID
 * @param {string} taskId - ID of the task to retrieve
 * @returns {Task|null} The task object or null if not found
 */
export function getTaskById(taskId) {
  const tasks = getAllTasks();
  return tasks.find(task => task.id === taskId) || null;
}

/**
 * PUBLIC_INTERFACE
 * Adds a new task to storage
 * @param {Partial<Task>} taskData - Task data to create a new task
 * @returns {Task} The newly created task
 */
export function addTask(taskData) {
  const newTask = createTask(taskData);
  const tasks = getAllTasks();
  saveTasks([...tasks, newTask]);
  return newTask;
}

/**
 * PUBLIC_INTERFACE
 * Updates an existing task
 * @param {string} taskId - ID of the task to update
 * @param {Partial<Task>} updates - Object containing the properties to update
 * @returns {Task|null} The updated task or null if not found
 */
export function updateTask(taskId, updates) {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) return null;
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  
  return updatedTask;
}

/**
 * PUBLIC_INTERFACE
 * Deletes a task by ID
 * @param {string} taskId - ID of the task to delete
 * @returns {boolean} True if the task was deleted, false otherwise
 */
export function deleteTask(taskId) {
  const tasks = getAllTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  
  if (filteredTasks.length === tasks.length) {
    return false; // Task not found
  }
  
  saveTasks(filteredTasks);
  return true;
}

/**
 * PUBLIC_INTERFACE
 * Filters tasks by various criteria
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.priority] - Filter by priority
 * @param {string} [filters.search] - Search term for title and description
 * @param {string[]} [filters.tags] - Filter by tags
 * @returns {Task[]} Filtered task array
 */
export function filterTasks(filters = {}) {
  const tasks = getAllTasks();
  
  return tasks.filter(task => {
    // Status filter
    if (filters.status && task.status !== filters.status) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasAllTags = filters.tags.every(tag => 
        task.tags && task.tags.includes(tag)
      );
      if (!hasAllTags) return false;
    }
    
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(search);
      const descriptionMatch = task.description.toLowerCase().includes(search);
      if (!titleMatch && !descriptionMatch) return false;
    }
    
    return true;
  });
}

/**
 * PUBLIC_INTERFACE
 * Sorts tasks by the specified field and direction
 * @param {Task[]} tasks - Array of tasks to sort
 * @param {string} sortBy - Field to sort by (e.g., 'dueDate', 'priority', 'title')
 * @param {string} sortDirection - Direction to sort ('asc' or 'desc')
 * @returns {Task[]} Sorted task array
 */
export function sortTasks(tasks, sortBy = 'createdAt', sortDirection = 'desc') {
  return [...tasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'dueDate':
        // Handle potential null/undefined due dates
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate) - new Date(b.dueDate);
        break;
        
      case 'priority':
        const priorities = { high: 3, medium: 2, low: 1 };
        comparison = priorities[a.priority] - priorities[b.priority];
        break;
        
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
        
      default: // Default to createdAt
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
}

/**
 * PUBLIC_INTERFACE
 * Gets unique tags from all tasks
 * @returns {string[]} Array of unique tags
 */
export function getAllTags() {
  const tasks = getAllTasks();
  const tagsSet = new Set();
  
  tasks.forEach(task => {
    if (task.tags && Array.isArray(task.tags)) {
      task.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return [...tagsSet];
}

/**
 * Initializes storage with sample tasks if empty
 * This is for demo purposes only
 */
export function initializeWithSampleTasks() {
  const existingTasks = getAllTasks();
  
  if (existingTasks.length === 0) {
    const sampleTasks = [
      createTask({
        title: 'Complete project proposal',
        description: 'Write a detailed project proposal for the new client',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['work', 'client']
      }),
      createTask({
        title: 'Schedule team meeting',
        description: 'Coordinate with team members for the weekly sync up',
        priority: 'medium',
        status: 'in-progress',
        tags: ['work', 'team']
      }),
      createTask({
        title: 'Research new technologies',
        description: 'Look into new frameworks for upcoming projects',
        priority: 'low',
        tags: ['development', 'learning']
      }),
      createTask({
        title: 'Update documentation',
        description: 'Update the project documentation with recent changes',
        status: 'completed',
        priority: 'medium',
        tags: ['documentation']
      })
    ];
    
    saveTasks(sampleTasks);
  }
}
