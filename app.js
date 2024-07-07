// FirebaseUI config
var uiConfig = {
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url/callback.
  tosUrl: '<your-tos-url>',
  // Privacy policy url/callback.
  privacyPolicyUrl: function() {
    window.location.assign('<your-privacy-policy-url>');
  }
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

// Listen to auth state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    document.getElementById('firebaseui-auth-container').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
  } else {
    // No user is signed in
    document.getElementById('firebaseui-auth-container').style.display = 'block';
    document.getElementById('chat-section').style.display = 'none';
  }
});

function sendMessage() {
  const message = document.getElementById('chat-input').value;
  // Here you would typically send the message to your backend
  // For now, we'll just display it in the chat output
  const chatOutput = document.getElementById('chat-output');
  chatOutput.innerHTML += `<p>User: ${message}</p>`;
  document.getElementById('chat-input').value = '';
}
