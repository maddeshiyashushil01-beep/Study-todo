// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBQxAEzF40f7wceNr1otvUYppzpGazJlro",
  authDomain: "study-todo-ee9b7.firebaseapp.com",
  projectId: "study-todo-ee9b7",
  storageBucket: "study-todo-ee9b7.firebasestorage.app",
  messagingSenderId: "880422833922",
  appId: "1:880422833922:web:1a02c1b5751a196dbbfc1b",
  measurementId: "G-WG7W7WSWHM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// Elements
const landing = document.getElementById("landing");
const appContainer = document.getElementById("app-container");
const signupBtn = document.getElementById("signup-btn");
const loginLandingBtn = document.getElementById("login-landing-btn");
const logoutBtn = document.getElementById("logout-btn");

// Login Function
function login() {
  auth.signInWithPopup(provider)
    .then((result) => {
      landing.style.display = "none";
      appContainer.style.display = "block";
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Logout
function logout() {
  auth.signOut().then(() => {
    landing.style.display = "block";
    appContainer.style.display = "none";
  });
}

// Button Events
signupBtn.addEventListener("click", login);
loginLandingBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

// Auto Login Check
auth.onAuthStateChanged((user) => {
  if (user) {
    landing.style.display = "none";
    appContainer.style.display = "block";
  } else {
    landing.style.display = "block";
    appContainer.style.display = "none";
  }
});