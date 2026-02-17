// TAB NAVIGATION
function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

// 1. TRACKER
const amalList = [
    {id:'w1', txt:'Sholat 5 Waktu', type:'Wajib'},
    {id:'w2', txt:'Puasa Ramadan', type:'Wajib'},
    {id:'s1', txt:'Sholat Tarawih', type:'Sunnah'},
    {id:'s2', txt:'Tilawah 1 Juz', type:'Sunnah'},
    {id:'s3', txt:'Sedekah Subuh', type:'Sunnah'}
];
function renderTracker() {
    let saved = JSON.parse(localStorage.getItem('amalTracker')) || {};
    document.getElementById('tab-tracker').innerHTML = `
        <div class="card-light">
            <h4 style="margin-bottom:15px;">Amal Yaumi (Harian)</h4>
            ${amalList.map(item => `
                <div style="display:flex; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
                    <input type="checkbox" id="${item.id}" ${saved[item.id]?'checked':''} 
                        onchange="toggleAmal('${item.id}')" style="width:20px; height:20px; accent-color:var(--primary); margin-right:15px;">
                    <div>
                        <div style="font-weight:600;">${item.txt}</div>
                        <small style="color:${item.type==='Wajib'?'red':'#888'}">${item.type}</small>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
function toggleAmal(id) {
    let saved = JSON.parse(localStorage.getItem('amalTracker')) || {};
    saved[id] = document.getElementById(id).checked;
    localStorage.setItem('amalTracker', JSON.stringify(saved));
}

// 2. JADWAL
function renderJadwal() {
    document.getElementById('tab-jadwal').innerHTML = `
        <div class="card-light">
            <h4>Jadwal Imsakiyah (Jakarta)</h4>
            <table class="prayer-table">
                <thead><tr><th>Tgl</th><th>Imsak</th><th>Subuh</th><th>Maghrib</th></tr></thead>
                <tbody>
                    <tr><td>1 Ram</td><td style="color:var(--primary)">04:29</td><td>04:39</td><td style="color:red">18:15</td></tr>
                    <tr><td>2 Ram</td><td style="color:var(--primary)">04:29</td><td>04:39</td><td style="color:red">18:15</td></tr>
                    <tr><td>3 Ram</td><td style="color:var(--primary)">04:29</td><td>04:39</td><td style="color:red">18:15</td></tr>
                </tbody>
            </table>
        </div>
    `;
}

// 3. DOA
function renderDoa() {
    document.getElementById('tab-doa').innerHTML = `
        <div class="card-light">
            <h4>Niat Puasa</h4>
            <p style="font-family:'Amiri'; font-size:24px; text-align:right; margin:10px 0;">نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ</p>
            <p style="font-style:italic;">Nawaitu shauma ghadin...</p>
        </div>
        <div class="card-light">
            <h4>Doa Berbuka</h4>
            <p style="font-family:'Amiri'; font-size:24px; text-align:right; margin:10px 0;">اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ</p>
            <p style="font-style:italic;">Allahumma laka shumtu...</p>
        </div>
    `;
}

// 4. ZAKAT
function renderZakat() {
    document.getElementById('tab-zakat').innerHTML = `
        <div class="card-light">
            <h4>Kalkulator Zakat Fitrah</h4>
            <div style="margin:10px 0;">
                <label>Harga Beras/Kg</label>
                <input type="number" id="harga-beras" value="15000" oninput="calcZakat()" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px;">
            </div>
            <div style="margin:10px 0;">
                <label>Jumlah Jiwa</label>
                <input type="number" id="jml-jiwa" value="1" oninput="calcZakat()" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px;">
            </div>
            <div style="background:#e8f5e9; padding:15px; border-radius:10px; text-align:center; margin-top:15px;">
                <small>Total Bayar</small>
                <h2 id="total-zakat" style="color:var(--primary); margin:0;">Rp 37.500</h2>
            </div>
        </div>
    `;
}
function calcZakat() {
    const h = document.getElementById('harga-beras').value;
    const j = document.getElementById('jml-jiwa').value;
    const tot = (h * 2.5) * j;
    document.getElementById('total-zakat').innerText = "Rp " + tot.toLocaleString('id-ID');
}

// 5. RAPOR
function renderRapor() {
    document.getElementById('tab-rapor').innerHTML = `
        <div class="rapor-card">
            <div style="font-size:50px; margin-bottom:10px;">🏆</div>
            <h3>Rapor Ramadan Kamu</h3>
            <div style="background:white; color:#333; padding:10px; border-radius:10px; margin:20px 0;">
                <small>PREDIKAT</small>
                <h4>Sangat Baik ⭐</h4>
            </div>
            <button class="btn-download" onclick="alert('Mendownload Rapor...')">Download Gambar</button>
        </div>
    `;
}

// INIT ALL
document.addEventListener('DOMContentLoaded', () => {
    renderTracker(); renderJadwal(); renderDoa(); renderZakat(); renderRapor();
});

// TASBIH LOGIC
let tCount = 0;
function countTasbih() {
    tCount++;
    document.getElementById('tasbih-number').innerText = tCount;
    if(navigator.vibrate) navigator.vibrate(40);
}
function resetTasbih(e) {
    e.stopPropagation(); tCount = 0;
    document.getElementById('tasbih-number').innerText = 0;
}
