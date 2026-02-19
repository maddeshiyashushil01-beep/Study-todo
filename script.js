import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔥 PUT YOUR REAL CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");

// LOGIN (Mobile Safe)
loginBtn.onclick = () => {
  signInWithRedirect(auth, provider);
};

// After Redirect
getRedirectResult(auth).catch(error => {
  console.log("Login Error:", error);
});

// Auth State
onAuthStateChanged(auth, user => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
  } else {
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  }
});

// Logout
logoutBtn.onclick = () => {
  signOut(auth);
};


// Save data
localStorage.setItem("username", "Shushil");

// Get data
let user = localStorage.getItem("username");
console.log(user);