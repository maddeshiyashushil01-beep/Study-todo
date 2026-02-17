// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentUser;

// Login
document.getElementById("google-login").onclick = () => {
  import { signInWithRedirect } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.getElementById("google-login").onclick = () => {
  signInWithRedirect(auth, provider);
};
};

// Logout
document.getElementById("logout").onclick = () => {
  signOut(auth);
};

// Auth State
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    document.getElementById("login-section").style.display = "none";
    document.getElementById("todo-section").style.display = "block";
    document.getElementById("user-name").innerText = "Hello " + user.displayName;
    loadTasks();
  } else {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("todo-section").style.display = "none";
  }
});

// Add Task
async function addTask() {
  const task = document.getElementById("task-input").value;
  if (!task) return;

  await addDoc(collection(db, "tasks"), {
    uid: currentUser.uid,
    text: task
  });

  document.getElementById("task-input").value = "";
  loadTasks();
}

// Load Tasks
async function loadTasks() {
  const q = query(collection(db, "tasks"), where("uid", "==", currentUser.uid));
  const querySnapshot = await getDocs(q);

  const list = document.getElementById("task-list");
  list.innerHTML = "";

  querySnapshot.forEach(docSnap => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${docSnap.data().text}
      <button onclick="deleteTask('${docSnap.id}')">X</button>
    `;
    list.appendChild(li);
  });
}

// Delete Task
window.deleteTask = async function(id) {
  await deleteDoc(doc(db, "tasks", id));
  loadTasks();
}