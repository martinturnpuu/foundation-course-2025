
const firebaseConfig = {
  apiKey: "AIzaSyBQShXrKtOzFDsNj3jkMly54iu-fmc1n8U",
  authDomain: "vinylshop-49e04.firebaseapp.com",
  projectId: "vinylshop-49e04",
  storageBucket: "vinylshop-49e04.firebasestorage.app",
  messagingSenderId: "981929603856",
  appId: "1:981929603856:web:9b0ded17e37d9dcaf5ab95",
  measurementId: "G-YVX9ZKC974"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const auth = firebase.auth();
const db = firebase.firestore();

window.auth = auth;
window.db = db;

console.log("Firebase initialized successfully");

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User signed in:", user.email);
  } else {
    console.log("User signed out");
  }
});
