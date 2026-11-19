// Tipe data ringan untuk katalog modul belajar (portal murni, tanpa backend).
// Dulu tipe ini datang dari api/apiClient.ts; setelah lapisan LMS/Firebase
// dihapus, definisi ini dipertahankan agar katalog & halaman modul tetap jalan.

export type Difficulty = 'Dasar' | 'Menengah' | 'Lanjutan';

export interface Module {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    progress?: number;
    difficulty: Difficulty;
    diffColor?: string;
    accent?: string;
    tags: string[];
    page?: string;
    tenantId?: string | null;
    subjectId?: string;
    classId?: string;
    isCustom?: boolean;
    contentType?: 'text' | 'pdf' | 'video' | 'simulator';
    content?: string;
    simulatorType?: 'crimping' | 'ip-address' | 'ftth';
    simulatorConfig?: any;
}
