// =============================================
// DATA DUMMY
// =============================================
var sumberData = [
    { timestamp: "2026-06-21T10:00:00", suhu: 28.4 },
    { timestamp: "2026-06-21T10:00:10", suhu: 28.6 },
    { timestamp: "2026-06-21T10:00:20", suhu: 29.1 },
    { timestamp: "2026-06-21T10:00:30", suhu: 27.5 },
    { timestamp: "2026-06-21T10:00:40", suhu: 26.8 },
    { timestamp: "2026-06-21T10:00:50", suhu: 30.2 },
    { timestamp: "2026-06-21T10:01:00", suhu: 25.5 },
    { timestamp: "2026-06-21T10:01:10", suhu: 26.1 },
    { timestamp: "2026-06-21T10:01:20", suhu: 26.5 }
];

var dataMingguan = [
    { hari: "Senin",   label: "hangat",  suhu: 29.3, warna: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
    { hari: "Selasa",  label: "dingin",  suhu: 24.8, warna: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
    { hari: "Rabu",    label: "hangat",  suhu: 30.1, warna: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
    { hari: "Kamis",   label: "normal",  suhu: 27.5, warna: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
    { hari: "Jumat",   label: "panas",   suhu: 31.2, warna: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    { hari: "Sabtu",   label: "sejuk",   suhu: 26.0, warna: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
    { hari: "Minggu",  label: "normal",  suhu: 28.0, warna: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" }
];

var dataPerangkat = [
    { nama: "Sensor Ruang Tamu",  id: "SRK-001", suhu: 28.4 },
    { nama: "Sensor Kamar Tidur", id: "SRK-002", suhu: 26.1 },
    { nama: "Sensor Dapur",       id: "SRK-003", suhu: 30.5 }
];

// =============================================
// STATE
// =============================================
var idx = 0;
var chartHome = null;
var chartStat = null;
var interval = null;
var allSuhu = [];
var tabNow = 'home';

// =============================================
// NAVIGASI HALAMAN
// =============================================
function pindah(id) {
    // Sembunyikan semua halaman biasa
    document.querySelectorAll('.halaman').forEach(function(el) {
        el.style.display = 'none';
        el.classList.remove('aktif');
    });
    // Sembunyikan halaman utama juga
    var hu = document.getElementById('halaman-utama');
    hu.style.display = 'none';
    hu.classList.remove('aktif');

    if (id === 'halaman-utama') {
        hu.style.display = 'flex';
        hu.classList.add('aktif');
        mulaiSensor();
        renderMingguan();
        renderPerangkat();
    } else {
        var el = document.getElementById(id);
        if (el) {
            el.style.display = 'flex';
            el.classList.add('aktif');
        }
    }
}

function simulasiKoneksi() {
    var berhasil = Math.random() > 0.5;
    if (berhasil) {
        pindah('halaman-berhasil');
        setTimeout(function() { pindah('halaman-utama'); }, 2000);
    } else {
        pindah('halaman-gagal');
    }
}

// =============================================
// BOTTOM NAV
// =============================================
function gantiTab(nama) {
    document.querySelectorAll('.tab-konten').forEach(function(el) {
        el.style.display = 'none';
        el.classList.remove('aktif');
    });
    var tab = document.getElementById('tab-' + nama);
    if (tab) {
        tab.style.display = 'flex';
        tab.classList.add('aktif');
    }

    document.querySelectorAll('.nav-btn').forEach(function(btn) {
        btn.classList.remove('on');
    });
    var btn = document.getElementById('nav-' + nama);
    if (btn) btn.classList.add('on');

    tabNow = nama;
    if (nama === 'statistik') updateStatistik();
}

// =============================================
// RENDER MINGGUAN
// =============================================
function renderMingguan() {
    var c = document.getElementById('list-mingguan');
    if (!c) return;
    c.innerHTML = '';
    dataMingguan.forEach(function(d) {
        var el = document.createElement('div');
        el.style.cssText = 'background:' + d.bg + ';border:1px solid ' + d.border + ';border-radius:14px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;';
        el.innerHTML = '<div>' +
            '<p style="font-weight:600;color:#1f2937;font-size:14px;margin:0;">' + d.hari + ' <span style="color:' + d.warna + ';">' + d.label + '</span></p>' +
            '<p style="font-size:11px;color:#9ca3af;margin:4px 0 0;">dengan rata-rata suhu</p>' +
            '</div>' +
            '<p style="font-size:26px;font-weight:700;color:' + d.warna + ';margin:0;">' + d.suhu.toString().replace('.', ',') + '</p>';
        c.appendChild(el);
    });
}

// =============================================
// RENDER PERANGKAT
// =============================================
function renderPerangkat() {
    var c = document.getElementById('list-perangkat');
    if (!c) return;
    c.innerHTML = '';
    dataPerangkat.forEach(function(p) {
        var warna = p.suhu >= 30 ? '#dc2626' : p.suhu <= 26 ? '#3b82f6' : '#15803d';
        var el = document.createElement('div');
        el.style.cssText = 'background:white;border:1px solid #f1f5f9;border-radius:14px;padding:16px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 1px 4px rgba(0,0,0,0.06);';
        el.innerHTML = '<div style="display:flex;align-items:center;gap:12px;">' +
            '<div style="width:40px;height:40px;background:#dcfce7;border-radius:10px;display:flex;align-items:center;justify-content:center;">' +
            '<svg width="20" height="20" fill="none" stroke="#15803d" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>' +
            '</div>' +
            '<div><p style="font-weight:600;color:#1f2937;font-size:14px;margin:0;">' + p.nama + '</p>' +
            '<p style="font-size:11px;color:#9ca3af;margin:2px 0 0;">' + p.id + '</p></div>' +
            '</div>' +
            '<div style="text-align:right;">' +
            '<p style="font-size:28px;font-weight:700;color:' + warna + ';margin:0;">' + p.suhu.toString().replace('.', ',') + '</p>' +
            '<p style="font-size:11px;color:#9ca3af;margin:0;">°C</p>' +
            '</div>';
        c.appendChild(el);
    });
}

// =============================================
// GRAFIK & SENSOR
// =============================================
function buatGrafikHome() {
    var ctx = document.getElementById('grafikHome').getContext('2d');
    chartHome = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ data: [], borderColor: '#15803d', backgroundColor: 'rgba(21,128,61,0.08)', borderWidth: 2, tension: 0.4, pointBackgroundColor: '#fff', pointBorderColor: '#15803d', pointRadius: 3, fill: true }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 24, max: 32, ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 9 } } } } }
    });
}

function buatGrafikStatistik() {
    var ctx = document.getElementById('grafikStatistik').getContext('2d');
    chartStat = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ data: [], borderColor: '#15803d', backgroundColor: 'rgba(21,128,61,0.08)', borderWidth: 2, tension: 0.4, pointBackgroundColor: '#fff', pointBorderColor: '#15803d', pointRadius: 4, fill: true }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 24, max: 32 }, x: { ticks: { font: { size: 10 } } } } }
    });
}

function ambilData() {
    if (idx >= sumberData.length) idx = 0;
    var d = sumberData[idx];
    allSuhu.push(d.suhu);

    var el = document.getElementById('suhu-utama');
    if (el) el.textContent = d.suhu.toString().replace('.', ',');

    dataPerangkat[0].suhu = d.suhu;
    if (tabNow === 'perangkat') renderPerangkat();

    var label = d.timestamp.split('T')[1];

    if (chartHome) {
        chartHome.data.labels.push(label);
        chartHome.data.datasets[0].data.push(d.suhu);
        if (chartHome.data.labels.length > 7) { chartHome.data.labels.shift(); chartHome.data.datasets[0].data.shift(); }
        chartHome.update();
    }
    if (chartStat) {
        chartStat.data.labels.push(label);
        chartStat.data.datasets[0].data.push(d.suhu);
        if (chartStat.data.labels.length > 7) { chartStat.data.labels.shift(); chartStat.data.datasets[0].data.shift(); }
        chartStat.update();
    }

    if (tabNow === 'statistik') updateStatistik();
    idx++;
}

function updateStatistik() {
    if (!allSuhu.length) return;
    var max = Math.max.apply(null, allSuhu);
    var min = Math.min.apply(null, allSuhu);
    var avg = allSuhu.reduce(function(a,b){return a+b;},0) / allSuhu.length;
    var eMax = document.getElementById('stat-max');
    var eMin = document.getElementById('stat-min');
    var eAvg = document.getElementById('stat-avg');
    var eCnt = document.getElementById('stat-count');
    if (eMax) eMax.textContent = max.toString().replace('.', ',');
    if (eMin) eMin.textContent = min.toString().replace('.', ',');
    if (eAvg) eAvg.textContent = avg.toFixed(1).replace('.', ',');
    if (eCnt) eCnt.textContent = allSuhu.length;
}

function mulaiSensor() {
    idx = 0; allSuhu = [];
    if (!chartHome) buatGrafikHome();
    else { chartHome.data.labels = []; chartHome.data.datasets[0].data = []; chartHome.update(); }
    if (!chartStat) buatGrafikStatistik();
    else { chartStat.data.labels = []; chartStat.data.datasets[0].data = []; chartStat.update(); }
    ambilData();
    if (interval) clearInterval(interval);
    interval = setInterval(ambilData, 10000);
}

// =============================================
// LOGOUT
// =============================================
function konfirmasiLogout() {
    document.getElementById('modal-logout').style.display = 'flex';
}
function tutupModal() {
    document.getElementById('modal-logout').style.display = 'none';
}
function doLogout() {
    tutupModal();
    if (interval) { clearInterval(interval); interval = null; }
    if (chartHome) { chartHome.destroy(); chartHome = null; }
    if (chartStat) { chartStat.destroy(); chartStat = null; }
    pindah('halaman-login');
}