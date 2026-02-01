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

// Change to redirect flow (better for mobile)
const triggerLogin = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider)
    .catch((error) => {
      console.error('Redirect login error:', error);
      alert('Login issue: ' + error.message);
    });
};

// After redirect comes back, handle the result (add this near the top of script.js, after auth init)
auth.getRedirectResult()
  .then((result) => {
    if (result.user) {
      console.log('Redirect login success:', result.user.displayName);
      // The onAuthStateChanged will handle showing the app
    }
  })
  .catch((error) => {
    console.error('Redirect result error:', error);
  });

// Keep your existing auth.onAuthStateChanged(...) as is



const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

const triggerLogin = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  if (isMobile) {
    auth.signInWithRedirect(provider);
  } else {
    auth.signInWithPopup(provider);
  }
};