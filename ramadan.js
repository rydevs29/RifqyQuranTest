// 1. ZAKAT CALCULATOR
function hitungZakat() {
    // Fitrah
    const hargaBeras = document.getElementById('harga-beras').value || 0;
    const jiwa = document.getElementById('jumlah-jiwa').value || 0;
    const totalFitrah = (2.5 * hargaBeras) * jiwa;
    document.getElementById('total-zakat').innerText = "Rp " + totalFitrah.toLocaleString('id-ID');

    // Maal
    const harta = document.getElementById('total-harta').value || 0;
    const totalMaal = harta * 0.025; // 2.5%
    document.getElementById('total-maal').innerText = "Rp " + totalMaal.toLocaleString('id-ID');
}

// 2. TABS NAVIGATOR
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 3. AMAL YAUMI TRACKER
const amalData = [
    { id: 's1', text: 'Sholat Subuh' },
    { id: 's2', text: 'Sholat Dzuhur' },
    { id: 's3', text: 'Sholat Ashar' },
    { id: 's4', text: 'Sholat Maghrib' },
    { id: 's5', text: 'Sholat Isya' },
    { id: 's6', text: 'Tilawah Quran' },
    { id: 's7', text: 'Sedekah' }
];

function initTracker() {
    const list = document.getElementById('amal-list');
    let saved = JSON.parse(localStorage.getItem('amalTracker')) || {};
    
    list.innerHTML = amalData.map(item => `
        <div style="display:flex; align-items:center; padding:12px; border-bottom:1px solid #222;">
            <input type="checkbox" id="${item.id}" ${saved[item.id] ? 'checked' : ''} 
                onchange="toggleAmal('${item.id}')" 
                style="width:20px; height:20px; accent-color:#00A86B; margin-right:15px;">
            <label for="${item.id}" style="font-size:14px;">${item.text}</label>
        </div>
    `).join('');
    
    updateProgress();
}

function toggleAmal(id) {
    let saved = JSON.parse(localStorage.getItem('amalTracker')) || {};
    saved[id] = document.getElementById(id).checked;
    localStorage.setItem('amalTracker', JSON.stringify(saved));
    updateProgress();
}

function updateProgress() {
    let saved = JSON.parse(localStorage.getItem('amalTracker')) || {};
    let checkedCount = Object.values(saved).filter(v => v).length;
    document.getElementById('amal-count').innerText = `${checkedCount}/${amalData.length}`;
}

// 4. COUNTDOWN TIMER (Simulasi)
setInterval(() => {
    const now = new Date();
    // Target Maghrib (Contoh 18:15)
    const target = new Date();
    target.setHours(18, 15, 0);
    
    if(now > target) target.setDate(target.getDate() + 1);
    
    const diff = target - now;
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('countdown-timer').innerText = 
        `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}, 1000);

// Jalankan Tracker saat load
document.addEventListener('DOMContentLoaded', initTracker);
