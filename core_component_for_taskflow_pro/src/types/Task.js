/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier for the task
 * @property {string} title - Title of the task
 * @property {string} description - Detailed description of the task
 * @property {string} status - Current status of the task (todo, in-progress, completed)
 * @property {string} priority - Priority level of the task (low, medium, high)
 * @property {string} [dueDate] - Optional due date for the task
 * @property {string} createdAt - Date when the task was created
 * @property {string} [updatedAt] - Date when the task was last updated
 * @property {string[]} [tags] - Optional array of tags associated with the task
 */

/**
 * Task status options
 * @readonly
 * @enum {string}
 */
export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
}

/**
 * Task priority options
 * @readonly
 * @enum {string}
 */
export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

/**
 * Creates a new task with default values
 * @param {Partial<Task>} taskData - Partial task data to create a new task
 * @returns {Task} A new task object
 */
export function createTask(taskData = {}) {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date().toISOString(),
    tags: [],
    ...taskData,
  }
}
