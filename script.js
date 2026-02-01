// Elements from landing page
const landing = document.getElementById('landing');
const appContainer = document.getElementById('app-container');
const signupBtn = document.getElementById('signup-btn');
const loginLandingBtn = document.getElementById('login-landing-btn');

// Detect mobile for better flow
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Single trigger function with fallback
const triggerLogin = () => {
  console.log('Login triggered – device:', isMobile ? 'mobile' : 'desktop');
  
  const provider = new firebase.auth.GoogleAuthProvider();
  
  if (isMobile) {
    // Redirect is more reliable on mobile (avoids popup blocks)
    console.log('Using signInWithRedirect');
    auth.signInWithRedirect(provider).catch(error => {
      console.error('Redirect failed:', error.code, error.message);
      alert('Redirect login failed: ' + (error.message || 'Unknown error') + '\nCheck console (F12) for details.');
    });
  } else {
    // Popup usually works on desktop
    console.log('Using signInWithPopup');
    auth.signInWithPopup(provider).catch(error => {
      console.error('Popup failed:', error.code, error.message);
      if (error.code === 'auth/popup-blocked') {
        alert('Popup blocked by browser. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        alert('Login popup was closed before completing. Try again!');
      } else {
        alert('Login failed: ' + (error.message || 'Unknown error'));
      }
    });
  }
};

// Attach listeners properly (once!)
if (signupBtn) signupBtn.addEventListener('click', triggerLogin);
if (loginLandingBtn) loginLandingBtn.addEventListener('click', triggerLogin);

// Handle redirect result (must be called on every page load)
auth.getRedirectResult()
  .then((result) => {
    if (result.user) {
      console.log('Redirect login completed successfully:', result.user.displayName);
    } else {
      console.log('No redirect result (normal on direct load)');
    }
  })
  .catch((error) => {
    console.error('getRedirectResult error:', error.code, error.message);
    if (error.code) {
      alert('Login completion error: ' + error.message);
    }
  });

// Single auth state listener
auth.onAuthStateChanged((user) => {
  currentUser = user;
  if (user) {
    console.log('User authenticated:', user.email || user.displayName);
    if (landing) landing.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';
    loadUserData();  // Load tasks/streak from Firestore
  } else {
    console.log('No authenticated user – showing landing');
    if (landing) landing.style.display = 'block';
    if (appContainer) appContainer.style.display = 'none';
  }
});