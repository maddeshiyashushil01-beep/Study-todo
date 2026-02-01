const landing = document.getElementById('landing');
const appContainer = document.getElementById('app-container');
const signupBtn = document.getElementById('signup-btn');
const loginLandingBtn = document.getElementById('login-landing-btn');

// Auth state
auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    landing.style.display = 'none';
    appContainer.style.display = 'block';
    loadUserData();
  } else {
    landing.style.display = 'block';
    appContainer.style.display = 'none';
  }
});

// Start for free / Login buttons on landing
signupBtn.onclick = loginLandingBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => console.error(err));
};

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    // loadUserData() etc.
  } else {
    document.getElementById('landing').style.display = 'block';
    document.getElementById('app-container').style.display = 'none';
  }
});