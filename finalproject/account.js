document.addEventListener('DOMContentLoaded', function () {
    auth.onAuthStateChanged(async function (user) {
        const guestView = document.getElementById('guestView');
        const userView = document.getElementById('userView');
        const loadingView = document.getElementById('loadingView');

        loadingView.style.display = 'block';

        if (user) {
            guestView.style.display = 'none';
            userView.style.display = 'block';
            loadingView.style.display = 'none';

            document.getElementById('userName').textContent = user.displayName || 'User';

            await loadUserPurchases(user.uid);
        } else {
            guestView.style.display = 'block';
            userView.style.display = 'none';
            loadingView.style.display = 'none';
        }
    });
});

window.showAuthForm = function (formType) {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    if (formType === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('createForm').style.display = 'none';
    } else {
        tabs[1].classList.add('active');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('createForm').style.display = 'block';
    }
};

window.login = async function () {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) return alert('Please fill in all fields');

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('Signed in successfully!');
    } catch (e) {
        alert(e.message);
    }
};

window.createAccount = async function () {
    const name = document.getElementById('createName').value;
    const email = document.getElementById('createEmail').value;
    const password = document.getElementById('createPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password || !confirmPassword) return alert('Please fill in all fields');
    if (password !== confirmPassword) return alert('Passwords do not match');

    try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: name });

        await db.collection('users').doc(cred.user.uid).set({
            name: name,
            email: email,
            createdAt: new Date(),
            purchasedVinyls: []
        });

        alert('Account created successfully!');
        showAuthForm('login');
    } catch (e) {
        alert(e.message);
    }
};

window.logout = async function () {
    await auth.signOut();
    window.location.reload();
};

async function loadUserPurchases(userId) {
    const container = document.getElementById('ordersList');
    container.innerHTML = 'Loading purchases...';

    try {
        const doc = await db.collection('users').doc(userId).get();
        const purchases = doc.data()?.purchasedVinyls || [];

        if (!purchases.length) {
            container.innerHTML = '<p>No purchases yet.</p>';
            return;
        }

        container.innerHTML = '';
        purchases.forEach(p => {
            const div = document.createElement('div');
            div.className = 'purchase-card';
            div.innerHTML = `
                <img src="${p.vinyl.image}" width="100">
                <div>
                    <h4>${p.vinyl.artist} – ${p.vinyl.title}</h4>
                    <p>Price: $${p.vinyl.price}</p>
                    <p>Status: ${p.status}</p>
                    <p>Order ID: ${p.orderId}</p>
                    <p>Date: ${p.purchaseDate?.toDate ? p.purchaseDate.toDate().toLocaleDateString() : ''}</p>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p>Error loading purchases</p>';
    }
}
