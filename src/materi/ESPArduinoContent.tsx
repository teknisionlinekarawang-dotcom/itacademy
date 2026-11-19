import { Link } from 'react-router-dom';
import ImagePlaceholder from '../components/ImagePlaceholder';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const Code = ({ children, lang = 'cpp' }: { children: React.ReactNode, lang?: string }) => (
    <pre className="bg-[#07090f] p-4 rounded-lg my-4 overflow-x-auto">
        <code className={`font-mono text-xs text-white language-${lang}`}>{children}</code>
    </pre>
);

export default function ESPArduinoContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <p>
                Mikrokontroler (MCU) adalah sebuah "komputer dalam satu chip". Berbeda dengan CPU yang memerlukan komponen eksternal seperti RAM dan storage, MCU sudah mengintegrasikan prosesor, memori (RAM dan Flash), serta pin input/output (I/O) dalam satu sirkuit terpadu. Mereka adalah otak di balik miliaran perangkat elektronik, dari microwave hingga perangkat IoT canggih.
            </p>

            <SectionTitle number={1} title="Platform Arduino: Gerbang Menuju Dunia Elektronika" />
            <p>
                Arduino adalah platform elektronik open-source yang terdiri dari dua bagian utama: papan sirkuit fisik (hardware) dan perangkat lunak atau IDE (Integrated Development Environment) untuk menulis dan mengunggah kode ke papan. Arduino merevolusi dunia elektronika DIY (Do-It-Yourself) dengan membuatnya mudah diakses oleh pemula, seniman, dan desainer.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Arduino Uno</h4>
                    <p className="text-xs">Papan Arduino paling ikonik dan populer untuk pemula. Menggunakan mikrokontroler <strong className="text-white">ATmega328P</strong>. Ia memiliki semua yang Anda butuhkan untuk memulai: pin digital, pin analog, port USB untuk pemrograman, dan power jack.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Arduino IDE & Bahasa Pemrograman</h4>
                    <p className="text-xs">Kode untuk Arduino ditulis dalam bahasa C/C++ yang disederhanakan. Strukturnya sangat mudah dipahami, hanya terdiri dari dua fungsi utama: <strong className="text-white">`setup()`</strong> (berjalan sekali saat papan dinyalakan) dan <strong className="text-white">`loop()`</strong> (berjalan terus-menerus setelah `setup()` selesai).</p>
                </div>
            </div>
            <ImagePlaceholder
                src="https://www.robofun.ro/blog/wp-content/uploads/2016/10/arduino_uno_pinout.png"
                alt="Pinout Arduino Uno"
                caption="Diagram pinout Arduino Uno yang menunjukkan fungsi setiap pin."
            />
            <h4 className="font-bold text-white pt-4">Contoh Kode: "Blink"</h4>
            <p>Program "Hello, World!" di dunia mikrokontroler adalah membuat LED berkedip.</p>
            <Code lang="cpp">
                {`// Pin 13 memiliki LED bawaan di papan Arduino Uno
int ledPin = 13;

// Fungsi setup() berjalan sekali saat board dinyalakan
void setup() {
  // Mengatur pin LED sebagai OUTPUT
  pinMode(ledPin, OUTPUT);
}

// Fungsi loop() berjalan berulang-ulang selamanya
void loop() {
  digitalWrite(ledPin, HIGH);   // Menyalakan LED
  delay(1000);                  // Tunggu selama 1 detik (1000 milidetik)
  digitalWrite(ledPin, LOW);    // Mematikan LED
  delay(1000);                  // Tunggu selama 1 detik
}`}
            </Code>

            <SectionTitle number={2} title="Platform ESP32: Kekuatan IoT dalam Genggaman" />
            <p>
                ESP32 adalah seri mikrokontroler berbiaya rendah dan berdaya rendah yang dikembangkan oleh Espressif Systems. Tidak seperti Arduino Uno yang fokus pada kesederhanaan, ESP32 dirancang khusus untuk era IoT dengan mengintegrasikan <strong className="text-white">Wi-Fi dan Bluetooth</strong> langsung di dalam chip.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li><strong className="text-white">Prosesor Dual-Core:</strong> Memiliki dua inti prosesor yang bisa berjalan secara independen, memungkinkan multitasking yang lebih baik (misal: satu core menangani koneksi Wi-Fi, core lainnya menjalankan program utama).</li>
                <li><strong className="text-white">Konektivitas Bawaan:</strong> Wi-Fi dan Bluetooth (Classic & BLE) sudah terintegrasi, menghilangkan kebutuhan akan modul tambahan yang mahal dan rumit.</li>
                <li><strong className="text-white">Fleksibilitas Pemrograman:</strong> Dapat diprogram menggunakan berbagai platform, termasuk Arduino IDE (dengan tambahan board manager), PlatformIO (lebih profesional), dan bahkan MicroPython.</li>
                <li><strong className="text-white">Kaya Fitur:</strong> Memiliki lebih banyak pin I/O, sensor sentuh (touch sensor), sensor efek Hall, dan fitur keamanan canggih.</li>
            </ul>
            <ImagePlaceholder
                src="https://i0.wp.com/randomnerdtutorials.com/wp-content/uploads/2018/08/esp32-pinout-reference-espressif.jpg?w=700&quality=100&strip=all&ssl=1"
                alt="Pinout ESP32 Dev Kit"
                caption="Contoh pinout untuk salah satu papan pengembangan ESP32 yang populer."
            />
            <h4 className="font-bold text-white pt-4">Contoh Kode: Menghubungkan ke Wi-Fi</h4>
            <p>Dengan ESP32, menghubungkan proyek Anda ke internet menjadi sangat mudah.</p>
            <Code lang="cpp">
                {`#include <WiFi.h>

const char* ssid = "NAMA_WIFI_ANDA";
const char* password = "PASSWORD_WIFI_ANDA";

void setup() {
  Serial.begin(115200);
  delay(10);

  Serial.println();
  Serial.print("Menghubungkan ke ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi terhubung!");
  Serial.print("Alamat IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Program utama Anda bisa berjalan di sini
}`}
            </Code>

            <SectionTitle number={3} title="Perbandingan: Arduino Uno vs ESP32" />
            <p>
                Memilih antara Arduino dan ESP32 bergantung pada kebutuhan proyek Anda. Arduino adalah pilihan terbaik untuk belajar dasar, sementara ESP32 adalah lompatan besar untuk proyek yang memerlukan konektivitas dan kekuatan pemrosesan.
            </p>
            <div className="overflow-x-auto my-4">
                <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.05)]">
                            <th className="p-2">Fitur</th>
                            <th className="p-2">Arduino Uno (ATmega328P)</th>
                            <th className="p-2">ESP32</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Prosesor</td>
                            <td className="p-2">Single-Core 8-bit</td>
                            <td className="p-2">Dual-Core 32-bit</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Clock Speed</td>
                            <td className="p-2">16 MHz</td>
                            <td className="p-2">160 - 240 MHz</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">SRAM (RAM)</td>
                            <td className="p-2">2 KB</td>
                            <td className="p-2">520 KB</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Flash Memory</td>
                            <td className="p-2">32 KB</td>
                            <td className="p-2">4 MB - 16 MB</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Wi-Fi / Bluetooth</td>
                            <td className="p-2 text-red-400">Tidak Ada (Perlu Modul)</td>
                            <td className="p-2 text-green-400">Terintegrasi</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Terbaik Untuk</td>
                            <td className="p-2">Pemula, Proyek Elektronika Dasar</td>
                            <td className="p-2">Proyek IoT, Komputasi Kompleks</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Tombol Navigasi Materi Berikutnya */}
            <div className="pt-8 border-t border-[rgba(0,212,255,0.1)] text-center">
                <Link
                    to="/module/sensor-modules"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-sm hover:bg-white transition-all duration-200 glow-cyan"
                >
                    <span>Materi Berikutnya: Jenis-jenis Modul Sensor</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
}