function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDate = document.getElementById("dueDate");
  const dueTime = document.getElementById("dueTime");
  const taskText = taskInput.value.trim();
  const date = dueDate.value;
  const time = dueTime.value;

  if (!taskText || !date || !time) return;

  createTaskElement(taskText, date, time);
  saveTask(taskText, date, time);

  taskInput.value = "";
  dueDate.value = "";
  dueTime.value = "";
}

function createTaskElement(taskText, date, time) {
  const taskList = document.getElementById("taskList");
  const li = document.createElement("li");
  li.className = "task";

  li.innerHTML = `
    <span>${taskText} - <small>${date} ${time}</small></span>
    <button onclick="removeTask(this)">❌</button>
  `;

  taskList.appendChild(li);
}

function filterTasks(type) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  let filtered = [];

  if (type === "all") {
    filtered = tasks;
  } else if (type === "today") {
    filtered = tasks.filter(task => task.date === todayStr);
  } else if (type === "upcoming") {
    filtered = tasks.filter(task => new Date(`${task.date}T${task.time}`) > now);
  }

  document.getElementById("taskList").innerHTML = "";
  filtered.forEach(task => createTaskElement(task.text, task.date, task.time));
}
window.onload = function () {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.forEach(task => createTaskElement(task.text, task.date, task.time));
};
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

setInterval(checkTasksForReminder, 60000);

function checkTasksForReminder() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const now = new Date();

  tasks.forEach(task => {
    if (!task.date || !task.time) return;

    const taskDateTime = new Date(`${task.date}T${task.time}`);
    const diff = (taskDateTime - now) / 60000;

    if (diff > 4 && diff <= 5 && Notification.permission === "granted") {
      new Notification("⏰ Upcoming Task", {
        body: `${task.text} is due in 5 minutes!`,
      });
    }
  });
}
let currentFilter = "all"; // default filter
function filterTasks(type) {
  currentFilter = type;
  updateTaskList();
}
function searchTasks() {
  updateTaskList();
}
function updateTaskList() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const searchText = document.getElementById("searchInput").value.toLowerCase();

  const filtered = tasks.filter(task => {
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    const isToday = task.date === todayStr;
    const isUpcoming = taskDateTime > now;
    const matchesSearch = task.text.toLowerCase().includes(searchText);

    if (currentFilter === "all") return matchesSearch;
    if (currentFilter === "today") return isToday && matchesSearch;
    if (currentFilter === "upcoming") return isUpcoming && matchesSearch;
  });

  document.getElementById("taskList").innerHTML = "";
  filtered.forEach(task => createTaskElement(task.text, task.date, task.time));
}
window.onload = function () {
  Notification.requestPermission(); // for notification
  updateTaskList(); // load all tasks
};
