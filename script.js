const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const streakEl = document.getElementById('streak');
const reminderToggle = document.getElementById('reminder-toggle');
const motivationEl = document.getElementById('motivation');
const themeToggle = document.getElementById('theme-toggle');

let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
let streak = parseInt(localStorage.getItem('studyStreak')) || 0;
let lastComplete = localStorage.getItem('lastComplete') || null;
let reminders = JSON.parse(localStorage.getItem('reminders')) || false;
let dark = JSON.parse(localStorage.getItem('darkMode')) || false;

const quotes = [
  "Small steps every day → big results",
  "You've got this. Keep going.",
  "Focus. Finish. Repeat.",
  "One task closer to your goal ✨",
  "Progress > perfection"
];

function save() {
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
  localStorage.setItem('studyStreak', streak);
  localStorage.setItem('lastComplete', lastComplete);
  localStorage.setItem('reminders', JSON.stringify(reminders));
  localStorage.setItem('darkMode', JSON.stringify(dark));
}

function updateUI() {
  taskList.innerHTML = '';

  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.priority} ${task.done ? 'completed' : ''}`;
    
    li.innerHTML = `
      <input type="checkbox" ${task.done ? 'checked' : ''}>
      <span class="task-text">${task.text}</span>
      <button class="delete-btn">×</button>
    `;

    li.querySelector('input').onchange = () => {
      tasks[i].done = !tasks[i].done;
      checkStreak();
      save();
      updateUI();
      updateProgress();
    };

    li.querySelector('.delete-btn').onclick = () => {
      li.style.opacity = '0';
      li.style.transform = 'translateY(10px)';
      setTimeout(() => {
        tasks.splice(i, 1);
        save();
        updateUI();
        updateProgress();
      }, 300);
    };

    taskList.appendChild(li);
  });

  updateProgress();
  streakEl.textContent = `🔥 Streak: ${streak} days`;
  reminderToggle.textContent = reminders ? '🔕 Disable Reminders' : '🔔 Enable Reminders';
  reminderToggle.className = `reminder-btn ${reminders ? 'active' : ''}`;
  document.body.className = dark ? 'dark' : '';
  motivationEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

function updateProgress() {
  if (!tasks.length) {
    progressFill.style.width = '0%';
    progressText.textContent = 'Progress: 0%';
    return;
  }
  const done = tasks.filter(t => t.done).length;
  const perc = Math.round((done / tasks.length) * 100);
  progressFill.style.width = perc + '%';
  progressText.textContent = `Progress: ${perc}%`;
}

function checkStreak() {
  const today = new Date().toDateString();
  const allDone = tasks.length > 0 && tasks.every(t => t.done);

  if (allDone && lastComplete !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = lastComplete === yesterday.toDateString();

    streak = wasYesterday ? streak + 1 : 1;
    lastComplete = today;
    if (reminders && Notification.permission === 'granted') {
      new Notification("Great job! 🎉", { body: `Streak now: ${streak} days` });
    }
  }

  save();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text,
    done: false,
    priority: prioritySelect.value,
    added: new Date().toISOString()
  });

  taskInput.value = '';
  save();
  updateUI();
  motivationEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// Events
addBtn.onclick = addTask;
taskInput.onkeypress = e => { if (e.key === 'Enter') addTask(); };

reminderToggle.onclick = () => {
  reminders = !reminders;
  if (reminders && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
  save();
  updateUI();
};

themeToggle.onclick = () => {
  dark = !dark;
  save();
  updateUI();
};

// Init
if (dark) document.body.classList.add('dark');
updateUI();

// Optional: daily reset check
setInterval(() => {
  const today = new Date().toDateString();
  if (lastComplete && lastComplete < today && streak > 0) {
    // You can reset streak here if you want strict daily rule
    // streak = 0;
    // save();
    // updateUI();
  }
}, 60000);