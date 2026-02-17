// GANTI DENGAN CONFIG FIREBASE KAMU
const firebaseConfig = {
    apiKey: "GANTI_API_KEY_DISINI",
    authDomain: "GANTI_PROJECT_ID.firebaseapp.com",
    projectId: "GANTI_PROJECT_ID",
    storageBucket: "GANTI_PROJECT_ID.appspot.com",
    messagingSenderId: "GANTI_MESSAGING_ID",
    appId: "GANTI_APP_ID"
};

// Initialize
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function loginGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((res) => {
        updateUI(res.user);
    }).catch(err => console.error(err));
}

function logoutGoogle() {
    auth.signOut().then(() => {
        location.reload();
    });
}

function updateUI(user) {
    // Desktop
    const name = user.displayName;
    const pic = `<img src="${user.photoURL}" style="width:100%; height:100%; border-radius:50%;">`;
    
    // Mobile Elements
    if(document.getElementById('user-name-mobile')) document.getElementById('user-name-mobile').innerText = name;
    if(document.getElementById('user-avatar-mobile')) document.getElementById('user-avatar-mobile').innerHTML = pic;
    
    // Account Page Elements
    if(document.getElementById('acc-name')) document.getElementById('acc-name').innerText = name;
    if(document.getElementById('acc-email')) document.getElementById('acc-email').innerText = user.email;
    if(document.getElementById('btn-login')) document.getElementById('btn-login').classList.add('hidden');
    if(document.getElementById('btn-logout')) document.getElementById('btn-logout').classList.remove('hidden');
}

auth.onAuthStateChanged(user => {
    if(user) updateUI(user);
});
