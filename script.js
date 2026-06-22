// --- LOGIKA NAVIGASI HALAMAN ---
function pindahHalaman(idHalamanTujuan) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.halaman').forEach(function(hal) {
        hal.classList.remove('aktif');
    });

    // Tampilkan halaman yang dituju
    var halamanTujuan = document.getElementById(idHalamanTujuan);
    if (halamanTujuan) {
        halamanTujuan.classList.add('aktif');
    } else {
        console.error('Halaman tidak ditemukan: ' + idHalamanTujuan);
    }

    // Jika masuk ke home, mulai jalankan data sensor
    if (idHalamanTujuan === 'halaman-home') {
        mulaiSensor();
    }
}

// --- SIMULASI KONEKSI WIFI ---
// 50% kemungkinan berhasil / gagal
function simulasiKoneksi() {
    var berhasil = Math.random() > 0.5;

    if (berhasil) {
        // Tampilkan halaman berhasil
        pindahHalaman('halaman-berhasil');

        // 2 detik kemudian otomatis pindah ke Home
        setTimeout(function() {
            pindahHalaman('halaman-home');
        }, 2000);
    } else {
        // Langsung ke halaman gagal
        pindahHalaman('halaman-gagal');
    }
}

// --- SUMBER DATA DUMMY ---
var sumberData = [
    { "timestamp": "2026-06-21T10:00:00", "suhu": 28.4 },
    { "timestamp": "2026-06-21T10:00:10", "suhu": 28.6 },
    { "timestamp": "2026-06-21T10:00:20", "suhu": 29.1 },
    { "timestamp": "2026-06-21T10:00:30", "suhu": 27.5 },
    { "timestamp": "2026-06-21T10:00:40", "suhu": 26.8 },
    { "timestamp": "2026-06-21T10:00:50", "suhu": 30.2 },
    { "timestamp": "2026-06-21T10:01:00", "suhu": 25.5 },
    { "timestamp": "2026-06-21T10:01:10", "suhu": 26.1 },
    { "timestamp": "2026-06-21T10:01:20", "suhu": 26.5 }
];

// --- VARIABEL GLOBAL ---
var indexDataSekarang = 0;
var chartSuhu = null;
var intervalSensor = null;

// --- INISIALISASI GRAFIK CHART.JS ---
function inisialisasiGrafik() {
    var ctx = document.getElementById('grafikSuhu').getContext('2d');
    chartSuhu = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Suhu (°C)',
                data: [],
                borderColor: '#15803d',
                backgroundColor: 'rgba(21, 128, 61, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#15803d',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 24,
                    max: 32
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// --- AMBIL DATA SUHU SETIAP 10 DETIK ---
function ambilDataSuhu() {
    if (indexDataSekarang >= sumberData.length) {
        indexDataSekarang = 0; // Reset ke awal
    }

    var dataBaru = sumberData[indexDataSekarang];

    // Update teks suhu utama di header
    var elSuhu = document.getElementById('suhu-utama');
    if (elSuhu) {
        elSuhu.innerText = dataBaru.suhu.toString().replace('.', ',');
    }

    // Update grafik
    var waktuLabel = dataBaru.timestamp.split('T')[1];
    chartSuhu.data.labels.push(waktuLabel);
    chartSuhu.data.datasets[0].data.push(dataBaru.suhu);

    // Batasi data yang tampil di grafik max 7 titik
    if (chartSuhu.data.labels.length > 7) {
        chartSuhu.data.labels.shift();
        chartSuhu.data.datasets[0].data.shift();
    }

    chartSuhu.update();
    indexDataSekarang++;
}

// --- MULAI SENSOR SAAT MASUK HALAMAN HOME ---
function mulaiSensor() {
    // Reset data supaya grafik mulai fresh setiap kali masuk home
    indexDataSekarang = 0;

    // Inisialisasi grafik hanya sekali
    if (!chartSuhu) {
        inisialisasiGrafik();
    } else {
        // Bersihkan data lama di grafik
        chartSuhu.data.labels = [];
        chartSuhu.data.datasets[0].data = [];
        chartSuhu.update();
    }

    // Ambil data pertama langsung
    ambilDataSuhu();

    // Bersihkan interval lama agar tidak dobel
    if (intervalSensor) {
        clearInterval(intervalSensor);
    }
    intervalSensor = setInterval(ambilDataSuhu, 10000);
}