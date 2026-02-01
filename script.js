// Debug logs to see what's happening
console.log('script.js loaded');

// Elements
const landing = document.getElementById('landing');
const appContainer = document.getElementById('app-container');
const signupBtn = document.getElementById('signup-btn');
const loginLandingBtn = document.getElementById('login-landing-btn');

// Log button existence
console.log('signupBtn exists?', !!signupBtn);
console.log('loginLandingBtn exists?', !!loginLandingBtn);

// Single auth listener
auth.onAuthStateChanged(user => {
  console.log('Auth state:', user ? 'Logged in - ' + user.email : 'Not logged in');
  if (user) {
    landing.style.display = 'none';
    appContainer.style.display = 'block';
    loadUserData();
  } else {
    landing.style.display = 'block';
    appContainer.style.display = 'none';
  }
});

// Handle redirect return
auth.getRedirectResult()
  .then(result => {
    if (result.user) {
      console.log('Redirect OK:', result.user.displayName);
    } else {
      console.log('No redirect result (normal on first load)');
    }
  })
  .catch(err => {
    console.error('Redirect result ERROR:', err.code, err.message);
    alert('Login return failed: ' + err.message);
  });

// Trigger login – only redirect
const triggerLogin = () => {
  console.log('Button clicked – attempting redirect...');
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider)
    .catch(err => {
      console.error('Redirect start ERROR:', err.code, err.message);
      alert('Login start failed: ' + err.message + '\nCheck console.');
    });
};

// Attach
signupBtn?.addEventListener('click', triggerLogin);
loginLandingBtn?.addEventListener('click', triggerLogin);