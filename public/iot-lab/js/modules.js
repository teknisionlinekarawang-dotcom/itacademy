// modules.js - Kurikulum bertahap. Setiap modul membawa sketch yang siap dijalankan,
// daftar komponen untuk dirender pada papan virtual, dan kontrol input yang muncul.
//
// kind komponen:
//   led     -> LED yang menyala dari digitalWrite / analogWrite (redup)
//   servo   -> SG90, lengan berputar mengikuti write()
//   button  -> tombol yang bisa ditekan-tahan pada panel Input
//   analog  -> slider (potensiometer / LDR) sebagai sumber analogRead()

export const MODULES = [
  {
    id: "orientasi",
    level: 0,
    board: "esp32",
    title: "Orientasi: papan, pin, dan editor",
    subtitle: "Cara program Arduino dijalankan",
    goal: "Memahami pembagian setup() dan loop() serta melihat output pada Serial Monitor.",
    concepts: ["setup()", "loop()", "Serial.begin()", "delay()"],
    parts: [
      { kind: "led", pin: 2, label: "LED bawaan", builtin: true },
      { kind: "serial" },
    ],
    explain: [
      { h: "Dua fungsi wajib", p: "Program Arduino (disebut sketch) selalu punya setup() yang dijalankan satu kali saat daya dinyalakan, dan loop() yang diulang terus-menerus tanpa henti." },
      { h: "Jam semu", p: "Simulator ini menjalankan waktu seperti papan asli. delay(1000) berarti 1 detik waktu papan, dan millis() tetap maju walaupun kode Anda tidak memakai delay()." },
      { h: "Live recompile", p: "Setiap perubahan kode langsung diparse ulang dan dijalankan lagi. Tidak ada tombol compile: ubah angka, lihat akibatnya." },
    ],
    sketch: `// Modul 0 - Orientasi
// Ini adalah kerangka program Arduino paling sederhana.

void setup() {
  Serial.begin(9600);            // siapkan komunikasi serial
  pinMode(LED_BUILTIN, OUTPUT);  // LED bawaan papan
}

void loop() {
  Serial.println("Halo dari simulator!");
  delay(1000);                   // tunggu 1 detik, lalu ulangi loop()
}`,
    tasks: [
      "Jalankan kode apa adanya, amati Serial Monitor mencetak baris baru setiap 1 detik.",
      "Ubah delay(1000) menjadi delay(200). Perhatikan cetakannya menjadi lebih cepat.",
      "Ganti teks di dalam Serial.println() dengan nama Anda sendiri.",
    ],
    hint: "LED_BUILTIN adalah pin LED yang sudah tertanam di papan: GPIO2 pada ESP32, pin 13 pada Arduino Uno.",
    success: "Serial Monitor menampilkan teks Anda secara berulang dengan jeda sesuai nilai delay() yang Anda ubah.",
  },

  {
    id: "led-dasar",
    level: 1,
    board: "esp32",
    title: "Menyalakan LED",
    subtitle: "digitalWrite, OUTPUT, HIGH/LOW",
    goal: "Menyalakan LED hanya dengan mengubah satu kata pada kode, tanpa menyentuh sakelar.",
    concepts: ["pinMode()", "digitalWrite()", "HIGH", "LOW"],
    parts: [{ kind: "led", pin: 2, label: "LED merah" }],
    explain: [
      { h: "Pin sebagai keluaran", p: "pinMode(LAMPU, OUTPUT) memberi tahu papan bahwa pin itu akan digunakan untuk mengeluarkan tegangan, bukan membaca." },
      { h: "HIGH dan LOW", p: "digitalWrite(pin, HIGH) menarik pin ke tegangan papan (3,3 V pada ESP32, 5 V pada Uno) sehingga LED menyala. LOW menariknya ke ground sehingga LED mati." },
      { h: "Kenapa perlu delay() kecil", p: "loop() tanpa jeda akan menjalankan kode jutaan kali per detik tanpa mengubah apa pun. delay(20) cukup membuat LED merespons instan sekaligus menghemat kerja prosesor." },
    ],
    sketch: `// Modul 1 - Menyalakan LED
// TUGAS: ubah LOW menjadi HIGH pada baris digitalWrite, lihat LED langsung menyala.

const int LAMPU = 2;

void setup() {
  pinMode(LAMPU, OUTPUT);
}

void loop() {
  digitalWrite(LAMPU, LOW);   // <-- ganti LOW menjadi HIGH
  delay(20);
}`,
    tasks: [
      "Ubah LOW menjadi HIGH, lalu pastikan LED menyala.",
      "Kembalikan ke LOW dan pastikan LED mati.",
      "Ubah nilai LAMPU menjadi 4. Perhatikan LED pada papan virtual ikut berpindah.",
    ],
    hint: "LED pada papan virtual menyala dari nilai latch pin. Jika Anda menulis HIGH lalu LOW dalam satu loop(), yang terlihat adalah nilai terakhir.",
    success: "LED menyala dan mati saat Anda mengganti HIGH/LOW, dan berpindah saat nomor pin diubah.",
  },

  {
    id: "led-blink",
    level: 1,
    board: "esp32",
    title: "LED berkedip dengan delay()",
    subtitle: "Blokir waktu itu mahal",
    goal: "Membuat pola berkedip dan memahami bahwa delay() menghentikan seluruh program.",
    concepts: ["delay()", "konstanta", "urutan eksekusi"],
    parts: [{ kind: "led", pin: 2, label: "LED merah" }],
    explain: [
      { h: "Urutan eksekusi", p: "loop() dijalankan baris demi baris. Saat bertemu delay(), papan berhenti mengerjakan hal lain - bahkan membaca tombol tidak akan terjadi." },
      { h: "Konstanta", p: "const int membuat nilai mudah diubah di satu tempat dan hemat memori dibanding variabel biasa." },
    ],
    sketch: `// Modul 2 - LED berkedip
// TUGAS: ubah TUNGGU untuk mengubah kecepatan kedipan.

const int LAMPU = 2;
const int TUNGGU = 500;   // milidetik

void setup() {
  pinMode(LAMPU, OUTPUT);
}

void loop() {
  digitalWrite(LAMPU, HIGH);
  delay(TUNGGU);
  digitalWrite(LAMPU, LOW);
  delay(TUNGGU);
}`,
    tasks: [
      "Ubah TUNGGU menjadi 100 sehingga LED berkedip cepat.",
      "Buat pola tidak simetris: 100 ms menyala, 900 ms mati.",
      "Perhatikan panel Status: satu iterasi loop() kini memakan waktu 2 x TUNGGU.",
    ],
    hint: "Total waktu satu iterasi loop() = jumlah semua delay() di dalamnya. Ubah TUNGGU menjadi 0 untuk melihat apa yang terjadi pada pemakaian CPU simulator.",
    success: "LED berkedip dengan pola waktu yang Anda tentukan, dan panel Status menampilkan durasi iterasi yang sesuai.",
  },

  {
    id: "led-milis",
    level: 2,
    board: "esp32",
    title: "Berkedip tanpa delay() dengan millis()",
    subtitle: "Pola non-blocking",
    goal: "Menyalakan LED mengikuti waktu tanpa memblokir loop(), pola yang dipakai proyek nyata.",
    concepts: ["millis()", "unsigned long", "selisih waktu"],
    parts: [
      { kind: "led", pin: 2, label: "LED merah" },
      { kind: "serial" },
    ],
    explain: [
      { h: "Selisih, bukan kesamaan", p: "Pola bakunya: if (millis() - waktuTerakhir >= interval) { kerjakan; waktuTerakhir = millis(); }. Pengurangan tanpa tanda minus aman walau millis() melompati nol." },
      { h: "Kenapa unsigned long", p: "millis() sudah melewati 65535 setelah ~65 detik. Bila disimpan di int, selisihnya kacau. unsigned long menampung hingga ~49 hari." },
    ],
    sketch: `// Modul 3 - Berkedip non-blocking
// TUGAS: ubah interval, lalu tekan tombol pada panel Input untuk
// memastikan program tetap merespons meski LED sedang berkedip.

const int LAMPU = 2;
unsigned long waktuTerakhir = 0;
int interval = 300;

void setup() {
  pinMode(LAMPU, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  unsigned long sekarang = millis();
  if (sekarang - waktuTerakhir >= interval) {
    waktuTerakhir = sekarang;
    digitalWrite(LAMPU, !digitalRead(LAMPU));
    Serial.printf("LED = %d pada t=%d ms\\n", digitalRead(LAMPU), sekarang);
  }
  delay(5);
}`,
    tasks: [
      "Ubah interval menjadi 1000 dan pastikan kedipan melambat.",
      "Naikkan interval menjadi 10000 - LED hampir mati lama. Perhatikan Serial tetap hidup.",
      "Hapus baris delay(5). Simulator tetap berjalan karena waktu CPU juga maju.",
    ],
    hint: "digitalRead() pada pin bermode OUTPUT mengembalikan nilai latch terakhir, jadi baris itu bisa membalik keadaan LED tanpa variabel penyimpan.",
    success: "LED berkedip sesuai interval dan Serial Monitor tetap mencetak walau interval besar.",
  },

  {
    id: "banyak-led",
    level: 2,
    board: "esp32",
    title: "Beberapa LED dengan array dan for()",
    subtitle: "Marker / running light",
    goal: "Mengendalikan banyak pin dengan satu baris kode memakai array dan perulangan.",
    concepts: ["array", "for()", "indeks"],
    parts: [
      { kind: "led", pin: 2, label: "LED 1" },
      { kind: "led", pin: 4, label: "LED 2" },
      { kind: "led", pin: 5, label: "LED 3" },
      { kind: "serial" },
    ],
    explain: [
      { h: "Array pin", p: "int PIN_LED[3] = {2, 4, 5}; menyimpan tiga nomor pin. for (int i = 0; i < 3; i++) menyentuh semuanya tanpa menulis berulang." },
      { h: "Batas array", p: "Indeks sah hanya 0, 1, 2. Menulis PIN_LED[3] akan ditolak simulator dengan pesan di luar jangkauan - sama seperti crash di papan nyata." },
    ],
    sketch: `// Modul 4 - Running light tiga LED
// TUGAS: tambahkan LED ke-4 pada array dan perbaiki jumlahnya.

const int PIN_LED[3] = {2, 4, 5};
const int JUMLAH = 3;
int indeks = 0;

void setup() {
  for (int i = 0; i < JUMLAH; i++) pinMode(PIN_LED[i], OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int i = 0; i < JUMLAH; i++) digitalWrite(PIN_LED[i], LOW);
  digitalWrite(PIN_LED[indeks], HIGH);
  Serial.print("LED aktif ke-");
  Serial.println(indeks + 1);
  indeks = indeks + 1;
  if (indeks >= JUMLAH) indeks = 0;
  delay(400);
}`,
    tasks: [
      "Ubah array menjadi {2, 4, 5, 13} dan JUMLAH menjadi 4.",
      "Buat arah bolak-balik dengan langkah negatif seperti pada servo sweep nanti.",
      "Sengaja tulis JUMLAH = 5 dan baca pesan error indeks yang muncul.",
    ],
    hint: "Variabel JUMLAH sengaja dipisah agar satu perubahan angka cukup untuk menambah atau mengurangi LED.",
    success: "Semua LED menyala bergilir dan jumlah LED pada papan virtual bertambah saat array Anda tambahi.",
  },

  {
    id: "tombol",
    level: 2,
    board: "esp32",
    title: "Membaca tombol dengan INPUT_PULLUP",
    subtitle: "digitalRead dan debounce",
    goal: "Membaca masukan fisik, mendeteksi tepi (edge), dan menghilangkan pantulan tombol.",
    concepts: ["pinMode INPUT_PULLUP", "digitalRead()", "edge detection", "debounce"],
    parts: [
      { kind: "button", pin: 4, label: "Tombol A" },
      { kind: "led", pin: 2, label: "LED merah" },
      { kind: "serial" },
    ],
    explain: [
      { h: "INPUT_PULLUP membalik logika", p: "Resistor internal menarik pin ke HIGH. Saat tombol ditekan, pin terhubung ke ground sehingga terbaca LOW. Karena itu \"ditekan\" justru bernilai LOW." },
      { h: "Edge vs level", p: "Mendeteksi perubahan (terbaca != tertekan) membuat aksi terjadi satu kali per penekanan, bukan puluhan kali per detik." },
      { h: "Debounce", p: "Tombol mekanik memantul selama beberapa milidetik. Jeda 20 ms sebelum membaca ulang cukup untuk menyaringnya." },
    ],
    sketch: `// Modul 5 - Tombol
// TUGAS: tekan dan tahan tombol pada panel Input di kanan.
// Ubah program menjadi "toggle": setiap penekanan mengganti keadaan LED.

const int TOMBOL = 4;
const int LAMPU = 2;
boolean tertekan = false;

void setup() {
  pinMode(TOMBOL, INPUT_PULLUP);
  pinMode(LAMPU, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  boolean terbaca = digitalRead(TOMBOL) == LOW;
  if (terbaca != tertekan) {
    tertekan = terbaca;
    Serial.println(tertekan ? "tombol DITEKAN" : "tombol LEPAS");
  }
  digitalWrite(LAMPU, tertekan ? HIGH : LOW);
  delay(20);
}`,
    tasks: [
      "Buat LED tetap menyala setelah tombol dilepas (mode toggle), bukan hanya saat ditekan.",
      "Cetak jumlah penekanan ke Serial dengan variabel counter.",
      "Kurangi delay(20) menjadi delay(1) dan amati apakah masih ada perubahan ganda.",
    ],
    hint: "Untuk toggle, simpan keadaan LED pada variabel sendiri dan balik nilainya hanya saat tepi naik (tombol dilepas).",
    success: "Setiap penekanan tombol menghasilkan tepat satu perubahan LED dan satu baris pada Serial Monitor.",
  },

  {
    id: "pwm",
    level: 3,
    board: "esp32",
    title: "Meredupkan LED dengan PWM",
    subtitle: "analogWrite dan map()",
    goal: "Mengatur terang LED dari nilai sensor memakai PWM dan pemetaan rentang.",
    concepts: ["analogWrite()", "map()", "ADC", "PWM"],
    parts: [
      { kind: "analog", kind2: "pot", pin: 34, label: "Potensiometer", value: 0.5 },
      { kind: "led", pin: 5, label: "LED PWM", pwm: true },
      { kind: "serial" },
    ],
    explain: [
      { h: "PWM bukan tegangan analog", p: "analogWrite(pin, 128) menyalakan dan mematikan pin sangat cepat. Mata melihatnya sebagai LED yang setengah redup. Hanya pin tertentu yang punya PWM." },
      { h: "Resolusi ADC berbeda", p: "ESP32 membaca 0-4095 (12 bit), Arduino Uno hanya 0-1023 (10 bit). Karena itu batas atas perlu ditulis sebagai konstanta agar mudah disesuaikan." },
      { h: "map() memakai aritmetika integer", p: "map() memotong hasil bagi, bukan membulatkan. Nilai 512 dari 0-1023 ke 0-100 menghasilkan 50, bukan 50 koma sekian." },
    ],
    sketch: `// Modul 6 - PWM dari potensiometer
// TUGAS: geser slider Potensiometer pada panel Input, lalu ubah ADC_MAX
// menjadi 1023 bila Anda berpindah ke Arduino Uno.

const int LED_PWM = 5;
const int SENSOR = 34;
const int ADC_MAX = 4095;   // ESP32 12 bit; Arduino Uno 10 bit = 1023

void setup() {
  pinMode(LED_PWM, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int nilaiSensor = analogRead(SENSOR);
  int terang = map(nilaiSensor, 0, ADC_MAX, 0, 255);
  analogWrite(LED_PWM, terang);
  Serial.printf("analog=%d  pwm=%d  terang=%d%%\\n", nilaiSensor, terang, terang * 100 / 255);
  delay(50);
}`,
    tasks: [
      "Geser slider sampai paling kiri dan pastikan LED padam.",
      "Batasi terang maksimal menjadi 100 saja dengan mengubah argumen map().",
      "Pindahkan analogWrite ke pin 13 dan baca peringatan bahwa pin itu tidak punya PWM.",
    ],
    hint: "Persen terang memakai integer: terang * 100 / 255. Tulis 100 * terang / 255, jangan terang / 255 * 100, karena pembagian integer lebih dulu akan menghasilkan 0.",
    success: "Terang LED pada papan virtual berubah halus saat slider digeser, dan angka pwm ikut berubah.",
  },

  {
    id: "sensor-analog",
    level: 3,
    board: "esp32",
    title: "Sensor LDR dan ambang batas",
    subtitle: "analogRead, if/else, histeresis",
    goal: "Membaca sensor cahaya dan menyalakan lampu otomatis saat gelap.",
    concepts: ["analogRead()", "if/else", "ambang batas", "histeresis"],
    parts: [
      { kind: "analog", kind2: "ldr", pin: 35, label: "LDR (cahaya)", value: 0.75 },
      { kind: "led", pin: 2, label: "Lampu taman" },
      { kind: "serial" },
    ],
    explain: [
      { h: "Satu ambang membuat LED bergetar", p: "Jika nilai sensor bergetar di sekitar ambang, LED akan berkedip cepat. Solusinya histeresis: ambang menyala dan ambang memadamkan dibuat berbeda." },
      { h: "Membaca sensor", p: "analogRead() mengembalikan angka cacah ADC, bukan volt. Untuk mendapat volt: nilai * 3.3 / ADC_MAX." },
    ],
    sketch: `// Modul 7 - Lampu taman otomatis
// TUGAS: geser slider LDR melintasi ambang. Ubah AMBANG_GELAP dan
// AMBANG_TERANG untuk menghilangkan kedip berulang (histeresis).

const int LDR = 35;
const int LAMPU = 2;
const int AMBANG_GELAP = 1200;
const int AMBANG_TERANG = 1600;
boolean lampuNyala = false;

void setup() {
  pinMode(LAMPU, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int cahaya = analogRead(LDR);
  if (!lampuNyala && cahaya < AMBANG_GELAP) lampuNyala = true;
  if (lampuNyala && cahaya > AMBANG_TERANG) lampuNyala = false;

  digitalWrite(LAMPU, lampuNyala ? HIGH : LOW);
  Serial.printf("cahaya=%d  lampu=%s\\n", cahaya, lampuNyala ? "NYALA" : "mati");
  delay(100);
}`,
    tasks: [
      "Geser slider dari terang ke gelap dan temukan di mana lampu menyala.",
      "Set AMBANG_GELAP = AMBANG_TERANG lalu perhatikan lampu berkedip di sekitar nilai itu.",
      "Cetak juga tegangan dalam volt: cahaya * 3.3 / 4095.",
    ],
    hint: "Tulis float tegangan = cahaya * 3.3 / 4095; angka 3.3 memaksa perhitungan menjadi float sehingga hasilnya tidak selalu 0.",
    success: "Lampu menyala saat gelap, padam saat terang, dan tidak berkedip di area ambang karena histeresis bekerja.",
  },

  {
    id: "servo-dasar",
    level: 3,
    board: "esp32",
    title: "Servo SG90: attach dan write",
    subtitle: "Pustaka Servo",
    goal: "Memutar lengan servo ke sudut tertentu hanya dengan mengubah nilai pada kode.",
    concepts: ["Servo.attach()", "Servo.write()", "sudut 0-180", "writeMicroseconds()"],
    parts: [{ kind: "servo", pin: 13, label: "SG90" }],
    explain: [
      { h: "Sudut, bukan posisi absolut", p: "write(90) memerintahkan servo menempati 90 derajat. Nilai di luar 0-180 dipotong (clamp) oleh simulator, sama seperti pustaka Servo yang membatasinya." },
      { h: "attach() wajib lebih dulu", p: "Sebelum write(), servo harus di-attach() ke pin agar timer/LEDc dipakai. Menulis tanpa attach di papan nyata tidak menghasilkan gerak." },
      { h: "writeMicroseconds", p: "Sudut sebenarnya dikirim sebagai lebar pulsa: 500 us = 0 derajat, 2400 us = 180 derajat pada SG90." },
    ],
    sketch: `// Modul 8 - Servo SG90 dasar
// TUGAS: ubah SUDUT (0..180) dan lengan servo ikut berputar.
// Coba juga nilai 200 atau -30 untuk melihat efek pembatasan.

#include <Servo.h>

Servo servo1;
const int PIN_SERVO = 13;
int SUDUT = 90;

void setup() {
  servo1.attach(PIN_SERVO);
  Serial.begin(9600);
}

void loop() {
  servo1.write(SUDUT);
  Serial.printf("target=%d  derajat=%d\\n", SUDUT, servo1.read());
  delay(100);
}`,
    tasks: [
      "Ubah SUDUT menjadi 0, 45, 90, 135, 180 dan amati gerak lengannya.",
      "Ganti write(SUDUT) menjadi writeMicroseconds(1450) dan buktikan hasilnya 90 derajat.",
      "Hapus baris attach() lalu baca peringatan yang muncul di panel Status.",
    ],
    hint: "servo1.read() mengembalikan sudut terakhir yang benar-benar diterapkan, berguna untuk membandingkan target dan hasil.",
    success: "Lengan servo bergerak ke sudut yang Anda tulis, dan nilai di luar 0-180 dipotong tanpa membuat program mati.",
  },

  {
    id: "servo-sweep",
    level: 4,
    board: "esp32",
    title: "Servo menyapu bolak-balik",
    subtitle: "State tanpa delay panjang",
    goal: "Membuat gerakan menyapu 0-180-0 dengan membalik arah memakai tanda negatif.",
    concepts: ["variabel keadaan", "balik arah", "langkah (step)"],
    parts: [
      { kind: "servo", pin: 13, label: "SG90" },
      { kind: "serial" },
    ],
    explain: [
      { h: "Pola pembalik arah", p: "if (pos >= 180 || pos <= 0) langkah = -langkah; membuat arah berbalik otomatis di kedua ujung, tanpa perlu dua blok kode terpisah." },
      { h: "Kecepatan dari langkah dan jeda", p: "Kecepatan sudut = langkah / jeda. Langkah 1 dengan delay(20) menghasilkan sekitar 50 derajat per detik." },
    ],
    sketch: `// Modul 9 - Sweep servo
// TUGAS: ubah LANGKAH dan JEDA untuk mengatur kecepatan sapuan.

#include <Servo.h>

Servo servo1;
int pos = 0;
int langkah = 1;
const int JEDA = 20;

void setup() {
  servo1.attach(13);
  Serial.begin(9600);
}

void loop() {
  servo1.write(pos);
  pos = pos + langkah;
  if (pos >= 180 || pos <= 0) langkah = -langkah;
  if (pos % 30 == 0) Serial.println(pos);
  delay(JEDA);
}`,
    tasks: [
      "Percepat sapuan dengan LANGKAH = 5.",
      "Batasi rentang hanya 30 sampai 150 derajat.",
      "Ganti pencetakan agar hanya muncul saat arah berbalik.",
    ],
    hint: "Untuk membatasi rentang, ubah kondisi menjadi if (pos >= 150 || pos <= 30) langkah = -langkah; dan mulai pos di 30.",
    success: "Servo bergerak mulus bolak-balik dan arah berbalik tepat di ujung rentang yang Anda tentukan.",
  },

  {
    id: "posisioner",
    level: 4,
    board: "esp32",
    title: "Tantangan: posisioner otomatis",
    subtitle: "Sensor -> aktuator",
    goal: "Menggabungkan masukan analog dan keluaran servo menjadi satu sistem kendali.",
    concepts: ["rantai sensor-aktuator", "map()", "kalibrasi"],
    parts: [
      { kind: "analog", kind2: "pot", pin: 32, label: "Potensiometer", value: 0.5 },
      { kind: "servo", pin: 13, label: "SG90" },
      { kind: "serial" },
    ],
    explain: [
      { h: "Rantai data IoT", p: "Sensor membaca dunia -> kode menafsirkan -> aktuator mengubah dunia. Ini pola dasar semua sistem otomatis, dari kipas hingga robot." },
      { h: "Kalibrasi", p: "Ganti batas bawah dan atas pada map() untuk menyesuaikan jangkauan fisik servo terhadap posisi sensor nyata." },
    ],
    sketch: `// Modul 10 - Posisioner: potensiometer menggerakkan servo
// TUGAS: geser slider, lalu kalibrasi agar 0% slider = 0 derajat dan
// 100% slider = 160 derajat (servo nyata sering tidak mencapai 180).

#include <Servo.h>

Servo servo1;
const int POT = 32;
const int ADC_MAX = 4095;

void setup() {
  servo1.attach(13);
  Serial.begin(9600);
}

void loop() {
  int bacaan = analogRead(POT);
  int sudut = map(bacaan, 0, ADC_MAX, 0, 180);
  servo1.write(sudut);
  Serial.printf("slider=%d%%  sudut=%d\\n", map(bacaan, 0, ADC_MAX, 0, 100), sudut);
  delay(30);
}`,
    tasks: [
      "Ubah pemetaan menjadi 0 sampai 160 derajat.",
      "Tambahkan tombol pada pin 4 yang menahan servo di 90 derajat saat ditekan.",
      "Haluskan gerak dengan rata-rata 3 bacaan terakhir.",
    ],
    hint: "Untuk rata-rata, simpan tiga variabel atau array lalu bagikan jumlahnya dengan 3 memakai integer.",
    success: "Sudut servo mengikuti slider secara linear, dan angka pada Serial Monitor konsisten dengan posisi lengan.",
  },

  {
    id: "fungsi",
    level: 5,
    board: "esp32",
    title: "Menyusun kode rapi dengan fungsi sendiri",
    subtitle: "Parameter dan reuse",
    goal: "Memecah loop() panjang menjadi fungsi bernama yang menerima parameter.",
    concepts: ["definisi fungsi", "parameter", "return", "skop variabel"],
    parts: [
      { kind: "led", pin: 2, label: "LED 1" },
      { kind: "led", pin: 4, label: "LED 2" },
      { kind: "led", pin: 5, label: "LED 3" },
    ],
    explain: [
      { h: "Fungsi sebagai kata kerja", p: "namaMatiSemua() dan nyalakanSatu(pin, durasi) membuat loop() terbaca seperti kalimat. Nama fungsi sebaiknya menjelaskan aksi, bukan cara." },
      { h: "Skop lokal", p: "Parameter dan variabel di dalam fungsi hilang saat fungsi selesai. Nilai yang harus bertahan dideklarasikan di tingkat global." },
    ],
    sketch: `// Modul 11 - Fungsi buatan sendiri
// TUGAS: buat fungsi baru bernama kedip(pin, kali, durasi) yang
// berkedip sebanyak kali, lalu panggil dari loop().

const int L1 = 2, L2 = 4, L3 = 5;

void semuaMati() {
  digitalWrite(L1, LOW);
  digitalWrite(L2, LOW);
  digitalWrite(L3, LOW);
}

void nyalakanSatu(int pin, int durasi) {
  digitalWrite(pin, HIGH);
  delay(durasi);
  digitalWrite(pin, LOW);
}

int jumlahAktif = 0;

int hitung(int a, int b) {
  return a + b;
}

void setup() {
  pinMode(L1, OUTPUT);
  pinMode(L2, OUTPUT);
  pinMode(L3, OUTPUT);
}

void loop() {
  semuaMati();
  nyalakanSatu(L1, 300);
  nyalakanSatu(L2, 300);
  nyalakanSatu(L3, 300);
  jumlahAktif = hitung(1, 2);
  delay(200);
}`,
    tasks: [
      "Tulis fungsi kedip(int pin, int kali, int durasi) memakai for() di dalamnya.",
      "Panggil kedip(L1, 3, 120) dari loop() dan pastikan LED 1 berkedip tiga kali.",
      "Buat fungsi return int yang menghitung total waktu sebuah pola, lalu cetak ke Serial.",
    ],
    hint: "Fungsi harus didefinisikan sebelum dipakai atau di mana saja di berkas yang sama; simulator mencari semua fungsi sebelum menjalankan setup().",
    success: "loop() hanya berisi panggilan fungsi bernama jelas, dan pola LED tetap sama seperti sebelumnya.",
  },

  {
    id: "serial-lanjut",
    level: 5,
    board: "esp32",
    title: "Serial Monitor tingkat lanjut",
    subtitle: "printf, String, dan basis angka",
    goal: "Mengirim log yang rapi dan mudah dibaca manusia maupun mesin.",
    concepts: ["Serial.print/println", "Serial.printf", "String", "DEC/HEX/BIN"],
    parts: [
      { kind: "analog", kind2: "pot", pin: 32, label: "Sensor", value: 0.4 },
      { kind: "serial" },
    ],
    explain: [
      { h: "print vs println", p: "print() meninggalkan kursor di baris yang sama, berguna untuk label. println() menutup baris sehingga tiap data punya barisnya sendiri." },
      { h: "String itu mahal", p: "String mengalokasikan memori dinamis dan bisa menyebabkan fragmentasi di papan kecil. Untuk log sederhana, print bertingkat lebih aman." },
      { h: "Basis angka", p: "Serial.println(nilai, HEX) atau BIN mencetak dalam basis lain, praktis saat memeriksa bit." },
    ],
    sketch: `// Modul 12 - Log serial yang rapi
// TUGAS: ubah format log, lalu cetak nilai yang sama dalam HEX dan BIN.

const int SENSOR = 32;
int teganganMv = 0;

void setup() {
  Serial.begin(115200);
}

void loop() {
  int baca = analogRead(SENSOR);
  teganganMv = map(baca, 0, 4095, 0, 3300);

  Serial.print("baca=");
  Serial.print(baca);
  Serial.print("  volt=");
  Serial.print(teganganMv / 1000.0, 3);
  Serial.println(" V");

  Serial.printf("hex=%x  bin=", baca);
  Serial.println(baca, BIN);

  delay(250);
}`,
    tasks: [
      "Tambahkan baris log berisi waktu dalam detik: millis() / 1000.",
      "Cetak nilai yang sama dengan Serial.println(baca, HEX).",
      "Buat satu baris ringkas memakai String dan bandingkan dengan versi print bertingkat.",
    ],
    hint: "Serial.print(teganganMv / 1000.0, 3) memakai angka 1000.0 agar hasilnya float; dengan 1000 saja hasilnya pembagian integer.",
    success: "Serial Monitor menampilkan beberapa format log yang rapi dan konsisten setiap 250 ms.",
  },

  {
    id: "esp32-vs-uno",
    level: 6,
    board: "any",
    title: "ESP32 vs Arduino Uno",
    subtitle: "Perbedaan yang menjebak pemula",
    goal: "Menjalankan sketch yang sama pada dua papan dan membaca perbedaan angkanya.",
    concepts: ["LED_BUILTIN", "resolusi ADC", "ketahanan tegangan", "kecepatan CPU"],
    parts: [
      { kind: "analog", kind2: "pot", pin: 18, label: "A0", value: 0.6 },
      { kind: "led", pin: 2, label: "LED Bawaan", builtin: true },
      { kind: "serial" },
    ],
    explain: [
      { h: "Nama pin berbeda", p: "LED_BUILTIN adalah GPIO2 di ESP32 tetapi pin 13 di Uno. AnalogRead(A0) memetakan ke GPIO36 di ESP32 dan pin 14 di Uno." },
      { h: "3,3 V vs 5 V", p: "ESP32 tidak tahan 5 V pada pin input. Menyambungkan sensor 5 V langsung ke ESP32 dapat merusak papan." },
      { h: "Kecepatan", p: "Satu loop() kosong berjalan sekitar 4 juta kali per detik di Uno dan jauh lebih cepat di ESP32. Simulator meniru ini lewat millis()." },
    ],
    sketch: `// Modul 13 - Bandingkan dua papan
// TUGAS: jalankan kode ini, lalu pindah papan lewat pemilih di atas
// dan perhatikan angka yang berubah.

const int ADC_MAX = 4095;   // ubah ke 1023 saat memakai Arduino Uno

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  int baca = analogRead(A0);
  digitalWrite(LED_BUILTIN, baca > ADC_MAX / 2 ? HIGH : LOW);

  Serial.print("LED_BUILTIN=pin ");
  Serial.print(LED_BUILTIN);
  Serial.print("  bacaan=");
  Serial.print(baca);
  Serial.print("  ambang=");
  Serial.println(ADC_MAX / 2);

  delay(200);
}`,
    tasks: [
      "Catat nilai LED_BUILTIN saat papan diubah ke Arduino Uno.",
      "Ubah ADC_MAX menjadi 1023 lalu bandingkan titik nyala-mati LED pada slider yang sama.",
      "Ukur kecepatan: hapus delay(200) dan bandingkan iterasi per detik ESP32 vs Uno pada panel Status.",
    ],
    hint: "Simulator memakai 4 juta langkah/detik untuk Uno dan 20 juta untuk ESP32, jadi loop kosong pada ESP32 memakan lebih sedikit waktu papan.",
    success: "Anda bisa menyebutkan tiga perbedaan nyata antara ESP32 dan Uno berdasarkan angka yang dicetak simulator.",
  },

  {
    id: "lcd-16x2",
    level: 4,
    board: "esp32",
    title: "Menampilkan teks di LCD 16x2 (I2C)",
    subtitle: "LiquidCrystal_I2C, setCursor, print",
    goal: "Menulis teks dan angka ke layar karakter 16x2 hanya dengan mengubah kode.",
    concepts: ["LiquidCrystal_I2C", "lcd.init()", "lcd.setCursor()", "lcd.print()", "alamat I2C"],
    parts: [
      { kind: "lcd", label: "LCD I2C 16x2", addr: "0x27" },
      { kind: "serial" },
    ],
    explain: [
      { h: "Kenapa cuma dua kabel", p: "Modul LCD ini memakai I2C, jadi hanya perlu dua pin (SDA/SCL) alih-alih enam pin digital. Alamat 0x27 adalah alamat bawaan adaptor I2C yang paling umum." },
      { h: "Kolom dulu, baru baris", p: "setCursor(kolom, baris) memakai indeks dari nol: (0,0) pojok kiri atas, (0,1) baris kedua. Layar 16x2 punya kolom 0-15 dan baris 0-1." },
      { h: "print teks vs angka", p: "print(\"Suhu: \") mencetak teks apa adanya, print(suhu) mencetak nilai variabel. Keduanya bisa digabung berurutan pada baris yang sama." },
    ],
    sketch: `// Modul 14 - LCD 16x2
// TUGAS: ubah teks pada baris kedua dan nilai suhu, lalu lihat layar ikut berubah.

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);   // alamat I2C, jumlah kolom, jumlah baris
int suhu = 27;

void setup() {
  lcd.init();
  lcd.backlight();
}

void loop() {
  lcd.setCursor(0, 0);
  lcd.print("Suhu: ");
  lcd.print(suhu);
  lcd.print(" C");
  lcd.setCursor(0, 1);
  lcd.print("Halo IoT Lab");
  delay(200);
}`,
    tasks: [
      "Ganti teks \"Halo IoT Lab\" dengan nama kelas Anda, lalu pindahkan ke baris kedua kolom ke-2 memakai setCursor(2, 1).",
      "Ubah nilai suhu menjadi 31 dan pastikan angka di layar ikut berubah.",
      "Panggil lcd.noBacklight() di setup() dan lihat layar menjadi redup, lalu kembalikan lcd.backlight().",
    ],
    hint: "Karakter yang melebihi lebar 16 kolom akan berpindah ke baris berikutnya secara otomatis, jadi jangan menulis teks terlalu panjang.",
    success: "Layar LCD menampilkan teks dan angka yang Anda ubah, dan posisi tulisan berpindah saat setCursor diubah.",
  },

  {
    id: "oled-running",
    level: 5,
    board: "esp32",
    title: "OLED 0.96\": teks berjalan & animasi",
    subtitle: "SSD1306Wire, clearDisplay, drawString, display",
    goal: "Membuat teks berjalan (running text) dan animasi pada layar OLED.",
    concepts: ["SSD1306Wire", "clearDisplay()", "drawString()", "display()", "buffer ganda"],
    parts: [
      { kind: "oled", label: "OLED 0.96\"", addr: "0x3C" },
    ],
    explain: [
      { h: "Buffer ganda", p: "Pustaka SSD1306 menggambar ke buffer di memori, lalu display() menyalinnya ke layar. Karena itu tiap frame animasi dimulai dari clearDisplay(), menggambar, lalu display()." },
      { h: "Koordinat piksel", p: "Layar 128x64 memakai koordinat piksel: drawString(x, y, teks) menempatkan teks di (x, y). Untuk running text, x digeser sedikit demi sedikit tiap loop()." },
      { h: "Kecepatan dari LANGKAH dan JEDA", p: "Teks bergeser LANGKAH piksel tiap frame dengan jeda JEDA milidetik. LANGKAH besar = cepat, JEDA kecil = halus." },
    ],
    sketch: `// Modul 15 - OLED running text
// TUGAS: ubah PESAN, LANGKAH, dan JEDA. Teks akan berjalan dari kanan ke kiri.

#include <SSD1306Wire.h>

SSD1306Wire display(0x3c, 5, 4);   // alamat I2C, pin SDA, pin SCL
String PESAN = "HALO DUNIA IoT  ";
int LANGKAH = 3;
int JEDA = 40;

int x = 128;

void setup() {
  display.init();
  display.flipScreenVertically();
  display.setFont(ArialMT_Plain_16);
}

void loop() {
  display.clearDisplay();
  display.drawString(x, 24, PESAN);
  display.drawRect(0, 0, 128, 64);
  display.display();
  x = x - LANGKAH;
  if (x < -display.textWidth(PESAN)) x = 128;
  delay(JEDA);
}`,
    tasks: [
      "Ganti PESAN dengan pengumuman Anda (tambahkan spasi di akhir agar jeda saat berputar). Perhatikan teks berjalan makin lancar.",
      "Ubah LANGKAH menjadi 6 dan JEDA menjadi 20 sehingga running text bergerak lebih cepat.",
      "Tambahkan animasi lain: panggil display.fillRect(0, 56, 128, 4) sebelum display.display() untuk membuat garis progress di bawah teks.",
    ],
    hint: "Nilai x mulai dari 128 (tepi kanan) dan berkurang terus. Saat x lebih kecil dari minus lebar teks, teks sudah keluar layar, maka x direset ke 128 agar berputar lagi.",
    success: "Teks berjalan mulus dari kanan ke kiri dan berulang, dan Anda bisa menambah bentuk lain (garis, kotak) sebagai animasi.",
  },
];

