export type Page = 'dashboard' | 'crimping' | 'subnetting' | 'ip-address' | 'crimping-intro' | 'fiber-optic' | 'topology' | 'iot' | 'iot-intro' | 'basic-computer' | 'cpu-details' | 'gpu-details' | 'ram-storage-details' | 'os-details' | 'socket-details' | 'network-protocols' | 'server' | 'cyber-security' | 'internet-working' | 'mikrotik-intro' | 'ftth-mapping' | 'digital-computation' | 'topology-advanced' | 'wifi' | 'esp-arduino' | 'sensor-modules';

export interface Module {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    progress: number;
    difficulty: 'Dasar' | 'Menengah' | 'Lanjutan';
    diffColor: string;
    accent: string;
    tags: string[];
    page: Page;
    /** Nama track/jenjang dalam alur pembelajaran (untuk pengelompokan di dashboard). */
    track: string;
    /** Nomor langkah global dalam alur pembelajaran (1-based, berurutan). */
    order: number;
}

/** Judul tiap track, ditampilkan berurutan di dashboard. */
export const LEARNING_TRACKS: string[] = [
    'Track 1 · Fondasi Komputer',
    'Track 2 · Dasar Jaringan',
    'Track 3 · Infrastruktur & Keamanan Jaringan',
    'Track 4 · Fiber Optic & FTTH',
    'Track 5 · IoT & Elektronika',
];

export interface LeaderboardEntry {
    rank: number;
    name: string;
    level: number;
    avatar: string;
    trend: string;
}

// Data lain seperti leaderboard, stats, dll. dihapus sesuai permintaan.
// Anda bisa menambahkannya kembali nanti jika diperlukan.
export const leaderboard: LeaderboardEntry[] = [];
export const recentActivity: any[] = [];
export const stats: any[] = [];
export const serverStatus: any[] = [];

// Alur pembelajaran: array diurutkan dari fondasi hingga IoT.
// Field `order` = nomor langkah global (1-based), `track` = pengelompokan jenjang.
export const modules: Module[] = [
  // ===================== TRACK 1 · FONDASI KOMPUTER =====================
  {
    id: 'digital-computation',
    icon: '🔢',
    title: 'Dasar Komputasi Digital',
    subtitle: 'Pelajari konversi sistem bilangan (Biner, Desimal, Hex) dan satuan data.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#f59e0b',
    accent: '#ef4444',
    tags: ['Bit', 'Byte', 'Biner', 'Heksadesimal', 'Konversi'],
    page: 'digital-computation',
    track: 'Track 1 · Fondasi Komputer',
    order: 1,
  },
  {
    id: 'basic-computer',
    icon: '🖥️',
    title: 'Dasar-Dasar Komputer',
    subtitle: 'Pahami anatomi komputer, dari komponen fisik (hardware) hingga program (software) yang menjalankannya.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#3b82f6',
    accent: '#3b82f6',
    tags: ['Hardware', 'Software', 'CPU', 'RAM'],
    page: 'basic-computer',
    track: 'Track 1 · Fondasi Komputer',
    order: 2,
  },
  {
    id: 'cpu-details',
    icon: '🧠',
    title: 'Detail CPU: Otak Komputer',
    subtitle: 'Selami lebih dalam tentang CPU, dari sejarah chip pertama hingga miliaran transistor di dalamnya.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#10b981',
    accent: '#10b981',
    tags: ['CPU', 'Hardware', 'Transistor', 'Arsitektur'],
    page: 'cpu-details',
    track: 'Track 1 · Fondasi Komputer',
    order: 3,
  },
  {
    id: 'gpu-details',
    icon: '🎮',
    title: 'Detail GPU: Otak Grafis Komputer',
    subtitle: 'Pelajari peran GPU dalam grafis, gaming, hingga komputasi paralel untuk aplikasi modern seperti AI.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#3b82f6',
    accent: '#3b82f6',
    tags: ['GPU', 'Hardware', 'Grafis', 'AI'],
    page: 'gpu-details',
    track: 'Track 1 · Fondasi Komputer',
    order: 4,
  },
  {
    id: 'ram-storage-details',
    icon: '💾',
    title: 'RAM & Storage: Evolusi Memori',
    subtitle: 'Jelajahi perbedaan RAM dan Storage, serta evolusi penyimpanan data dari pita magnetik hingga Project Silica.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#3b82f6',
    accent: '#3b82f6',
    tags: ['RAM', 'Storage', 'Hard Disk', 'SSD'],
    page: 'ram-storage-details',
    track: 'Track 1 · Fondasi Komputer',
    order: 5,
  },
  {
    id: 'socket-details',
    icon: '🧩',
    title: 'Socket & Slot Motherboard',
    subtitle: 'Kenali socket prosesor, slot RAM, slot ekspansi, konektor storage, dan port panel I/O.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#3b82f6',
    accent: '#22d3ee',
    tags: ['Socket', 'Slot', 'Motherboard', 'I/O', 'Komponen'],
    page: 'socket-details',
    track: 'Track 1 · Fondasi Komputer',
    order: 6,
  },
  {
    id: 'os-details',
    icon: '🪟',
    title: 'Sistem Operasi (OS)',
    subtitle: 'Pahami sejarah, fungsi inti, kernel, dan contoh sistem operasi populer di berbagai perangkat.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#3b82f6',
    accent: '#38bdf8',
    tags: ['OS', 'Kernel', 'Windows', 'Linux', 'Software'],
    page: 'os-details',
    track: 'Track 1 · Fondasi Komputer',
    order: 7,
  },

  // ===================== TRACK 2 · DASAR JARINGAN =====================
  {
    id: 'topology',
    icon: '🕸️',
    title: 'Dasar Dasar Jaringan',
    subtitle: 'Visualisasi topologi Bus, Star, Ring, dan Mesh secara interaktif.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#10b981',
    accent: '#3b82f6',
    tags: ['Topologi', 'Bus', 'Star', 'Ring', 'Mesh'],
    page: 'topology',
    track: 'Track 2 · Dasar Jaringan',
    order: 8,
  },
  {
    id: 'topology-advanced',
    icon: '🌐',
    title: 'Skala Jaringan: LAN, MAN, WAN, & Internet',
    subtitle: 'Pahami klasifikasi jaringan berdasarkan cakupan geografis dan bagaimana internet saling terhubung.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#10b981',
    accent: '#10b981',
    tags: ['LAN', 'MAN', 'WAN', 'Internet', 'Topologi'],
    page: 'topology-advanced',
    track: 'Track 2 · Dasar Jaringan',
    order: 9,
  },
  {
    id: 'crimping-intro',
    icon: '🔌',
    title: 'Pengenalan Kabel UTP',
    subtitle: 'Pelajari jenis, standar, dan cara kerja kabel UTP dalam jaringan.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#10b981',
    accent: '#f59e0b',
    tags: ['UTP', 'T568A', 'T568B', 'RJ45'],
    page: 'crimping',
    track: 'Track 2 · Dasar Jaringan',
    order: 10,
  },
  {
    id: 'ip-address',
    icon: '📡',
    title: 'Pengenalan IP Address',
    subtitle: 'Dasar-dasar alamat IP, kelas, dan fungsinya dalam jaringan.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#10b981',
    accent: '#00d4ff',
    tags: ['IPv4', 'Kelas IP', 'Alamat Jaringan'],
    page: 'ip-address',
    track: 'Track 2 · Dasar Jaringan',
    order: 11,
  },
  {
    id: 'wifi',
    icon: '📶',
    title: 'Dasar Jaringan Nirkabel',
    subtitle: 'Pahami cara kerja Wi-Fi, frekuensi, channel, dan standar keamanan.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#f59e0b',
    accent: '#3b82f6',
    tags: ['Wi-Fi', '2.4GHz', '5GHz', '802.11ax', 'WPA3'],
    page: 'wifi',
    track: 'Track 2 · Dasar Jaringan',
    order: 12,
  },
  {
    id: 'network-protocols',
    icon: '📜',
    title: 'Protokol Jaringan: Bahasa Komputer',
    subtitle: 'Pelajari aturan yang mengatur komunikasi perangkat di internet, dari email hingga streaming video.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#eab308',
    accent: '#eab308',
    tags: ['Protokol', 'TCP', 'UDP', 'HTTP', 'DNS'],
    page: 'network-protocols',
    track: 'Track 2 · Dasar Jaringan',
    order: 13,
  },
  {
    id: 'internet-working',
    icon: '🌍',
    title: 'Bagaimana Internet Bekerja',
    subtitle: 'Pelajari apa yang terjadi di balik layar saat kita membuka website atau menekan tombol kirim.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#3b82f6',
    accent: '#3b82f6',
    tags: ['Internet', 'DNS', 'Packet', 'TCP/IP', 'WAN'],
    page: 'internet-working',
    track: 'Track 2 · Dasar Jaringan',
    order: 14,
  },

  // ============ TRACK 3 · INFRASTRUKTUR & KEAMANAN JARINGAN ============
  {
    id: 'mikrotik-intro',
    icon: '🎛️',
    title: 'Pengenalan MikroTik',
    subtitle: 'Konfigurasi dasar router MikroTik dan pahami RouterOS.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#eab308',
    accent: '#ef4444',
    tags: ['MikroTik', 'RouterOS', 'Firewall', 'DHCP Server'],
    page: 'mikrotik-intro',
    track: 'Track 3 · Infrastruktur & Keamanan Jaringan',
    order: 15,
  },
  {
    id: 'server',
    icon: '🖧',
    title: 'Pengenalan Server',
    subtitle: 'Kenali jenis-jenis server, sistem operasi server, dan cara kerjanya.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#3b82f6',
    accent: '#8b5cf6',
    tags: ['Server', 'Client-Server', 'Web Server', 'Database'],
    page: 'server',
    track: 'Track 3 · Infrastruktur & Keamanan Jaringan',
    order: 16,
  },
  {
    id: 'cyber-security',
    icon: '🛡️',
    title: 'Pengenalan Cyber Security',
    subtitle: 'Pahami dasar-dasar keamanan siber, ancaman digital, dan cara melindungi data.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#eab308',
    accent: '#ef4444',
    tags: ['Keamanan', 'Malware', 'Enkripsi', 'Firewall'],
    page: 'cyber-security',
    track: 'Track 3 · Infrastruktur & Keamanan Jaringan',
    order: 17,
  },

  // ===================== TRACK 4 · FIBER OPTIC & FTTH =====================
  {
    id: 'fiber-optic',
    icon: '✨',
    title: 'Fiber Optic & FTTH',
    subtitle: 'Simulasi perhitungan redaman (loss budget) pada topologi FTTH.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#f59e0b',
    accent: '#a855f7',
    tags: ['FTTH', 'OLT', 'ONT', 'Splitter', 'dBm'],
    page: 'fiber-optic',
    track: 'Track 4 · Fiber Optic & FTTH',
    order: 18,
  },
  {
    id: 'ftth-mapping',
    icon: '🗺️',
    title: 'Mapping & Penempatan ODP — Jaringan FTTH',
    subtitle: 'Pelajari cara memetakan dan menempatkan ODP pada jaringan Fiber to the Home.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#eab308',
    accent: '#eab308',
    tags: ['FTTH', 'ODP', 'ODC', 'Mapping', 'Loss Budget'],
    page: 'ftth-mapping',
    track: 'Track 4 · Fiber Optic & FTTH',
    order: 19,
  },

  // ===================== TRACK 5 · IoT & ELEKTRONIKA =====================
  {
    id: 'iot-intro',
    icon: '🤖',
    title: 'Pengenalan Internet of Things',
    subtitle: 'Dari mesin Coca-Cola hingga kota pintar, jelajahi dunia IoT.',
    progress: 0,
    difficulty: 'Dasar',
    diffColor: '#3b82f6',
    accent: '#3b82f6',
    tags: ['IoT', 'Konsep', 'Sejarah', 'Hardware'],
    page: 'iot-intro',
    track: 'Track 5 · IoT & Elektronika',
    order: 20,
  },
  {
    id: 'esp-arduino',
    icon: '🧪',
    title: 'Arduino & ESP32',
    subtitle: 'Kenali platform Arduino dan ESP32 sebagai otak perangkat IoT, lengkap dengan perbandingannya.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#eab308',
    accent: '#00d4ff',
    tags: ['Arduino', 'ESP32', 'Mikrokontroler', 'IoT'],
    page: 'esp-arduino',
    track: 'Track 5 · IoT & Elektronika',
    order: 21,
  },
  {
    id: 'sensor-modules',
    icon: '📟',
    title: 'Modul Sensor Arduino & ESP',
    subtitle: 'Jelajahi jenis-jenis sensor: lingkungan, jarak & gerak, display, aktuator, hingga komunikasi.',
    progress: 0,
    difficulty: 'Menengah',
    diffColor: '#eab308',
    accent: '#10b981',
    tags: ['Sensor', 'DHT', 'Ultrasonik', 'RFID', 'Display'],
    page: 'sensor-modules',
    track: 'Track 5 · IoT & Elektronika',
    order: 22,
  },
];