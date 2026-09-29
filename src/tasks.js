import {
    getTasksFromStorage,
    saveTasksToStorage
} from "./storage.js";

export function filterTasks(type) {
  const allTasks = document.querySelectorAll(".task");

  allTasks.forEach((task) => {
    const checkbox = task.querySelector("input[type='checkbox']");
    if (type === "all") {
      task.style.display = "";
    } else if (type == "done") {
      if (checkbox.checked) {
        task.style.display = "";
      } else {
        task.style.display = "none";
      }
    } else if (type == "pending") {
      if (!checkbox.checked) {
        task.style.display = "";
      } else {
        task.style.display = "none";
      }
    }
  });
}

export function sortTodo(order) {
  const tasksContainer = document.getElementById("tasks");
  const tasks = [...tasksContainer.querySelectorAll(".task")];

  tasks.sort((a, b) => {
    const timeA = Number(a.dataset.createdAt);
    const timeB = Number(b.dataset.createdAt);

    if (order === "oldest") {
      return timeB - timeA;
    }

    return timeA - timeB;
  });

  tasks.forEach((task) => {
    tasksContainer.appendChild(task);
  });
}

export function updateStats() {
  const total = tasks.querySelectorAll(".task").length;
  const completed = document.querySelectorAll(
    '.task input[type="checkbox"]:checked'
  ).length;

  const pending = total - completed;

  document.getElementById("totalTasks").innerText = total;
  document.getElementById("completedTasks").innerText = completed;

  document.getElementById("pendingTasks").innerText = pending;
}

export function createTask(taskData,onEdit) {
  const newTask = document.createElement("div");

  newTask.className =
    "task w-full h-[140px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col sm:w-full sm:h-[220px] sm:p-5";

  newTask.dataset.id = taskData.id;
  newTask.dataset.createdAt = taskData.createdAt;

  const leftDiv = document.createElement("div");

  leftDiv.className = "flex flex-col min-w-0";

  const titleRow = document.createElement("div");

  titleRow.className = "flex items-start gap-2 sm:gap-3";

  const inputCheckbox = document.createElement("input");

  inputCheckbox.type = "checkbox";
  inputCheckbox.checked = taskData.completed;

  inputCheckbox.className =
    "w-6 h-6 sm:w-7 sm:h-7 shrink-0 cursor-pointer appearance-none rounded-full border-1 text-white border-slate-300 bg-white checked:border-emerald-300 checked:bg-emerald-300";

  const spanTask = document.createElement("span");

  spanTask.innerText = taskData.title;

  spanTask.className =
    "text-[17px] sm:text-[18px] font-semibold leading-6 sm:leading-7 text-slate-900 break-words";

  titleRow.appendChild(inputCheckbox);
  titleRow.appendChild(spanTask);

  const descriptionTask = document.createElement("p");

  descriptionTask.className =
    "description-text mt-2 sm:mt-6 mb-3 line-clamp-2 sm:line-clamp-3 overflow-y-auto text-[13px] sm:text-[15px] leading-5 sm:leading-6 text-slate-500";

  descriptionTask.innerText = taskData.description;

  leftDiv.appendChild(titleRow);
  leftDiv.appendChild(descriptionTask);

  const bottomSection = document.createElement("div");

  bottomSection.className =
    "mt-auto flex w-full items-center justify-between border-t-0 sm:border-t border-dashed border-slate-200 pt-0 sm:pt-4";

  const timeRow = document.createElement("div");

  timeRow.className = "flex flex-col text-xs text-slate-400 min-w-0";

  const createdTime = document.createElement("small");

  const createdDate = new Date(taskData.createdAt);

  const formattedCreated = createdDate.toLocaleTimeString("en-IN", {
    month: "short",
    day: "numeric",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  createdTime.innerText = `◷ Added at ${formattedCreated}`;

  createdTime.className =
    "text-[10px] sm:text-xs text-slate-400 truncate";

  timeRow.appendChild(createdTime);

  const buttons = document.createElement("div");

  buttons.className =
    "flex sm:flex-row items-center gap-1.5 sm:gap-2";

  const editBtn = document.createElement("button");

  editBtn.innerHTML = `<span class="material-symbols-outlined">edit</span>`;

  editBtn.className =
    "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-100 text-xl text-indigo-500 transition hover:bg-indigo-200 active:scale-95";

  const deleteBtn = document.createElement("button");

  deleteBtn.innerHTML = `<span class="material-symbols-outlined">delete</span>`;

  deleteBtn.className =
    "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-red-100 bg-red-100 text-xl text-red-500 transition hover:bg-red-200 active:scale-95";

  buttons.appendChild(editBtn);
  buttons.appendChild(deleteBtn);

  bottomSection.appendChild(timeRow);
  bottomSection.appendChild(buttons);

  newTask.appendChild(leftDiv);
  newTask.appendChild(bottomSection);

  setUpDelete(deleteBtn, newTask);

  setupCheckbox(
    inputCheckbox,
    spanTask,
    descriptionTask,
    newTask,
);

  setupEdit(editBtn, newTask, descriptionTask, spanTask, onEdit);

  if (taskData.completed) {
    spanTask.classList.add("completed");

    descriptionTask.classList.add("desc-completed");

    newTask.classList.remove("bg-white");

    newTask.classList.add("bg-emerald-50/50", "border-emerald-300");
  }

  return newTask;
}

function setUpDelete(deleteBtn, newTask) {
  deleteBtn.addEventListener("click", () => {
    const taskId = Number(newTask.dataset.id);

    let taskList = getTasksFromStorage();

    taskList = taskList.filter((task) => task.id !== taskId);

    saveTasksToStorage(taskList);
    newTask.remove();

    updateStats();

    if (document.querySelectorAll(".task").length === 0) {
      emptyTask.style.display = "flex";
    }
  });
}

function setupCheckbox(
  inputCheckbox,
  spanTask,
  descriptionTask,
  newTask,
) {
  inputCheckbox.addEventListener("change", () => {
    if (inputCheckbox.checked) {
      spanTask.classList.add("completed");
      descriptionTask.classList.add("desc-completed");

      newTask.classList.remove("bg-white");
      newTask.classList.add("bg-emerald-50/50", "border-emerald-300");
    } else {
      spanTask.classList.remove("completed");
      descriptionTask.classList.remove("desc-completed");
      newTask.classList.remove("bg-emerald-50/50", "border-emerald-300");

      newTask.classList.add("bg-white", "border-slate-200");
    }
    const taskList = getTasksFromStorage();

    const taskId = Number(newTask.dataset.id);

    const task = taskList.find((task) => task.id === taskId);

    if (task) {
      task.completed = inputCheckbox.checked;
    }

    saveTasksToStorage(taskList);
    updateStats();
  });
}

function setupEdit(editBtn, newTask, descriptionTask, spanTask, onEdit) {
  editBtn.addEventListener("click", () => {
    onEdit(newTask,spanTask,descriptionTask)
  });
}