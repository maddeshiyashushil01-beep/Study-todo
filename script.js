// ================================================
// Firebase Configuration – REPLACE WITH YOUR REAL VALUES!
// Get these from Firebase Console → Project Settings → Web App
// ================================================
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxxxxxxxx"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase initialized successfully");

// ================================================
// DOM Elements
// ================================================
const landing = document.getElementById("landing");
const appContainer = document.getElementById("app-container");
const signupBtn = document.getElementById("signup-btn");
const loginLandingBtn = document.getElementById("login-landing-btn");

// Todo elements (from your placeholder UI)
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const streakEl = document.getElementById("streak");
const reminderToggle = document.getElementById("reminder-toggle");
const motivationEl = document.getElementById("motivation");

// Debug: Check if elements are found
console.log("signupBtn:", signupBtn ? "Found" : "MISSING");
console.log("loginLandingBtn:", loginLandingBtn ? "Found" : "MISSING");

// ================================================
// Global variables
// ================================================
let currentUser = null;
let tasks = [];

// ================================================
// Login / Signup Trigger (REDIRECT method – best for mobile)
// ================================================
const triggerLogin = () => {
  console.log("Login button clicked → starting Google redirect login");

  const provider = new firebase.auth.GoogleAuthProvider();
  // Optional: limit to gmail accounts only
  // provider.addScope('email');

  auth.signInWithRedirect(provider).catch((error) => {
    console.error("signInWithRedirect failed:", error.code, error.message);
    alert("Login could not start:\n" + error.message);
  });
};

// Attach click listeners
if (signupBtn) {
  signupBtn.addEventListener("click", triggerLogin);
}
if (loginLandingBtn) {
  loginLandingBtn.addEventListener("click", triggerLogin);
}

// ================================================
// Handle redirect result after coming back from Google
// ================================================
auth.getRedirectResult()
  .then((result) => {
    if (result.user) {
      console.log("Redirect login SUCCESS:", result.user.displayName, result.user.email);
    } else {
      console.log("No redirect result (this is normal on first page load)");
    }
  })
  .catch((error) => {
    console.error("getRedirectResult error:", error.code, error.message);
    if (error.code) {
      alert("Login failed during redirect:\n" + error.message);
    }
  });

// ================================================
// Listen for auth state changes (logged in / out)
// ================================================
auth.onAuthStateChanged((user) => {
  currentUser = user;
  console.log("Auth state changed → user:", user ? user.email : "none");

  if (user) {
    landing.style.display = "none";
    appContainer.style.display = "block";
    loadUserData(); // Load tasks from Firestore
  } else {
    landing.style.display = "block";
    appContainer.style.display = "none";
  }
});

// ================================================
// Load tasks & streak from Firestore (per user)
// ================================================
function loadUserData() {
  if (!currentUser) return;

  const userDocRef = db.collection("users").doc(currentUser.uid);

  userDocRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      tasks = data.tasks || [];
      console.log("Loaded tasks from Firestore:", tasks.length);
      renderTasks();
      updateProgress();
    } else {
      console.log("New user – creating empty data");
      saveUserData(); // Create initial document
    }
  }).catch((err) => {
    console.error("Error loading user data:", err);
  });
}

// ================================================
// Save tasks & streak to Firestore
// ================================================
function saveUserData() {
  if (!currentUser) return;

  db.collection("users").doc(currentUser.uid).set({
    tasks: tasks,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true })
  .then(() => console.log("Data saved to Firestore"))
  .catch((err) => console.error("Save error:", err));
}

// ================================================
// Render tasks list
// ================================================
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.priority || "medium"} ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span class="task-text">${task.text}</span>
      <button class="delete-btn">×</button>
    `;

    // Toggle complete
    li.querySelector("input").addEventListener("change", () => {
      tasks[index].completed = !tasks[index].completed;
      saveUserData();
      renderTasks();
      updateProgress();
    });

    // Delete task
    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveUserData();
      renderTasks();
      updateProgress();
    });

    taskList.appendChild(li);
  });
}

// ================================================
// Update progress bar & percentage
// ================================================
function updateProgress() {
  if (tasks.length === 0) {
    progressFill.style.width = "0%";
    progressText.textContent = "Progress: 0%";
    return;
  }

  const completed = tasks.filter(t => t.completed).length;
  const percentage = Math.round((completed / tasks.length) * 100);
  progressFill.style.width = percentage + "%";
  progressText.textContent = `Progress: ${percentage}%`;
}

// ================================================
// Add new task
// ================================================
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text,
    completed: false,
    priority: prioritySelect.value || "medium",
    createdAt: new Date().toISOString()
  });

  taskInput.value = "";
  saveUserData();
  renderTasks();
  updateProgress();
}

// ================================================
// Event listeners for todo app
// ================================================
if (addBtn) {
  addBtn.addEventListener("click", addTask);
}

if (taskInput) {
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });
}

// Optional: Dark mode toggle (basic)
document.getElementById("theme-toggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  // You can save preference to localStorage if needed
});

// ================================================
// Initial check on page load
// ================================================
console.log("Page loaded – waiting for auth state...");


const firebaseConfig = {
  apiKey: "AIzaSy...something-here...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  // ... other keys
};