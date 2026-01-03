document.addEventListener('DOMContentLoaded', function() {
    auth.onAuthStateChanged(function(user) {
        const guestView = document.getElementById('guestView');
        const userView = document.getElementById('userView');
        const loadingView = document.getElementById('loadingView');
        
        if (user) {
            guestView.style.display = 'none';
            loadingView.style.display = 'none';
            userView.style.display = 'block';
            
            document.getElementById('userName').textContent = user.displayName || 'User';
            document.getElementById('userEmail').textContent = user.email;
            
        } else {
            userView.style.display = 'none';
            loadingView.style.display = 'none';
            guestView.style.display = 'block';
        }
    });
    
    document.getElementById('loadingView').style.display = 'block';
});

window.showAuthForm = function(formType) {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (formType === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('createForm').style.display = 'none';
    } else if (formType === 'create') {
        tabs[1].classList.add('active');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('createForm').style.display = 'block';
    }
};

window.login = async function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('Successfully signed in!');
    } catch (error) {
        alert(getAuthErrorMessage(error));
    }
};

window.createAccount = async function() {
    const name = document.getElementById('createName').value;
    const email = document.getElementById('createEmail').value;
    const password = document.getElementById('createPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        await userCredential.user.updateProfile({ displayName: name });
        
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert('Account created successfully!');
        showAuthForm('login');
        
    } catch (error) {
        alert(getAuthErrorMessage(error));
    }
};

window.logout = async function() {
    try {
        await auth.signOut();
        alert('Successfully signed out');
        window.location.href = 'account.html';
    } catch (error) {
        alert('Failed to sign out');
    }
};

function getAuthErrorMessage(error) {
    const messages = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-not-found': 'No account found',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/weak-password': 'Password too weak',
        'auth/too-many-requests': 'Too many attempts. Try later'
    };
    
    return messages[error.code] || 'An error occurred';
}