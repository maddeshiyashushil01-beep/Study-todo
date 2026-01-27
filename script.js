let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let streak = localStorage.getItem("streak") || 0;
let lastDate = localStorage.getItem("lastDate");

function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastDate", new Date().toDateString());
}

function addTask() {
  let input = document.getElementById("taskInput");
  if (input.value === "") return;

  tasks.push({ text: input.value, done: false });
  input.value = "";
  saveData();
  render();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  updateStreak();
  saveData();
  render();
}

function render() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, i) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <span onclick="toggleTask(${i})"
        style="text-decoration:${task.done ? 'line-through' : 'none'}">
        ${task.text}
      </span>
    `;
    list.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  let done = tasks.filter(t => t.done).length;
  let percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText = `Progress: ${percent}%`;

  let quote = "Start now 🚀";
  if (percent > 30) quote = "Good going 💪";
  if (percent > 70) quote = "Excellent work 🔥";

  document.getElementById("quote").innerText = quote;
}

function updateStreak() {
  let today = new Date().toDateString();

  if (lastDate !== today) {
    streak++;
    document.getElementById("streak").innerText = `🔥 Streak: ${streak} days`;
  }
}

document.getElementById("streak").innerText = `🔥 Streak: ${streak} days`;
render();

function render() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, i) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} 
        onclick="toggleTask(${i})">
      <span style="text-decoration:${task.done ? 'line-through' : 'none'}">
        ${task.text}
      </span>
    `;

    list.appendChild(li);
  });

  updateProgress();
}