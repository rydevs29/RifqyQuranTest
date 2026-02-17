const API_URL = "https://equran.id/api/v2";
let allSurahs = [];
let currentAudio = null;
let settings = {
    fontSize: 30,
    tajwid: true
};

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    fetchSurahs();
    loadLastRead();
});

// 1. FETCH & RENDER SURAT
async function fetchSurahs() {
    try {
        const res = await fetch(`${API_URL}/surat`);
        const json = await res.json();
        allSurahs = json.data;
        renderSurahs(allSurahs);
    } catch (e) {
        document.getElementById('surah-list-container').innerHTML = '<p style="text-align:center; padding:20px;">Gagal memuat. Cek internet.</p>';
    }
}

function renderSurahs(data) {
    const container = document.getElementById('surah-list-container');
    container.innerHTML = data.map(s => `
        <div class="surah-card" onclick="openSurah(${s.nomor})">
            <div class="surah-number">${s.nomor}</div>
            <div class="surah-info">
                <div style="font-weight:600; font-size:16px;">${s.namaLatin}</div>
                <div style="font-size:12px; color:#888;">${s.arti} • ${s.jumlahAyat} Ayat</div>
            </div>
            <div class="surah-name-arabic">${s.nama}</div>
        </div>
    `).join('');
}

function filterSurah() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = allSurahs.filter(s => s.namaLatin.toLowerCase().includes(query));
    renderSurahs(filtered);
}

// 2. BUKA SURAT & RENDER AYAT
async function openSurah(nomor) {
    switchPage('read-view');
    const container = document.getElementById('ayah-container');
    container.innerHTML = '<div class="loading" style="text-align:center; padding:50px;">Memuat Ayat...</div>';
    
    try {
        const res = await fetch(`${API_URL}/surat/${nomor}`);
        const json = await res.json();
        const data = json.data;
        
        document.getElementById('current-surah-name').innerText = data.namaLatin;
        
        // Simpan Terakhir Baca
        localStorage.setItem('lastRead', JSON.stringify({ name: data.namaLatin, no: nomor, ayah: 1 }));
        loadLastRead();

        // Render Ayat
        container.innerHTML = data.ayat.map(a => `
            <div class="ayah-item">
                <div class="ayah-actions" style="margin-bottom:10px; display:flex; gap:10px;">
                    <span style="background:#222; padding:2px 8px; border-radius:4px; font-size:12px;">${a.nomorAyat}</span>
                </div>
                <div class="ayah-arabic" style="font-size:${settings.fontSize}px;">
                    ${settings.tajwid ? applyTajwid(a.teksArab) : a.teksArab}
                </div>
                <div class="ayah-translation">${a.teksIndonesia}</div>
            </div>
        `).join('');
        
    } catch (e) {
        alert("Gagal memuat ayat.");
    }
}

// 3. MESIN TAJWID (Versi Ultimate)
function applyTajwid(text) {
    // Allah
    text = text.replace(/اللّٰه/g, '<span class="t-rule c-allah">$&</span>');
    // Ghunnah (Nun/Mim Tasydid)
    text = text.replace(/([نم])[\u0651]/g, '<span class="t-rule c-ghunnah">$&</span>');
    // Qalqalah
    text = text.replace(/([بجدطق])\u0652/g, '<span class="t-rule c-qalqalah">$&</span>');
    // Mad Wajib/Jaiz
    text = text.replace(/[\u0653]/g, '<span class="t-rule c-mad">$&</span>');
    // Iqlab
    text = text.replace(/[\u06E2]/g, '<span class="t-rule tj-iqlab">$&</span>');
    // Ikhfa (Tanwin)
    text = text.replace(/[\u064B\u064C\u064D]/g, '<span class="t-rule tj-ikhfa">$&</span>');
    return text;
}

// 4. NAVIGASI
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if(pageId === 'dashboard') document.querySelector('.nav-item:nth-child(1)').classList.add('active');
}

function loadLastRead() {
    const last = JSON.parse(localStorage.getItem('lastRead'));
    const container = document.getElementById('last-read-container');
    if(last) {
        container.innerHTML = `
        <div style="margin:15px; padding:15px; background:#1a1a1a; border-radius:12px; border:1px solid #333; display:flex; justify-content:space-between; align-items:center;" onclick="openSurah(${last.no})">
            <div>
                <small style="color:#888;">Terakhir Dibaca</small>
                <h4 style="color:var(--primary); margin-top:2px;">${last.name}</h4>
            </div>
            <i class="fas fa-chevron-right" style="color:#555;"></i>
        </div>`;
    }
}

// 5. SETTINGS
function openSettings() { document.getElementById('modal-settings').style.display = 'block'; }
function closeSettings() { document.getElementById('modal-settings').style.display = 'none'; }
function updateFontSize(val) {
    settings.fontSize = val;
    document.querySelectorAll('.ayah-arabic').forEach(el => el.style.fontSize = val + 'px');
}
function toggleTajwid() {
    settings.tajwid = !settings.tajwid;
    // Reload surah if currently reading (optional logic, simplifed here)
    alert("Silakan buka ulang surat untuk melihat perubahan Tajwid.");
}
