import "./input.css";
import {
    getTasksFromStorage,
    saveTasksToStorage
} from "./storage.js";

import {
    createTask,
    filterTasks,
    sortTodo,
    updateStats
} from "./tasks.js";

const inputTask = document.getElementById("inputTask");
const addButton = document.getElementById("addbutton");
const tasks = document.getElementById("tasks");
const emptyTask = document.getElementById("emptyTask");
const descriptionInput = document.getElementById("description");
const sortTasks = document.getElementById("sortTasks");
const filterSelect = document.getElementById("filterTasks");

let editingTask = null;
let currentFilter = "all";

function loadTasks() {
  const taskList = getTasksFromStorage();

  if (taskList.length === 0) {
    emptyTask.style.display = "flex";
    return;
  }

  emptyTask.style.display = "none";

  taskList.forEach((taskData) => {
    const newTask = createTask(taskData,startEditingTask);

    tasks.appendChild(newTask);
  });

  updateStats();
}

function addTask() {
  if (inputTask.value.trim() === "") {
    alert("Task cannot be empty");
    return;
  }

  if (emptyTask) {
    emptyTask.style.display = "none";
  }

  if (editingTask) {
    const title = editingTask.querySelector("span");
    const desc = editingTask.querySelector(".description-text");

    const taskId = Number(editingTask.dataset.id);
    const taskList = getTasksFromStorage();

    const task = taskList.find((task) => task.id === taskId);

    if (task) {
      task.title = inputTask.value;
      task.description = descriptionInput.value;

      saveTasksToStorage(taskList);
    }
    title.innerText = inputTask.value;
    desc.innerText = descriptionInput.value;

    editingTask = null;

    addButton.textContent = "+ Add Todo";

    inputTask.value = "";
    descriptionInput.value = "";

    return;
  }

  const taskData = {
    id: Date.now(),
    title: inputTask.value,
    description: descriptionInput.value,
    completed: false,
    createdAt: Date.now()
  };

  const taskList = getTasksFromStorage();

  taskList.push(taskData);

  saveTasksToStorage(taskList);

  const newTask = createTask(taskData,startEditingTask);
  tasks.appendChild(newTask);
  inputTask.value = "";
  descriptionInput.value = "";

  updateStats();
}

addButton.addEventListener("click", addTask);

filterSelect.addEventListener("change", () => {
  currentFilter = filterSelect.value;
  filterTasks(currentFilter);
});

sortTasks.addEventListener("change", () => {
  sortTodo(sortTasks.value);
});

function startEditingTask(newTask, spanTask, descriptionTask) {
  inputTask.value = spanTask.innerText;
  descriptionInput.value = descriptionTask.innerText;

  editingTask = newTask;

  addButton.textContent = "Save Changes";
}

loadTasks();