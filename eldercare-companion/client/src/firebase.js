// firebase-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
      apiKey: "AIzaSyDQtea2bYeDQoMSv4kqI4vATFCXE2f7Y1o",
      authDomain: "elderlycare-bc048.firebaseapp.com",
      projectId: "elderlycare-bc048",
      storageBucket: "elderlycare-bc048.firebasestorage.app",
      messagingSenderId: "546743940118",
      appId: "1:546743940118:web:81b3cb1d0f93803e2ff137"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const userDocId = "userId"; // Always use this as the doc id

// Signup
window.signup = function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Create user profile in Firestore
      return setDoc(doc(db, "users", userDocId), {
        email: email,
        fullname: "",
        phone: "",
        address: ""
      }, { merge: true });
    })
    .then(() => {
      alert("Signup successful");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};

// Login
window.login = function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};

// Logout
window.logout = function () {
  signOut(auth)
    .then(() => {
      alert("Logged out");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};

// Auth State Check (optional redirect)
window.authCheck = function () {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
};

// Fetch and display user profile data in profile.html
window.loadUserProfile = function () {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    const userRef = doc(db, "users", userDocId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      if (document.getElementById("profile-name")) {
        document.getElementById("profile-name").value = data.fullname || user.displayName || "";
      }
      if (document.getElementById("profile-email")) {
        document.getElementById("profile-email").value = data.email || user.email || "";
      }
      if (document.getElementById("profile-phone")) {
        document.getElementById("profile-phone").value = data.phone || "";
      }
      if (document.getElementById("profile-address")) {
        document.getElementById("profile-address").value = data.address || "";
      }
    } else {
      // If no Firestore profile, fill with Auth data
      if (document.getElementById("profile-name")) {
        document.getElementById("profile-name").value = user.displayName || "";
      }
      if (document.getElementById("profile-email")) {
        document.getElementById("profile-email").value = user.email || "";
      }
      if (document.getElementById("profile-phone")) {
        document.getElementById("profile-phone").value = "";
      }
      if (document.getElementById("profile-address")) {
        document.getElementById("profile-address").value = "";
      }
    }
  });
};

// Save profile changes from profile.html
window.saveUserProfile = async function () {
  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in");
    return;
  }
  const fullname = document.getElementById("profile-name").value.trim();
  const phone = document.getElementById("profile-phone").value.trim();
  const address = document.getElementById("profile-address").value.trim();
  const email = document.getElementById("profile-email").value.trim();

  try {
    await setDoc(doc(db, "users", userDocId), {
      fullname,
      phone,
      address,
      email
    }, { merge: true });
    alert("Profile updated successfully!");
  } catch (err) {
    alert("Failed to update profile.");
  }
};
