const STORAGE_KEY = "todoTasks";

export function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveTasksToStorage(taskList) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(taskList));
}