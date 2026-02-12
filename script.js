// =====================================
// 🔥 REPLACE WITH YOUR REAL FIREBASE CONFIG
// =====================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "XXXXXXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const landing = document.getElementById("landing");
const appContainer = document.getElementById("app-container");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-landing-btn");
const logoutBtn = document.getElementById("logout-btn");

const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");

let currentUser = null;
let tasks = [];

// ==============================
// Google Login (Redirect)
// ==============================
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
}

signupBtn.addEventListener("click", loginWithGoogle);
loginBtn.addEventListener("click", loginWithGoogle);

// Handle redirect result
auth.getRedirectResult().catch(error => {
  alert(error.message);
});

// ==============================
// Auth State Listener
// ==============================
auth.onAuthStateChanged(user => {
  currentUser = user;

  if (user) {
    landing.style.display = "none";
    appContainer.style.display = "block";
    loadTasks();
  } else {
    landing.style.display = "block";
    appContainer.style.display = "none";
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

// ==============================
// Firestore Functions
// ==============================
function loadTasks() {
  db.collection("users").doc(currentUser.uid).get()
    .then(doc => {
      if (doc.exists) {
        tasks = doc.data().tasks || [];
      } else {
        tasks = [];
      }
      renderTasks();
      updateProgress();
    });
}

function saveTasks() {
  db.collection("users").doc(currentUser.uid).set({
    tasks: tasks
  });
}

// ==============================
// Task Functions
// ==============================
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text: text,
    completed: false,
    priority: prioritySelect.value
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
  updateProgress();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      ${task.text}
      <button>❌</button>
    `;

    li.querySelector("input").addEventListener("change", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
      updateProgress();
    });

    li.querySelector("button").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      updateProgress();
    });

    taskList.appendChild(li);
  });
}

function updateProgress() {
  if (tasks.length === 0) {
    progressFill.style.width = "0%";
    progressText.textContent = "Progress: 0%";
    return;
  }

  const completed = tasks.filter(t => t.completed).length;
  const percent = Math.round((completed / tasks.length) * 100);

  progressFill.style.width = percent + "%";
  progressText.textContent = "Progress: " + percent + "%";
}