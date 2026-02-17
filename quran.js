const API_URL = "https://equran.id/api/v2";
let allSurahs = [];
let currentSurah = null;
let audioPlayer = new Audio();
let isPlaying = false;
let settings = {
    arabSize: 30,
    latinSize: 14,
    showLatin: true,
    showTrans: true,
    tajwid: true
};

// INIT
document.addEventListener('DOMContentLoaded', () => {
    fetchSurahs();
    loadLastRead();
});

// FETCH DATA
async function fetchSurahs() {
    try {
        const res = await fetch(`${API_URL}/surat`);
        const json = await res.json();
        allSurahs = json.data;
        renderSurahs(allSurahs);
    } catch(e) { document.querySelector('.loading').innerText = "Gagal memuat data."; }
}

function renderSurahs(data) {
    document.getElementById('surah-list-container').innerHTML = data.map(s => `
        <div class="surah-card" onclick="openSurah(${s.nomor})">
            <div class="surah-number">${s.nomor}</div>
            <div style="flex:1;">
                <div style="font-weight:600; font-size:16px;">${s.namaLatin}</div>
                <div style="font-size:12px; color:#888;">${s.arti} • ${s.jumlahAyat} Ayat</div>
            </div>
            <div class="surah-arabic">${s.nama}</div>
        </div>
    `).join('');
}

// BACA SURAT
async function openSurah(nomor) {
    switchPage('read-view');
    document.getElementById('ayah-container').innerHTML = '<div style="text-align:center; padding:50px;">Memuat Ayat...</div>';
    
    try {
        const res = await fetch(`${API_URL}/surat/${nomor}`);
        const json = await res.json();
        currentSurah = json.data;
        
        document.getElementById('current-surah-name').innerText = currentSurah.namaLatin;
        saveLastRead(currentSurah.namaLatin, nomor, 1); // Simpan progress
        
        // Render Ayat
        document.getElementById('ayah-container').innerHTML = currentSurah.ayat.map((a, i) => `
            <div class="ayah-item" id="ayah-${i}">
                <div class="flex-between" style="margin-bottom:10px;">
                    <span style="background:#222; padding:4px 10px; border-radius:10px; font-size:12px; color:var(--primary);">${currentSurah.nomor}:${a.nomorAyat}</span>
                    <i class="fas fa-play" onclick="playAudio(${i}, '${a.audio['05']}')" style="color:#555; cursor:pointer;"></i>
                </div>
                <div class="ayah-arabic" style="font-size:${settings.arabSize}px;">
                    ${settings.tajwid ? applyTajwid(a.teksArab) : a.teksArab}
                </div>
                <div class="ayah-latin ${settings.showLatin?'':'hidden'}" style="font-size:${settings.latinSize}px;">${a.teksLatin}</div>
                <div class="ayah-translation ${settings.showTrans?'':'hidden'}" style="font-size:${settings.latinSize}px;">${a.teksIndonesia}</div>
            </div>
        `).join('');
        
    } catch(e) { alert("Gagal memuat ayat."); }
}

// TAJWID ENGINE
function applyTajwid(text) {
    text = text.replace(/([نم])[\u0651]/g, '<span class="t-rule c-ghunnah" onclick="vib()">$&</span>');
    text = text.replace(/([بجدطق])\u0652/g, '<span class="t-rule c-qalqalah" onclick="vib()">$&</span>');
    text = text.replace(/[\u0653]/g, '<span class="t-rule c-mad" onclick="vib()">$&</span>');
    text = text.replace(/[\u064B\u064C\u064D]/g, '<span class="t-rule c-ikhfa" onclick="vib()">$&</span>');
    return text;
}
function vib() { if(navigator.vibrate) navigator.vibrate(30); }

// AUDIO
function playAudio(idx, url) {
    if(audioPlayer.src !== url) audioPlayer.src = url;
    audioPlayer.play();
    document.querySelectorAll('.ayah-item').forEach(e => e.classList.remove('playing'));
    document.getElementById(`ayah-${idx}`).classList.add('playing');
    isPlaying = true;
    document.getElementById('btn-header-play').className = "fas fa-pause";
}
function toggleAudio() {
    if(isPlaying) { audioPlayer.pause(); isPlaying = false; document.getElementById('btn-header-play').className = "fas fa-play"; }
    else { audioPlayer.play(); isPlaying = true; document.getElementById('btn-header-play').className = "fas fa-pause"; }
}

// UI HELPERS
function backToHome() { switchPage('dashboard'); if(isPlaying) audioPlayer.pause(); }
function filterSurah() {
    const q = document.getElementById('search-input').value.toLowerCase();
    renderSurahs(allSurahs.filter(s => s.namaLatin.toLowerCase().includes(q)));
}
function switchPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    // Simple nav active logic can be added here
}

// SETTINGS UI
function openSettings() { document.getElementById('modal-settings').style.display = 'block'; }
function closeSettings() { document.getElementById('modal-settings').style.display = 'none'; }

function updateFontSize(val, type) {
    if(type === 'arab') {
        settings.arabSize = val;
        document.querySelectorAll('.ayah-arabic').forEach(e => e.style.fontSize = val + 'px');
    } else {
        settings.latinSize = val;
        document.querySelectorAll('.ayah-latin, .ayah-translation').forEach(e => e.style.fontSize = val + 'px');
    }
}
function toggleView(type) {
    const el = type === 'latin' ? '.ayah-latin' : '.ayah-translation';
    const checked = event.target.checked;
    settings[type === 'latin' ? 'showLatin' : 'showTrans'] = checked;
    document.querySelectorAll(el).forEach(e => e.classList.toggle('hidden', !checked));
}
function toggleTajwid() {
    settings.tajwid = document.getElementById('toggle-tajwid').checked;
    if(currentSurah) openSurah(currentSurah.nomor); // Reload text
}

// LOCAL STORAGE LAST READ
function saveLastRead(name, no, ayah) {
    localStorage.setItem('lastRead', JSON.stringify({name, no, ayah}));
    loadLastRead();
    // Jika login, simpan ke Firebase (panggil fungsi di auth.js jika ada)
    if(typeof saveProgressToFirebase === 'function') saveProgressToFirebase(no, ayah, name);
}
function loadLastRead() {
    const last = JSON.parse(localStorage.getItem('lastRead'));
    const div = document.getElementById('last-read-container');
    if(last) div.innerHTML = `
        <div style="margin:15px; padding:15px; background:#1a1a1a; border-radius:12px; border:1px solid #333; display:flex; justify-content:space-between; align-items:center;" onclick="openSurah(${last.no})">
            <div><small style="color:#888;">Terakhir Dibaca</small><h4 style="color:var(--primary); margin-top:2px;">${last.name}</h4></div>
            <i class="fas fa-chevron-right"></i>
        </div>`;
}
