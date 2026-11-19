// Data materi: Jenis-jenis Modul Sensor Arduino & ESP.
// Dipakai oleh SensorModulesPage (daftar + panel preview) dan SensorSimulator.

export type SimKind =
    | 'slider'   // sensor analog dengan satu/dua besuran terukur
    | 'meter'    // INA219: tegangan & arus -> daya
    | 'digital'  // deteksi biner (PIR, radar, flame, getar)
    | 'rfid'     // RC522: baca kartu
    | 'display'  // LCD / OLED / matriks / TFT
    | 'servo'    // sudut
    | 'motor'    // arah + kecepatan PWM
    | 'relay'    // sakelar kanal
    | 'buzzer'   // nada & gelombang
    | 'clock'    // RTC waktu berjalan
    | 'gps'      // koordinat satelit
    | 'logger'   // MicroSD data logger
    | 'charger'  // TP4056 pengisian baterai
    | 'none';

export interface Channel {
    label: string;
    unit: string;
    min: number;
    max: number;
    default: number;
    step: number;
    // Klasifikasi status opsional berdasarkan nilai.
    status?: (v: number) => { text: string; tone: 'ok' | 'warn' | 'bad' };
}

export type DisplayKind = 'lcd' | 'oled' | 'tft' | 'matrix';

export interface SensorModule {
    id: string;
    name: string;
    icon: string;
    interface: string;              // mis. "I2C", "Analog", "Digital", "PWM", "UART", "SPI"
    summary: string;                // deskripsi dari pengguna
    details: string[];              // poin tambahan
    specs: { label: string; value: string }[];
    wiring: string;                 // catatan pin/kabel
    sim: SimKind;
    swatch: string;                 // warna aksen ilustrasi
    channels?: Channel[];           // untuk slider/meter
    displayKind?: DisplayKind;      // untuk display
    relayChannels?: number;         // untuk relay
    simHint?: string;               // teks bantu simulator
}

export interface SensorCategory {
    id: string;
    title: string;
    icon: string;
    blurb: string;
    modules: SensorModule[];
}

const ENV: SensorModule[] = [
    {
        id: 'dht',
        name: 'DHT11 & DHT22',
        icon: '🌡️',
        interface: 'Digital (1-Wire)',
        summary: 'Mengukur suhu dan kelembapan udara secara digital. DHT22 memiliki tingkat akurasi dan rentang pengukuran yang lebih luas dibandingkan DHT11.',
        details: [
            'DHT11: akurasi suhu ±2°C, rentang 0-50°C; kelembapan ±5%, rentang 20-80% RH.',
            'DHT22 (AM2302): akurasi suhu ±0,5°C, rentang -40 hingga 80°C; kelembapan ±2-5%, rentang 0-100% RH.',
            'Mengeluarkan data digital terkomunikasi dalam satu frame, jadi butuh library khusus (mis. DHT.h).',
            'Perlu resistor pull-up 10 kΩ pada garis data agar stabil.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5,5 V' },
            { label: 'Antarmuka', value: '1 pin data digital' },
            { label: 'Laju sampling', value: 'DHT11 maks 1 Hz, DHT22 maks 0,5 Hz' },
            { label: 'Library umum', value: 'DHT.h / Adafruit DHT' },
        ],
        wiring: 'VCC ke 5V, GND ke GND, pin DATA ke pin digital (mis. D2) + pull-up 10k ke VCC.',
        sim: 'slider',
        swatch: '#22d3ee',
        channels: [
            { label: 'Suhu', unit: '°C', min: -20, max: 60, default: 27, step: 0.5,
              status: (v) => v < 15 ? { text: 'Dingin', tone: 'warn' } : v > 35 ? { text: 'Panas ekstrem', tone: 'bad' } : { text: 'Nyaman', tone: 'ok' } },
            { label: 'Kelembapan', unit: '% RH', min: 0, max: 100, default: 55, step: 1,
              status: (v) => v < 30 ? { text: 'Kering', tone: 'warn' } : v > 70 ? { text: 'Lembap', tone: 'warn' } : { text: 'Ideal', tone: 'ok' } },
        ],
        simHint: 'Geser nilai lingkungan, lalu lihat bagaimana sensor membacanya.',
    },
    {
        id: 'bme280',
        name: 'BME280 / BMP280',
        icon: '🧭',
        interface: 'I2C / SPI',
        summary: 'Mengukur tekanan udara barometrik dan ketinggian. Khusus seri BME280 juga dilengkapi fitur pembacaan suhu serta kelembapan yang presisi.',
        details: [
            'BMP280: tekanan + suhu. BME280: tambahan kelembapan.',
            'Rentang tekanan 300-1100 hPa, cocok untuk estimasi ketinggian (altimeter).',
            'Resolusi tekanan hingga ~16 Pa, sangat presisi dibanding sensor tekanan murah.',
            'Alamat I2C umum 0x76 atau 0x77 (dapat dipilih lewat pin SDO).',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '1,8 - 3,6 V (modul punya regulator ke 5V)' },
            { label: 'Antarmuka', value: 'I2C atau SPI' },
            { label: 'Rentang tekanan', value: '300 - 1100 hPa' },
            { label: 'Library umum', value: 'Adafruit BME280 Library' },
        ],
        wiring: 'VCC 3,3V, GND, SDA ke A4/SDA, SCL ke A5/SCL (I2C).',
        sim: 'slider',
        swatch: '#a78bfa',
        channels: [
            { label: 'Tekanan', unit: 'hPa', min: 950, max: 1050, default: 1013, step: 0.5,
              status: (v) => v < 1000 ? { text: 'Cuaca cenderung berawan/hujan', tone: 'warn' } : { text: 'Cuaca cerah', tone: 'ok' } },
            { label: 'Ketinggian (estimasi)', unit: 'm', min: 0, max: 500, default: 25, step: 1 },
        ],
        simHint: 'Tekanan turun biasanya menandakan cuaca akan memburuk.',
    },
    {
        id: 'soil',
        name: 'Soil Moisture Sensor',
        icon: '🪴',
        interface: 'Analog',
        summary: 'Mendeteksi kadar air atau tingkat kelembapan di dalam tanah. Modul ini sangat umum dipakai untuk proyek penyiraman tanaman otomatis.',
        details: [
            'Dua elektroda mengukur konduktivitas tanah: makin basah makin menghantar listrik.',
            'Keluaran analog 0-1023 (ADC). Tanah kering bernilai tinggi, basah bernilai rendah (pada modul resistif).',
            'Varian kapasitif (capacitive) lebih awet karena tidak ada elektrolisis pada probe.',
            'Sering dipasangkan dengan relay untuk menggerakkan pompa air otomatis.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5 V' },
            { label: 'Antarmuka', value: 'Analog (A0)' },
            { label: 'Keluaran', value: '0 - 1023 (ADC 10-bit)' },
            { label: 'Jenis', value: 'Resistif / Kapasitif' },
        ],
        wiring: 'VCC, GND, pin AO ke pin analog (mis. A0).',
        sim: 'slider',
        swatch: '#84cc16',
        channels: [
            { label: 'Kadar air tanah', unit: '%', min: 0, max: 100, default: 45, step: 1,
              status: (v) => v < 25 ? { text: 'Kering - siram!', tone: 'bad' } : v > 75 ? { text: 'Terlalu basah', tone: 'warn' } : { text: 'Lembap pas', tone: 'ok' } },
        ],
        simHint: 'Simulasikan kondisi tanah untuk memicu penyiraman otomatis.',
    },
    {
        id: 'rain',
        name: 'Raindrop Sensor',
        icon: '🌧️',
        interface: 'Analog + Digital',
        summary: 'Mendeteksi keberadaan tetesan air hujan melalui perubahan nilai resistansi pada papan sensornya.',
        details: [
            'Papan berlapis jalur zig-zag; saat basah, resistansi turun drastis.',
            'Memberi keluaran analog (tingkat kehujanan) dan digital (ambang via potensiometer).',
            'Cocok untuk penutup jendela otomatis atau alarm hujan.',
            'Perlu dilapisi cat/conformal coating agar jalur tidak cepat korosi.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5 V' },
            { label: 'Antarmuka', value: 'Analog + Digital' },
            { label: 'Keluaran', value: '0 - 1023 (ADC)' },
            { label: 'Pengaturan', value: 'Potensio ambang digital' },
        ],
        wiring: 'VCC, GND, AO ke A0, DO ke pin digital bila pakai ambang.',
        sim: 'slider',
        swatch: '#38bdf8',
        channels: [
            { label: 'Tingkat kehujanan', unit: '%', min: 0, max: 100, default: 10, step: 1,
              status: (v) => v > 60 ? { text: 'Hujan deras - tutup jendela', tone: 'bad' } : v > 20 ? { text: 'Gerimis', tone: 'warn' } : { text: 'Kering', tone: 'ok' } },
        ],
    },
    {
        id: 'mq',
        name: 'MQ-2 / MQ-135 (Gas & Air Quality)',
        icon: '💨',
        interface: 'Analog + Digital',
        summary: 'Mendeteksi kebocoran gas mudah terbakar (seperti LPG dan metana) serta memantau kualitas udara atau asap rokok.',
        details: [
            'MQ-2: gas mudah terbakar (LPG, propana, metana, asap).',
            'MQ-135: kualitas udara umum (CO2, NH3, benzene, asap rokok).',
            'Perlu waktu pemanasan (preheat) 24-48 jam agar hasil stabil.',
            'Keluaran analog sebanding konsentrasi; keluaran digital saat melewati ambang berbahaya.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '5 V' },
            { label: 'Antarmuka', value: 'Analog + Digital' },
            { label: 'Rentang MQ-2', value: '300 - 10000 ppm' },
            { label: 'Elemen', value: 'SnO2 (perlu pemanas)' },
        ],
        wiring: 'VCC 5V, GND, AO ke A0, DO ke digital (opsional).',
        sim: 'slider',
        swatch: '#f59e0b',
        channels: [
            { label: 'Konsentrasi gas', unit: 'ppm', min: 0, max: 2000, default: 120, step: 10,
              status: (v) => v > 800 ? { text: 'BAHAYA - evakuasi!', tone: 'bad' } : v > 400 ? { text: 'Waspada', tone: 'warn' } : { text: 'Aman', tone: 'ok' } },
        ],
        simHint: 'Ambang berbahaya umumnya sekitar 400-800 ppm tergantung kalibrasi.',
    },
    {
        id: 'bh1750',
        name: 'BH1750 (Light Intensity)',
        icon: '☀️',
        interface: 'I2C',
        summary: 'Mengukur intensitas cahaya sekitar dalam satuan Lux menggunakan protokol komunikasi I2C.',
        details: [
            'Menghasilkan nilai Lux langsung (bukan ADC mentah), rentang 1-65535 Lux.',
            'Lebih akurat dari LDR biasa karena punya ADC internal dan respons mirip mata manusia.',
            'Cocok untuk lampu jalan otomatis, monitoring pertumbuhan tanaman.',
            'Alamat I2C 0x23 (ADDR low) atau 0x5C (ADDR high).',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5 V (I2C level-shift)' },
            { label: 'Antarmuka', value: 'I2C' },
            { label: 'Rentang', value: '1 - 65535 Lux' },
            { label: 'Library umum', value: 'BH1750.h' },
        ],
        wiring: 'VCC, GND, SDA, SCL; pin ADDR menentukan alamat I2C.',
        sim: 'slider',
        swatch: '#fbbf24',
        channels: [
            { label: 'Intensitas cahaya', unit: 'Lux', min: 0, max: 10000, default: 320, step: 10,
              status: (v) => v < 50 ? { text: 'Gelap - nyalakan lampu', tone: 'warn' } : v > 5000 ? { text: 'Sangat terang', tone: 'ok' } : { text: 'Cahaya ruangan', tone: 'ok' } },
        ],
    },
];

const SEC: SensorModule[] = [
    {
        id: 'hcsr04',
        name: 'HC-SR04 (Ultrasonic)',
        icon: '📡',
        interface: 'Digital (Trig/Echo)',
        summary: 'Mengukur jarak benda di depannya menggunakan pantulan gelombang ultrasonik.',
        details: [
            'Mengirim pulsa 40 kHz pada pin TRIG, lalu mengukur durasi gema pada pin ECHO.',
            'Jarak = (durasi x 0,034 cm/µs) / 2 (dibagi 2 karena pulang-pergi).',
            'Rentang efektif ~2 cm sampai 400 cm dengan akurasi sekitar ±3 mm.',
            'Pada ESP32 (3,3V) perlu pembagi tegangan pada pin ECHO (5V -> 3,3V).',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '5 V' },
            { label: 'Rentang jarak', value: '2 - 400 cm' },
            { label: 'Sudut deteksi', value: '±15°' },
            { label: 'Frekuensi', value: '40 kHz' },
        ],
        wiring: 'VCC 5V, GND, TRIG ke digital, ECHO ke digital (via pembagi tegangan untuk ESP32).',
        sim: 'slider',
        swatch: '#f472b6',
        channels: [
            { label: 'Jarak benda', unit: 'cm', min: 2, max: 400, default: 30, step: 1,
              status: (v) => v < 10 ? { text: 'Sangat dekat', tone: 'bad' } : v < 50 ? { text: 'Dekat', tone: 'warn' } : { text: 'Aman', tone: 'ok' } },
        ],
        simHint: 'Durasi gema dihitung otomatis: jarak 30 cm ≈ 1764 µs.',
    },
    {
        id: 'pir',
        name: 'HC-SR501 (PIR Motion)',
        icon: '🚶',
        interface: 'Digital',
        summary: 'Mendeteksi pergerakan manusia atau hewan berdasarkan pancaran radiasi inframerah dari suhu tubuh.',
        details: [
            'Sensor pasif: tidak memancarkan apa pun, hanya menangkap perubahan infra merah.',
            'Dua potensio pengatur: jeda waktu (time delay) dan sensitivitas jarak.',
            'Keluaran HIGH saat gerakan terdeteksi, kembali LOW setelah time delay.',
            'Rentang deteksi umumnya 3-7 meter dengan sudut ~110° (lensa fresnel).',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '5 - 12 V (umumnya 5V)' },
            { label: 'Rentang', value: '3 - 7 meter' },
            { label: 'Sudut', value: '±110°' },
            { label: 'Keluaran', value: 'HIGH saat ada gerakan' },
        ],
        wiring: 'VCC 5V, GND, OUT ke pin digital.',
        sim: 'digital',
        swatch: '#ef4444',
        simHint: 'Tombol "Deteksi Gerakan" meniru orang lewat di depan sensor.',
    },
    {
        id: 'rcwl',
        name: 'RCWL-0516 (Microwave Radar)',
        icon: '📶',
        interface: 'Digital',
        summary: 'Mendeteksi gerakan menggunakan gelombang mikro Doppler yang mampu menembus dinding tipis atau plastik.',
        details: [
            'Bekerja seperti PIR tapi memakai gelombang mikro 5,8 GHz (efek Doppler).',
            'Keunggulan: bisa mendeteksi lewat bahan non-logam (plastik, dinding tipis).',
            'Rentang deteksi lebih jauh (hingga ~5-7 m) dan tidak terpengaruh suhu/cahaya.',
            'Kurang cocok untuk deteksi statis (hanya mendeteksi pergerakan).',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3 - 12 V' },
            { label: 'Frekuensi', value: '~5,8 GHz (X-band)' },
            { label: 'Rentang', value: 'hingga ~7 m' },
            { label: 'Keluaran', value: 'HIGH saat ada gerakan' },
        ],
        wiring: 'VCC, GND, OUT ke pin digital.',
        sim: 'digital',
        swatch: '#fb923c',
    },
    {
        id: 'rc522',
        name: 'RC522 (RFID Reader/Writer)',
        icon: '🪪',
        interface: 'SPI / I2C',
        summary: 'Membaca dan menulis data pada kartu atau gantungan kunci RFID pada frekuensi 13,56 MHz untuk sistem akses pintu.',
        details: [
            'Menggunakan standar ISO/IEC 14443 Type A (MIFARE).',
            'Membaca UID kartu dan bisa membaca/menulis blok pada tag MIFARE 1K/4K.',
            'Antarmuka SPI (umum) atau I2C; jarak baca beberapa sentimeter.',
            'Dipakai untuk absensi, akses pintu, dompet digital sederhana.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 V' },
            { label: 'Frekuensi', value: '13,56 MHz' },
            { label: 'Antarmuka', value: 'SPI / I2C / UART' },
            { label: 'Tag didukung', value: 'MIFARE 1K / 4K' },
        ],
        wiring: 'SPI: SDA(SS), SCK, MOSI, MISO, RST ke pin digital + 3,3V/GND.',
        sim: 'rfid',
        swatch: '#14b8a6',
        simHint: 'Klik "Tempelkan Kartu" untuk meniru kartuUID diterima reader.',
    },
    {
        id: 'sw420',
        name: 'SW-420 (Vibration Sensor)',
        icon: '📳',
        interface: 'Digital + Analog',
        summary: 'Mendeteksi getaran atau guncangan pada permukaan benda, cocok untuk sistem alarm anti-maling atau deteksi gempa sederhana.',
        details: [
            'Mengandung kontak bola/peredam; saat bergetar, rangkaian membuka/menutup.',
            'Potensio mengatur sensitivitas ambang keluaran digital.',
            'Keluaran digital HIGH/LOW saat getaran melewati ambang.',
            'Varian analog memberi gambaran kekuatan getaran.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5 V' },
            { label: 'Antarmuka', value: 'Digital (+ Analog)' },
            { label: 'Pengaturan', value: 'Potensio sensitivitas' },
            { label: 'Keluaran', value: 'HIGH saat bergetar' },
        ],
        wiring: 'VCC, GND, DO ke pin digital.',
        sim: 'digital',
        swatch: '#eab308',
    },
    {
        id: 'flame',
        name: 'Flame Sensor',
        icon: '🔥',
        interface: 'Digital + Analog',
        summary: 'Mendeteksi keberadaan api atau sumber panas berdasarkan panjang gelombang cahaya inframerah dari nyala api.',
        details: [
            'Photodiode peka inframerah (760 nm - 1100 nm) dari nyala api.',
            'Sudut deteksi kerucut ~60°, jarak hingga ~80 cm.',
            'Potensio mengatur sensitivitas keluaran digital.',
            'Bisa dibingungkan sumber IR lain (matahari, remote TV) - uji kalibrasi.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5 V' },
            { label: 'Panjang gelombang', value: '760 - 1100 nm' },
            { label: 'Sudut', value: '~60°' },
            { label: 'Jarak deteksi', value: 'hingga ~80 cm' },
        ],
        wiring: 'VCC, GND, DO ke pin digital (AO opsional).',
        sim: 'digital',
        swatch: '#dc2626',
    },
];

const DISP: SensorModule[] = [
    {
        id: 'lcd1602',
        name: 'LCD 16x2 / 20x4 dengan Modul I2C',
        icon: '🔢',
        interface: 'I2C (via PCF8574)',
        summary: 'Menampilkan karakter teks hingga 2 atau 4 baris. Penggunaan modul tambahan I2C menghemat penggunaan pin pada board ESP.',
        details: [
            'LCD karakter HD44780: 16 karakter x 2 baris (atau 20x4).',
            'Modul I2C backpack PCF8574 memangkas kebutuhan pin dari ~6 menjadi hanya 2 (SDA/SCL).',
            'Dapat menampilkan teks, angka, dan karakter khusus sederhana.',
            'Perlu library LiquidCrystal_I2C dan alamat I2C backpack (umumnya 0x27 atau 0x3F).',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '5 V' },
            { label: 'Antarmuka', value: 'I2C (PCF8574)' },
            { label: 'Kapasitas', value: '16x2 atau 20x4 karakter' },
            { label: 'Library umum', value: 'LiquidCrystal_I2C' },
        ],
        wiring: 'VCC, GND, SDA, SCL (4 kabel saja berkat backpack I2C).',
        sim: 'display',
        displayKind: 'lcd',
        swatch: '#4ade80',
        simHint: 'Ketik teks, tampilannya mengikuti karakter yang muat di layar.',
    },
    {
        id: 'oled',
        name: 'OLED Display 0.96" / 1.3" (SSD1306)',
        icon: '🖵',
        interface: 'I2C',
        summary: 'Menampilkan teks, grafik, maupun ikon tajam dengan konsumsi daya yang sangat rendah.',
        details: [
            'Layar monokrom 128x64 piksel dengan kontras tinggi dan sudut pandang lebar.',
            'Setiap piksel memancarkan cahaya sendiri -> warna hitam sejati & hemat daya.',
            'Mendukung gambar bitmap, grafik, animasi, dan font kustom.',
            'Library populer: Adafruit SSD1306 + GFX; alamat I2C 0x3C.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5 V' },
            { label: 'Resolusi', value: '128 x 64 px' },
            { label: 'Antarmuka', value: 'I2C / SPI' },
            { label: 'Library umum', value: 'Adafruit SSD1306' },
        ],
        wiring: 'VCC, GND, SDA, SCL.',
        sim: 'display',
        displayKind: 'oled',
        swatch: '#60a5fa',
    },
    {
        id: 'tft',
        name: 'TFT LCD Touch Screen (ILI9341)',
        icon: '🎨',
        interface: 'SPI',
        summary: 'Menampilkan antarmuka grafis berwarna penuh dan mendukung input sentuhan layar.',
        details: [
            'Layar warna 240x320 piksel dengan driver ILI9341.',
            'Panel sentuh resistif (umumnya XPT2046) memungkinkan tombol & GUI interaktif.',
            'Butuh banyak pin (SPI + CS + DC + RST + sentuh) dan library seperti TFT_eSPI.',
            'Cocok untuk dashboard, menu, dan antarmuka pengguna berwarna.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5 V' },
            { label: 'Resolusi', value: '240 x 320 px' },
            { label: 'Antarmuka', value: 'SPI' },
            { label: 'Library umum', value: 'TFT_eSPI / UTFT' },
        ],
        wiring: 'SPI (MOSI, MISO, SCK) + TC, TCS, CS, DC, RST, sentuh.',
        sim: 'display',
        displayKind: 'tft',
        swatch: '#c084fc',
    },
    {
        id: 'max7219',
        name: 'MAX7219 Dot Matrix LED',
        icon: '🔆',
        interface: 'SPI (3-wire)',
        summary: 'Menampilkan teks berjalan (running text) atau animasi sederhana menggunakan susunan lampu LED matriks.',
        details: [
            'Driver LED matriks 8x8 (sering dirangkai 4 modul menjadi 32x8).',
            'Mengendalikan 64 LED per chip lewat hanya 3 pin data (DIN, CS, CLK).',
            'Ideal untuk running text, jam, dan animasi piksel.',
            'Library umum: LedControl / MD_MAX72XX.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '5 V' },
            { label: 'Matriks', value: '8x8 (bisa dirangkai 32x8)' },
            { label: 'Antarmuka', value: 'SPI 3-wire' },
            { label: 'Library umum', value: 'MD_MAX72XX' },
        ],
        wiring: 'VCC, GND, DIN, CS, CLK ke pin digital.',
        sim: 'display',
        displayKind: 'matrix',
        swatch: '#f97316',
    },
];

const ACT: SensorModule[] = [
    {
        id: 'relay',
        name: 'Relay Module (1, 2, 4, hingga 8 Channel)',
        icon: '🔌',
        interface: 'Digital (kontrol 5/3,3V)',
        summary: 'Berfungsi sebagai sakelar elektronik untuk memutus dan menyambungkan arus listrik tegangan tinggi (AC 220V) dari sinyal tegangan rendah ESP.',
        details: [
            'Isolasi optocoupler memisahkan sisi kontrol (MCU) dari sisi beban (AC).',
            'Kontak punya terminal NO (Normally Open), NC (Normally Closed), dan COM.',
            'Ukuran beban umum 10A @ 250VAC / 10A @ 30VDC - cek spesifikasi modul.',
            'Untuk beban besar (motor, AC) gunakan kontaktor, jangan langsung lewat relay kecil.',
        ],
        specs: [
            { label: 'Tegangan coil', value: '5V (modul 3,3V tersedia)' },
            { label: 'Kapasitas kontak', value: 'umumnya 10A @ 250VAC' },
            { label: 'Terminal', value: 'COM / NO / NC per kanal' },
            { label: 'Isolasi', value: 'Optocoupler' },
        ],
        wiring: 'VCC, GND, IN1..INn ke pin digital; beban AC ke COM+NO (hati-hati tegangan tinggi!).',
        sim: 'relay',
        relayChannels: 4,
        swatch: '#06b6d4',
        simHint: 'Klik kanal untuk mengaktifkan relay; beban AC ikut menyala.',
    },
    {
        id: 'l298n',
        name: 'L298N / TB6612FNG (Motor Driver)',
        icon: '🌀',
        interface: 'Digital + PWM',
        summary: 'Mengatur arah putaran dan kecepatan motor DC atau motor stepper pada proyek robotika.',
        details: [
            'MCU tidak bisa menyalakan motor langsung (arus besar) - butuh driver.',
            'L298N mengendalikan 2 motor DC: arah lewat pin IN, kecepatan lewat PWM (ENA/ENB).',
            'TB6612FNG lebih efisien & kecil dibanding L298N (yang pakai transistor daya & panas).',
            'Sumber daya motor terpisah dari logika; hubungkan GND bersama.',
        ],
        specs: [
            { label: 'Tegangan motor', value: 'L298N: 5 - 35 V' },
            { label: 'Arus', value: '~2 A per kanal (L298N)' },
            { label: 'Kontrol', value: 'Arah (IN) + Kecepatan (PWM)' },
            { label: 'Saluran', value: '2 motor DC / 1 stepper' },
        ],
        wiring: 'IN1/IN2 arah, ENA PWM kecepatan, OUT1/OUT2 ke motor, VM ke sumber motor, GND bersama.',
        sim: 'motor',
        swatch: '#8b5cf6',
        simHint: 'Atur arah & PWM 0-255, motor berputar sesuai nilai.',
    },
    {
        id: 'servo',
        name: 'Servo Motor (SG90 / MG996R)',
        icon: '🦾',
        interface: 'PWM',
        summary: 'Menggerakkan komponen mekanik ke sudut tertentu secara presisi, sering dipakai untuk kunci pintu pintar atau tempat sampah otomatis.',
        details: [
            'Servo punya kontroler internal: kirim pulsa PWM 1-2 ms untuk menentukan sudut.',
            'Rentang umum 0-180°; SG90 ringan, MG996R torsi besar (metal gear).',
            'Dikendalikan via library Servo.h -> servo.attach(pin); servo.write(sudut).',
            'Butuh suplai daya terpisah untuk servo besar agar tidak membebani board.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '4,8 - 6 V' },
            { label: 'Rentang sudut', value: '0 - 180°' },
            { label: 'Sinyal', value: 'PWM 50 Hz (pulsa 1-2 ms)' },
            { label: 'Torsi', value: 'SG90 ~1,8 kg·cm / MG996R ~11 kg·cm' },
        ],
        wiring: 'Merah VCC, Cokelat GND, Oranye sinyal PWM ke pin digital.',
        sim: 'servo',
        swatch: '#ec4899',
        simHint: 'Geser sudut, lengan servo berputar ke posisi itu.',
    },
    {
        id: 'buzzer',
        name: 'Active & Passive Buzzer',
        icon: '🔔',
        interface: 'Digital / PWM',
        summary: 'Menghasilkan suara peringatan atau nada alarm ketika kondisi tertentu terpenuhi.',
        details: [
            'Active buzzer: cukup HIGH/LOW untuk berbunyi (generator internal).',
            'Passive buzzer: perlu PWM/frekuensi agar bisa menghasilkan berbagai nada.',
            'Nada dihasilkan dari frekuensi (mis. A4 = 440 Hz) via tone(pin, frekuensi).',
            'Gunakan transistor bila arus buzzer melebihi kemampuan pin.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5 V' },
            { label: 'Tipe', value: 'Active / Passive' },
            { label: 'Kontrol', value: 'HIGH/LOW (aktif) / frekuensi (pasif)' },
            { label: 'Fungsi umum', value: 'tone(), noTone()' },
        ],
        wiring: 'Kaki + ke pin digital (lewat transistor bila perlu), kaki - ke GND.',
        sim: 'buzzer',
        swatch: '#facc15',
        simHint: 'Ubah frekuensi untuk melihat tinggi nada & gelombangnya.',
    },
];

const COMMS: SensorModule[] = [
    {
        id: 'neo6m',
        name: 'NEO-6M (GPS Module)',
        icon: '🛰️',
        interface: 'UART (Serial)',
        summary: 'Melacak koordinat lokasi geografis (lintang dan bujur) secara real-time melalui satelit.',
        details: [
            'Menerima data NMEA (kalimat $GPGGA, $GPRMC) lewat port serial.',
            'Perlu "fix" satelit; waktu cold-start bisa beberapa menit.',
            'Umumnya 9600 baud default; pin TX/RX disilangkan ke board.',
            'Butuh antena langit terbuka; akurasi sipil ~2-5 meter.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5 V' },
            { label: 'Antarmuka', value: 'UART (TX/RX)' },
            { label: 'Baud default', value: '9600' },
            { label: 'Akurasi', value: '~2,5 m (CEP)' },
        ],
        wiring: 'VCC, GND, TX ke RX board, RX ke TX board (lewat level shifter bila 5V).',
        sim: 'gps',
        swatch: '#2dd4bf',
        simHint: 'Simulasikan pencarian satelit hingga mendapat fix koordinat.',
    },
    {
        id: 'sd',
        name: 'MicroSD Card Module',
        icon: '💾',
        interface: 'SPI',
        summary: 'Membaca dan menulis data ke kartu memori MicroSD untuk keperluan pencatatan data (data logger) secara offline.',
        details: [
            'Menyimpan data tanpa koneksi internet - cocok untuk data logger.',
            'Format FAT; perlu kartu diformat & library SD.h/SdFat.',
            'Modul SPI umum punya level shifter 3,3V agar aman untuk ESP32.',
            'Sering menyimpan log ke file CSV dengan stempel waktu dari RTC.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '5 V (kartu 3,3V via modul)' },
            { label: 'Antarmuka', value: 'SPI (MOSI/MISO/SCK/CS)' },
            { label: 'Kapasitas', value: 'hingga 32 GB (FAT32)' },
            { label: 'Library umum', value: 'SD.h / SdFat' },
        ],
        wiring: 'VCC, GND, MOSI, MISO, SCK, CS ke pin SPI.',
        sim: 'logger',
        swatch: '#a3e635',
        simHint: 'Tekan "Rekam" untuk menambahkan baris log ke file CSV virtual.',
    },
    {
        id: 'ds3231',
        name: 'DS3231 (Real-Time Clock / RTC)',
        icon: '🕒',
        interface: 'I2C',
        summary: 'Menyimpan informasi waktu dan tanggal yang tetap akurat meskipun perangkat kehilangan daya listrik utama.',
        details: [
            'RTC presisi dengan kristal(osilator) internal; akurasi ~±2 ppm.',
            'Baterai koin CR2032 menjaga waktu saat daya utama mati.',
            'Bisa membangkitkan alarm & interrupt (SQW) untuk tugas terjadwal.',
            'Alamat I2C 0x68; library RTClib.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3,3 - 5 V' },
            { label: 'Antarmuka', value: 'I2C (0x68)' },
            { label: 'Akurasi', value: '~±2 ppm (TCXO)' },
            { label: 'Backup', value: 'Baterai CR2032' },
        ],
        wiring: 'VCC, GND, SDA, SCL; pasang baterai koin pada holder.',
        sim: 'clock',
        swatch: '#38bdf8',
        simHint: 'Jam berjalan real-time; ini cara RTC menjaga waktu.',
    },
    {
        id: 'ina219',
        name: 'INA219 (Current & Voltage Sensor)',
        icon: '🔋',
        interface: 'I2C',
        summary: 'Memantau besarnya arus listrik, tegangan, dan konsumsi daya DC pada suatu rangkaian secara akurat.',
        details: [
            'Mengukur arus (via shunt), tegangan bus, dan menghitung daya.',
            'Rentang tegangan 0-26 V; arus hingga ~3,2 A (modul umum).',
            'Presisi 12-bit; alamat I2C 0x40 (dari A0/A1).',
            'Cocok memantau konsumsi baterai perangkat IoT.',
        ],
        specs: [
            { label: 'Tegangan kerja', value: '3 - 5 V (logika)' },
            { label: 'Rentang VBUS', value: '0 - 26 V' },
            { label: 'Rentang arus', value: 'hingga ~3,2 A' },
            { label: 'Antarmuka', value: 'I2C' },
        ],
        wiring: 'VIN+ / VIN- seri ke beban (shunt), VBUS ke tegangan, SDA/SCL, VCC/GND.',
        sim: 'meter',
        swatch: '#f472b6',
        channels: [
            { label: 'Tegangan', unit: 'V', min: 0, max: 26, default: 7.4, step: 0.1 },
            { label: 'Arus', unit: 'A', min: 0, max: 3.2, default: 0.85, step: 0.01 },
        ],
        simHint: 'Daya (W) dihitung otomatis = Tegangan x Arus.',
    },
    {
        id: 'tp4056',
        name: 'TP4056 (Battery Charger Module)',
        icon: '🔌',
        interface: 'Analog/Power (bukan data)',
        summary: 'Mengisi ulang daya baterai lithium (seperti 18650) sekaligus melindungi baterai dari pengisian berlebih pada proyek IoT portabel.',
        details: [
            ' Charger Li-ion 1 sel (4,2V) dengan arus hingga 1A (diatur resistor R-PROG).',
            'Metode CC/CV: arus konstan lalu tegangan konstan saat mendekati penuh.',
            'Dua LED: merah (mengisi), biru (penuh/selesai).',
            'Varian dengan proteksi menambahkan cutoff & perlindungan beban berlebih.',
        ],
        specs: [
            { label: 'Tegangan input', value: '4,5 - 5,5 V' },
            { label: 'Tegangan baterai', value: '4,2 V (Li-ion 1 sel)' },
            { label: 'Arus isi maks', value: '~1 A (diatur R-PROG)' },
            { label: 'Indikator', value: 'LED merah (isi) / biru (penuh)' },
        ],
        wiring: 'IN+ / IN- ke USB 5V; B+ / B- ke baterai (perhatikan polaritas!).',
        sim: 'charger',
        swatch: '#fb7185',
        simHint: 'Geser tingkat baterai untuk melihat status pengisian TP4056.',
    },
];

export const sensorCategories: SensorCategory[] = [
    {
        id: 'lingkungan',
        title: 'Modul Sensor Lingkungan',
        icon: '🌱',
        blurb: 'Suhu, kelembapan, tekanan, cahaya, gas, dan kondisi tanah.',
        modules: ENV,
    },
    {
        id: 'keamanan',
        title: 'Sensor Jarak, Gerak, & Keamanan',
        icon: '🛡️',
        blurb: 'Ultrasonik, PIR, radar, RFID, getar, dan deteksi api.',
        modules: SEC,
    },
    {
        id: 'display',
        title: 'Modul Display & Layar',
        icon: '🖥️',
        blurb: 'LCD, OLED, TFT sentuh, dan dot matrix LED.',
        modules: DISP,
    },
    {
        id: 'aktuator',
        title: 'Modul Aktuator & Kontrol Daya',
        icon: '⚡',
        blurb: 'Relay, driver motor, servo, dan buzzer.',
        modules: ACT,
    },
    {
        id: 'komunikasi',
        title: 'Komunikasi, Memori, & Pendukung',
        icon: '🛰️',
        blurb: 'GPS, MicroSD, RTC, INA219, dan pengisi daya.',
        modules: COMMS,
    },
];

export const allSensorModules: SensorModule[] = sensorCategories.flatMap((c) => c.modules);

export function findSensorModule(id: string): SensorModule | undefined {
    return allSensorModules.find((m) => m.id === id);
}
