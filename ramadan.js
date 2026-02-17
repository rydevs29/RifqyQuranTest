// DATABASE JADWAL PUASA 2026 (Simulasi Data untuk Jakarta)
// Asumsi 1 Ramadan = 17 Feb 2026
const startDate = new Date("2026-02-17"); 

function generateJadwalData() {
    let data = [];
    for (let i = 0; i < 30; i++) {
        let currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        // Simulasi pergeseran waktu semenit setiap beberapa hari
        let imsakMins = 28 - Math.floor(i/3); 
        let maghribMins = 15 - Math.floor(i/4);
        
        data.push({
            ramadan: i + 1,
            date: currentDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}),
            imsak: `04:${imsakMins.toString().padStart(2, '0')}`,
            subuh: `04:${(imsakMins+10).toString().padStart(2, '0')}`,
            maghrib: `18:${maghribMins.toString().padStart(2, '0')}`
        });
    }
    return data;
}

// DATABASE DOA (LENGKAP)
const doaData = [
    { title: "Niat Puasa (Harian)", arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلّٰهِ تَعَالَى", latin: "Nawaitu shauma ghadin 'an ada'i fardhi syahri Ramadhana hadzihis sanati lillahi ta'ala.", arti: "Aku niat puasa esok hari untuk menunaikan fardhu bulan Ramadan tahun ini, karena Allah Ta'ala." },
    { title: "Niat Puasa (Sebulan Penuh)", arab: "نَوَيْتُ صَوْمَ شَهْرِ رَمَضَانَ كُلِّهِ لِلّٰهِ تَعَالَى", latin: "Nawaitu shauma syahri ramadhana kullihi lillahi ta'ala", arti: "Aku niat puasa selama satu bulan penuh di bulan Ramadan karena Allah Ta'ala." },
    { title: "Doa Berbuka Puasa", arab: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ", latin: "Allahumma laka shumtu wa 'ala rizqika afthartu...", arti: "Ya Allah, untuk-Mu aku berpuasa, dan dengan rezeki-Mu aku berbuka..." },
    { title: "Doa Lailatul Qadar", arab: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni", arti: "Ya Allah, sesungguhnya Engkau Maha Pemaaf, Engkau menyukai permintaan maaf, maka maafkanlah aku." },
    { title: "Niat Sholat Tarawih (Makmum)", arab: "اُصَلِّى سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ مَأْمُوْمًا ِللهِ تَعَالَى", latin: "Ushalli sunnatat tarawihi rak'ataini mustaqbilal qiblati ma'muman lillahi ta'ala", arti: "Aku niat sholat sunnah tarawih dua rakaat menghadap kiblat sebagai makmum karena Allah Ta'ala." },
    { title: "Niat Sholat Witir (2 Rakaat)", arab: "اُصَلِّى سُنَّةَ مِنَ الْوِتْرِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ ِللهِ تَعَالَى", latin: "Ushalli sunnatan minal witri rak'ataini mustaqbilal qiblati lillahi ta'ala", arti: "Aku niat sholat sunnah witir dua rakaat menghadap kiblat karena Allah Ta'ala." }
];

// 1. RENDER JADWAL FULL 30 HARI
function renderJadwal() {
    const data = generateJadwalData();
    const today = new Date();
    const todayStr = today.toLocaleDateString('id-ID', {day: 'numeric', month: 'short'});
    
    document.getElementById('jadwal-body').innerHTML = data.map(d => {
        const isToday = d.date === todayStr;
        return `
        <tr class="${isToday ? 'today-row' : ''}">
            <td><div style="font-weight:bold">${d.date}</div><small style="color:#888">${d.ramadan} Ram</small></td>
            <td style="color:var(--primary)">${d.imsak}</td>
            <td>${d.subuh}</td>
            <td style="color:red">${d.maghrib}</td>
        </tr>`;
    }).join('');

    // Update Header Date
    document.getElementById('hijri-date-display').innerText = "17 Februari 2026";
}

// 2. RENDER DOA (ACCORDION)
function renderDoa() {
    document.getElementById('doa-list-container').innerHTML = doaData.map((d, i) => `
        <div class="doa-item">
            <div class="doa-header" onclick="toggleAccordion(${i})">
                <span>${d.title}</span>
                <i class="fas fa-chevron-down" id="icon-${i}"></i>
            </div>
            <div class="doa-body" id="body-${i}">
                <div class="doa-arabic">${d.arab}</div>
                <div style="font-style:italic; color:var(--primary); margin-bottom:5px;">${d.latin}</div>
                <div style="color:#555;">${d.arti}</div>
            </div>
        </div>
    `).join('');
}

function toggleAccordion(index) {
    const body = document.getElementById(`body-${index}`);
    const icon = document.getElementById(`icon-${index}`);
    if (body.classList.contains('open')) {
        body.classList.remove('open');
        icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
    } else {
        document.querySelectorAll('.doa-body').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('.doa-header i').forEach(el => el.classList.replace('fa-chevron-up', 'fa-chevron-down'));
        body.classList.add('open');
        icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
    }
}

// 3. TRACKER & ZAKAT (Sama seperti sebelumnya tapi di-render saat tab diklik)
function renderTracker() {
    const amalList = [
        {id:'w1', txt:'Sholat 5 Waktu', type:'Wajib'}, {id:'w2', txt:'Puasa Hari Ini', type:'Wajib'},
        {id:'s1', txt:'Sholat Tarawih', type:'Sunnah'}, {id:'s2', txt:'Tilawah 1 Juz', type:'Sunnah'},
        {id:'s3', txt:'Sedekah', type:'Sunnah'}
    ];
    let saved = JSON.parse(localStorage.getItem('amalTracker')) || {};
    
    document.getElementById('tab-tracker').innerHTML = `
        <div class="card-light">
            <h4>Checklist Amalan</h4>
            ${amalList.map(item => `
                <div style="display:flex; align-items:center; padding:12px 0; border-bottom:1px solid #eee;">
                    <input type="checkbox" id="${item.id}" ${saved[item.id]?'checked':''} 
                        onchange="toggleAmal('${item.id}')" style="width:20px; height:20px; accent-color:var(--primary); margin-right:15px;">
                    <label for="${item.id}" style="flex:1;">
                        <div style="font-weight:600;">${item.txt}</div>
                        <small style="color:${item.type==='Wajib'?'red':'#888'}">${item.type}</small>
                    </label>
                </div>
            `).join('')}
        </div>
    `;
}

function renderZakat() {
    document.getElementById('tab-zakat').innerHTML = `
        <div class="card-light">
            <h4>Kalkulator Zakat Fitrah</h4>
            <div style="margin:15px 0;">
                <label style="display:block; margin-bottom:5px; color:#666;">Harga Beras (Per Kg/Liter)</label>
                <input type="number" id="harga-beras" value="15000" oninput="calcZakat()" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px;">
            </div>
            <div style="margin:15px 0;">
                <label style="display:block; margin-bottom:5px; color:#666;">Jumlah Jiwa</label>
                <input type="number" id="jml-jiwa" value="1" oninput="calcZakat()" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px;">
            </div>
            <div style="background:#e8f5e9; padding:20px; border-radius:12px; text-align:center; border:1px solid var(--primary);">
                <small>Total Yang Harus Dibayar</small>
                <h2 id="total-zakat" style="color:var(--primary); margin:5px 0 0 0;">Rp 37.500</h2>
            </div>
        </div>
    `;
}

// HELPERS
function toggleAmal(id) {
    let saved = JSON.parse(localStorage.getItem('amalTracker')) || {};
    saved[id] = document.getElementById(id).checked;
    localStorage.setItem('amalTracker', JSON.stringify(saved));
}
function calcZakat() {
    const h = document.getElementById('harga-beras').value;
    const j = document.getElementById('jml-jiwa').value;
    const tot = (h * 2.5) * j;
    document.getElementById('total-zakat').innerText = "Rp " + tot.toLocaleString('id-ID');
}

// REAL-TIME COUNTDOWN (MAGHRIB/IMSAK)
setInterval(() => {
    const now = new Date();
    const target = new Date();
    // Set target ke Maghrib 18:15 (Simulasi)
    target.setHours(18, 15, 0);
    
    // Jika sudah lewat maghrib, target ke Imsak besok (04:28)
    let label = "MENUJU BERBUKA";
    if (now > target) {
        target.setDate(target.getDate() + 1);
        target.setHours(4, 28, 0);
        label = "MENUJU IMSAK";
    }

    const diff = target - now;
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown-timer').innerText = `${h}:${m}:${s}`;
    if(document.getElementById('label-countdown')) document.getElementById('label-countdown').innerText = label;
}, 1000);

// TAB SWITCHING
function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    renderJadwal();
    renderDoa();
    renderTracker();
    renderZakat();
});
