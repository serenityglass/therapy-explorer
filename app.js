document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();
    let currentUser = null;

    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const grantAccessButton = document.getElementById('grantAccessButton');
    const revokeAccessButton = document.getElementById('revokeAccessButton');

    loginButton.addEventListener('click', login);
    logoutButton.addEventListener('click', logout);
    grantAccessButton.addEventListener('click', grantAccess);
    revokeAccessButton.addEventListener('click', revokeAccess);

    firebase.auth().onAuthStateChanged(handleAuthStateChanged);

    console.log("Firebase initialized");

    function handleAuthStateChanged(user) {
      console.log("Auth state changed", user);
      // ... rest of the function
    }

    function login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(error => console.error("Error logging in:", error));
    }

    function logout() {
        firebase.auth().signOut()
            .catch(error => console.error("Error logging out:", error));
    }

    function handleAuthStateChanged(user) {
        currentUser = user;
        document.getElementById('login-section').style.display = user ? 'none' : 'block';
        document.getElementById('logoutButton').style.display = user ? 'block' : 'none';

        if (user) {
            checkUserRole(user.email);
        } else {
            document.getElementById('admin-section').style.display = 'none';
            document.getElementById('doctor-section').style.display = 'none';
        }
    }

    function checkUserRole(email) {
        if (email === 'mihnea.maftei@gmail.com') {  // Replace with your admin email
            document.getElementById('admin-section').style.display = 'block';
            document.getElementById('doctor-section').style.display = 'none';
            updateDoctorList();
        } else {
            db.collection('doctors').doc(email).get()
                .then(doc => {
                    if (doc.exists && doc.data().hasAccess) {
                        document.getElementById('doctor-section').style.display = 'block';
                    } else {
                        alert('You do not have access to view medical data.');
                        firebase.auth().signOut();
                    }
                    document.getElementById('admin-section').style.display = 'none';
                })
                .catch(error => console.error("Error checking doctor access:", error));
        }
    }

    function grantAccess() {
        const doctorEmail = document.getElementById('doctorEmail').value;
        db.collection('doctors').doc(doctorEmail).set({
            hasAccess: true,
            grantedBy: currentUser.email,
            grantedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert(`Access granted to ${doctorEmail}`);
            updateDoctorList();
        })
        .catch(error => console.error("Error granting access:", error));
    }

    function revokeAccess() {
        const doctorEmail = document.getElementById('doctorEmail').value;
        db.collection('doctors').doc(doctorEmail).update({
            hasAccess: false,
            revokedBy: currentUser.email,
            revokedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert(`Access revoked for ${doctorEmail}`);
            updateDoctorList();
        })
        .catch(error => console.error("Error revoking access:", error));
    }

    function updateDoctorList() {
        const doctorList = document.getElementById('doctorList');
        doctorList.innerHTML = '';
        db.collection('doctors').where('hasAccess', '==', true).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const li = document.createElement('li');
                    li.textContent = doc.id;
                    doctorList.appendChild(li);
                });
            })
            .catch(error => console.error("Error updating doctor list:", error));
    }
    function setPassword() {
        const newPassword = document.getElementById('new-password').value;
        firebase.auth().currentUser.updatePassword(newPassword).then(() => {
            alert('Password set successfully');
            checkUserRole(firebase.auth().currentUser.email);
        }).catch((error) => {
            console.error("Error setting password:", error);
            alert('Failed to set password. Please try again.');
        });
}

document.getElementById('setPasswordButton').addEventListener('click', setPassword);
});
