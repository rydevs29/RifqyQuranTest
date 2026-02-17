// KONFIGURASI FIREBASE (GANTI DENGAN PUNYA KAMU DARI FIREBASE CONSOLE)
const firebaseConfig = {
    apiKey: "ISI_API_KEY_DISINI",
    authDomain: "ISI_PROJECT_ID.firebaseapp.com",
    projectId: "ISI_PROJECT_ID",
    storageBucket: "ISI_PROJECT_ID.appspot.com",
    messagingSenderId: "ISI_MESSAGING_ID",
    appId: "ISI_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 1. LOGIN GOOGLE
function loginGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            updateUI(result.user);
            loadUserData(result.user.uid);
        }).catch((error) => console.error(error));
}

// 2. LOGOUT
function logoutGoogle() {
    auth.signOut().then(() => {
        document.getElementById('acc-name').innerText = "Belum Masuk";
        document.getElementById('acc-email').innerText = "Masuk untuk menyimpan progress.";
        document.getElementById('user-avatar').innerText = "R";
        document.getElementById('btn-login').classList.remove('hidden');
        document.getElementById('btn-logout').classList.add('hidden');
    });
}

// 3. UPDATE UI SETELAH LOGIN
function updateUI(user) {
    document.getElementById('acc-name').innerText = user.displayName;
    document.getElementById('acc-email').innerText = user.email;
    document.getElementById('user-name-display').innerText = user.displayName;
    document.getElementById('user-avatar').innerHTML = `<img src="${user.photoURL}" style="width:100%; height:100%; border-radius:50%;">`;
    
    document.getElementById('btn-login').classList.add('hidden');
    document.getElementById('btn-logout').classList.remove('hidden');
}

// 4. SIMPAN DATA KE FIRESTORE
function saveProgressToFirebase(surah, ayah, surahName) {
    const user = auth.currentUser;
    if (user) {
        db.collection("users").doc(user.uid).set({
            lastRead: { surah, ayah, surahName, date: new Date() }
        }, { merge: true });
    }
}

// 5. LOAD DATA SAAT BUKA WEB
auth.onAuthStateChanged((user) => {
    if (user) {
        updateUI(user);
        // Load progress terakhir dari cloud
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists && doc.data().lastRead) {
                const data = doc.data().lastRead;
                localStorage.setItem('lastRead', JSON.stringify({
                    name: data.surahName, no: data.surah, ayah: data.ayah
                }));
                loadLastRead(); // Update UI di Dashboard
            }
        });
    }
});
