let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDate = document.getElementById("dueDate");
  const dueTime = document.getElementById("dueTime");

  const text = taskInput.value.trim();
  const date = dueDate.value;
  const time = dueTime.value;

  if (!text || !date || !time) {
    alert("Please fill in all fields.");
    return;
  }

  const task = {
    id: Date.now(),
    text,
    date,
    time,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDate.value = "";
  dueTime.value = "";
}

function renderTasks(filter = "all", search = "") {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  const filtered = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "today") {
      return !task.completed;
    } else if (filter === "upcoming") {
      return task.completed;
    }

    return true;
  });

  if (filtered.length === 0) {
    taskList.innerHTML = `<li style="text-align:center;color:gray;">No tasks found</li>`;
    return;
  }

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task";

    if (task.completed) li.classList.add("completed");

    const now = new Date();
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    const isOverdue = !task.completed && taskDateTime < now;

    if (isOverdue) li.classList.add("overdue");

    li.innerHTML = `
      <span onclick="toggleComplete(${task.id})" style="cursor:pointer;">
        ${task.text} <br />
        <small>${task.date} ${task.time}</small>
      </span>
      <button onclick="deleteTask(${task.id})">❌</button>
    `;

    taskList.appendChild(li);
  });
  updateStats();
}

function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks(currentFilter, document.getElementById("searchInput").value);
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks(currentFilter, document.getElementById("searchInput").value);
}

let currentFilter = "all";

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks(filter, document.getElementById("searchInput").value);
}

function searchTasks() {
  const searchInput = document.getElementById("searchInput").value;
  renderTasks(currentFilter, searchInput);
}
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  document.getElementById("totalTasks").textContent = `Total Tasks: ${total}`;
  document.getElementById("completedTasks").textContent = `Completed: ${completed}`;
}


// Load on page ready

  window.onload = () => {
    renderTasks();
  
    document.getElementById("clearCompleted").addEventListener("click", () => {
      tasks = tasks.filter(task => !task.completed);
      saveTasks();
      renderTasks(currentFilter, document.getElementById("searchInput").value);
      updateStats(); // Make sure stats are refreshed immediately
    });
    
  };
