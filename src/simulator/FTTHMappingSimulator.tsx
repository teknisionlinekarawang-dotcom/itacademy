import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* =====================================================================
   FTTHMappingSimulator
   ---------------------------------------------------------------------
   Simulasi Mapping Fiber to the Home (FTTH) interaktif berbasis map
   menggunakan React Leaflet. Place ODC/ODP/Rumah markers, then use
   "Draw Cable" to konekt ODP -> Rumah and lihat atenuasi based on
   jarak (Good < 150m, Warning < 200m, High > 200m).

   Cara pakai:
       import FTTHMappingSimulator from './simulator/FTTHMappingSimulator';
       <FTTHMappingSimulator />

   Fitur:
   1. Peta React Leaflet centrat di area suburbano (default).
   2. Sidebar diga untuk: Add ODC, Add ODP, Add House, Eraser.
   3. Marker custom: ODC = Biru, ODP = Merah, Rumah = Joung.
   4. Draw Cable ODP -> Rumah (drop core) avec atenuasi color coded.
   5. Dashboard stats; "Calculate Link Budget" button.
   ===================================================================== */

/* ---- Constantes regules FTTH ------------------------------------------- */
const MAX_PORT = 8;              // Maksimal port per ODP
const GOOD_MAX = 150;            // jarak ideal (meter)
const WARN_MAX = 200;            // jarak jalogram an (meter)
const OLT_TX = 3;                // daya transmitter OLT (+3 dBm)
const FIBER_LOSS_KM = 0.35;      // dB/km @ 1310nm
const SPLITTER_LOSS = 10.5;      // dB loss splitter 1:8 di ODP
const CONNECTOR_LOSS = 0.2;      // dB per konektor
const SPLICE_LOSS = 0.3;         // dB per sambungan

/* ---- Koordinat default: area perumahan (suburb) ------------------------- */
const INITIAL_CENTER: [number, number] = [-6.9176, 107.6191]; // Bandung, Indonesia
const INITIAL_ZOOM = 16;

/* ---- Jenis marker --------------------------------------------------------- */
type ToolId = 'odc' | 'odp' | 'house' | 'cable' | 'feeder' | 'erase' | 'select';

interface ToolDef {
    id: ToolId;
    icon: string;
    label: string;
    desc: string;
    swatch: string;
}

const TOOLS: ToolDef[] = [
    { id: 'odc', icon: '🗄️', label: 'ADD ODC', desc: 'Optical Distribution Cabinet', swatch: 'bg-[#3b82f6]' },
    { id: 'odp', icon: '📦', label: 'ADD ODP', desc: 'Optical Distribution Pack', swatch: 'bg-[#ef4444]' },
    { id: 'house', icon: '🏠', label: 'ADD HOUSE', desc: 'Subscriber Premises', swatch: 'bg-[#22c55e]' },
    { id: 'cable', icon: '🧵', label: 'DRAW CABLE', desc: 'connect ODP to House', swatch: 'bg-[#f59e0b]' },
    { id: 'feeder', icon: '🗺️', label: 'FEEDER CABLE', desc: 'connect ODC to ODP', swatch: 'bg-[#3b82f6]' },
];

interface PlacedNode {
    id: string;
    label: string;
    lat: number;
    lng: number;
}

interface DropCable {
    id: string;
    odpId: string;
    houseId: string;
    distanceM: number;
    route?: [number, number][];
}

interface FeederCable {
    id: string;
    odcId: string;
    odpId: string;
    distanceM: number;
    route?: [number, number][];
}

/* ---- Helper: jarak haversine (meter) -------------------------------------- */
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}

function statusOf(meters: number): 'good' | 'warning' | 'danger' {
    if (meters <= GOOD_MAX) return 'good';
    if (meters <= WARN_MAX) return 'warning';
    return 'danger';
}

/* ---- Helper: total jarak sepanjang rute (polyline) & titik tengah ------------- */
function routeDistanceMeters(route: [number, number][]): number {
    let dist = 0;
    for (let i = 0; i < route.length - 1; i++) {
        dist += haversineMeters(route[i][0], route[i][1], route[i + 1][0], route[i + 1][1]);
    }
    return dist;
}

function routeMidpoint(route: [number, number][]): [number, number] {
    if (route.length <= 1) return route[0] ?? [0, 0];
    const total = routeDistanceMeters(route);
    let acc = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const seg = haversineMeters(route[i][0], route[i][1], route[i + 1][0], route[i + 1][1]);
        if (acc + seg >= total / 2) {
            const t = seg > 0 ? (total / 2 - acc) / seg : 0;
            return [
                route[i][0] + (route[i + 1][0] - route[i][0]) * t,
                route[i][1] + (route[i + 1][1] - route[i][1]) * t,
            ];
        }
        acc += seg;
    }
    return route[route.length - 1];
}

const CABLE_COLOR: Record<'good' | 'warning' | 'danger', string> = {
    good: '#22c55e',
    warning: '#facc15',
    danger: '#ef4444',
};

const STATUS_STYLE: Record<'good' | 'warning' | 'danger', { label: string; text: string }> = {
    good: { label: 'BAIK', text: 'text-green-400' },
    warning: { label: 'WARNING', text: 'text-yellow-400' },
    danger: { label: 'TINGGI', text: 'text-red-400' },
};

/* ---- Marker custom (divIcon, no image asset) -------------------------------- */
function makeIcon(html: string, size: [number, number], anchor?: [number, number]): L.DivIcon {
    return L.divIcon({
        className: 'ftth-icon-root',
        html,
        iconSize: size,
        iconAnchor: anchor ?? [Math.round(size[0] / 2), Math.round(size[1] / 2)],
    });
}

/* =====================================================================
   Data exemple (demo) didact - koordinat suburb.
   ===================================================================== */
function buildDemoData() {
    const odcs: PlacedNode[] = [{ id: 'demo-odc', label: 'ODC-01', lat: -6.9174, lng: 107.6191 }];
    const odps: PlacedNode[] = [
        { id: 'demo-odp1', label: 'ODP-01', lat: -6.9180, lng: 107.6193 },
        { id: 'demo-odp2', label: 'ODP-02', lat: -6.9171, lng: 107.6194 },
    ];
    const houses: PlacedNode[] = [
        { id: 'demo-h1', label: 'H1', lat: -6.91795, lng: 107.61932 },
        { id: 'demo-h2', label: 'H2', lat: -6.91805, lng: 107.61928 },
        { id: 'demo-h3', label: 'H3', lat: -6.91785, lng: 107.61942 },
        { id: 'demo-h4', label: 'H4', lat: -6.91810, lng: 107.61920 },
        { id: 'demo-h5', label: 'H5', lat: -6.91808, lng: 107.61945 },
        { id: 'demo-h6', label: 'H6', lat: -6.91930, lng: 107.61960 },
        { id: 'demo-h7', label: 'H7', lat: -6.91960, lng: 107.61970 },
        { id: 'demo-h8', label: 'H8', lat: -6.91705, lng: 107.61942 },
        { id: 'demo-h9', label: 'H9', lat: -6.91690, lng: 107.61930 },
        { id: 'demo-h10', label: 'H10', lat: -6.91630, lng: 107.61950 },
        { id: 'demo-h11', label: 'H11', lat: -6.91620, lng: 107.61960 },
        { id: 'demo-h12', label: 'H12', lat: -6.91510, lng: 107.61980 },
    ];
    const links: [string, string][] = [
        ['demo-odp1', 'demo-h1'],
        ['demo-odp1', 'demo-h2'],
        ['demo-odp1', 'demo-h3'],
        ['demo-odp1', 'demo-h4'],
        ['demo-odp1', 'demo-h5'],
        ['demo-odp1', 'demo-h6'],
        ['demo-odp2', 'demo-h8'],
        ['demo-odp2', 'demo-h9'],
        ['demo-odp2', 'demo-h10'],
        ['demo-odp2', 'demo-h11'],
        ['demo-odp2', 'demo-h12'],
    ];
    const cables: DropCable[] = links.map(([o, h], i) => {
        const odp = odps.find((x) => x.id === o)!;
        const house = houses.find((x) => x.id === h)!;
        return {
            id: `demo-cable-${i}`,
            odpId: o,
            houseId: h,
            distanceM: Math.round(haversineMeters(odp.lat, odp.lng, house.lat, house.lng)),
        };
    });

    // Kabel feeder dari ODC ke setiap ODP
    const feederLinks: [string, string][] = [
        ['demo-odc', 'demo-odp1'],
        ['demo-odc', 'demo-odp2'],
    ];
    const feeders: FeederCable[] = feederLinks.map(([o, p], i) => {
        const odc = odcs.find((x) => x.id === o)!;
        const odp = odps.find((x) => x.id === p)!;
        return {
            id: `demo-feeder-${i}`,
            odcId: o,
            odpId: p,
            distanceM: Math.round(haversineMeters(odc.lat, odc.lng, odp.lat, odp.lng)),
        };
    });

    return { odcs, odps, houses, cables, feeders };
}

/* =====================================================================
   CSS marker local (no external dependency)
   ===================================================================== */
const MARKER_CSS = `
.ftth-icon-root { background: transparent; border: none; box-shadow: none; }
.ftth-marker {
  position:relative; display:flex; align-items:center; justify-content:center;
  width:50px; height:50px; border-radius:50%;
  border:2px solid rgba(255,255,255,0.85);
  box-shadow:0 2px 12px rgba(0,0,0,0.45);
  cursor:pointer; font-size:22px; user-select:none;
  transition:transform 0.15s ease;
}
.ftth-marker:hover { transform:scale(1.15); }
.ftth-marker-odc { background:linear-gradient(150deg,#1d4ed8,#3b82f6); }
.ftth-marker-odp { background:linear-gradient(150deg,#dc2626,#ef4444); }
.ftth-marker-house { background:linear-gradient(150deg,#15803d,#22c55e); width:42px; height:42px; }
.ftth-marker-full { background:rgba(15,23,42,0.9); border-style:dashed; opacity:0.9; }
.ftth-odp-selected { box-shadow:0 0 0 4px rgba(250,204,21,0.5), 0 2px 12px rgba(0,0,0,0.45); }
.ftth-marker-tag {
  position:absolute; bottom:-6px; left:50%; transform:translateX(-50%);
  font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:700;
  background:rgba(7,9,15,0.9); color:#fff; padding:0 3px; border-radius:3px; white-space:nowrap;
}
.ftth-port-badge {
  position:absolute; top:-8px; right:-8px; text-align:center; min-width:22px;
  font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700;
  background:#fff; color:#0b1220; padding:1px 4px; border-radius:999px;
  border:1px solid #07090f; box-shadow:0 1px 6px rgba(0,0,0,0.4);
}
.ftth-dist {
  position:relative; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700;
  padding:2px 5px; border-radius:999px; border:1px solid rgba(255,255,255,0.6);
  box-shadow:0 1px 6px rgba(0,0,0,0.4); white-space:nowrap; text-align:center;
}
.ftth-dist-good { background:#22c55e; color:#fff; }
.ftth-dist-warning { background:#facc15; color:#0b1220; }
.ftth-dist-danger { background:#ef4444; color:#fff; animation:ftth-danger 0.9s ease-in-out infinite; }
@keyframes ftth-danger { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
.leaflet-container.ftth-map { background:#0b1020; }
`;
function odcIcon(): L.DivIcon {
    return makeIcon(
        `<div class="ftth-marker ftth-marker-odc"><span>🗄️</span><span class="ftth-marker-tag">ODC</span></div>`,
        [50, 50]
    );
}

function odpIcon(used: number, selected: boolean): L.DivIcon {
    const full = used >= MAX_PORT;
    const selectedCls = selected ? ' ftth-odp-selected' : '';
    const fullCls = full ? ' ftth-marker-full' : '';
    return makeIcon(
        `<div class="ftth-marker ftth-marker-odp${selectedCls}${fullCls}"><span>📦</span>` +
            `<span class="ftth-port-badge">${used}/${MAX_PORT}</span></div>`,
        [50, 50]
    );
}

function houseIcon(): L.DivIcon {
    return makeIcon(`<div class="ftth-marker ftth-marker-house"><span>🏠</span></div>`, [42, 42]);
}

function distIcon(meters: number): L.DivIcon {
    const st = statusOf(meters);
    return makeIcon(
        `<div class="ftth-dist ftth-dist-${st}">${Math.round(meters)} m</div>`,
        [56, 20],
        [28, 10]
    );
}

/* =====================================================================
   Sub-komponent hooks (mape click / map store)
   ===================================================================== */
function StoreMap({ mapRef }: { mapRef: { current: L.Map | null } }) {
    const map = useMap();
    useEffect(() => {
        mapRef.current = map;
    }, [map, mapRef]);
    return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

/* =====================================================================
   Komponen utama
   ===================================================================== */
export default function FTTHMappingSimulator() {
    const [tool, setTool] = useState<ToolId>('select');
    const [odcs, setOdCs] = useState<PlacedNode[]>([]);
    const [odps, setOdps] = useState<PlacedNode[]>([]);
    const [houses, setHouses] = useState<PlacedNode[]>([]);
    const [cables, setCables] = useState<DropCable[]>([]);
    const [feeders, setFeeders] = useState<FeederCable[]>([]);
    const [selectedOdpId, setSelectedOdpId] = useState<string | null>(null);
    const [selectedOdcId, setSelectedOdcId] = useState<string | null>(null);
    const [satellite, setSatellite] = useState(false);
    const [draftRoute, setDraftRoute] = useState<[number, number][]>([]);
    const [flashMsg, setFlashMsg] = useState<string | null>(null);
    const [alertMsg, setAlertMsg] = useState<{ kind: 'error' | 'info'; text: string } | null>(null);
    const [showBudget, setShowBudget] = useState(false);

    const mapRef = useRef<L.Map | null>(null);
    const uidCounter = useRef(0);
    const uid = () => `n${++uidCounter.current}`;

    /* ---- Auto-clear flash & alert ----------------------------------------- */
    useEffect(() => {
        if (!flashMsg) return;
        const t = setTimeout(() => setFlashMsg(null), 4200);
        return () => clearTimeout(t);
    }, [flashMsg]);

    useEffect(() => {
        if (!alertMsg) return;
        const t = setTimeout(() => setAlertMsg(null), 6500);
        return () => clearTimeout(t);
    }, [alertMsg]);

    /* ---- Escape batal tool / seleksi ---------------------------------- */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedOdpId(null);
                setSelectedOdcId(null);
                setDraftRoute([]);
                setTool('select');
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    /* ---- Port usage tiap ODP (useMemo) ------------------------------------- */
    const odpUsage = useMemo(() => {
        const m: Record<string, number> = {};
        odps.forEach((o) => (m[o.id] = 0));
        cables.forEach((c) => {
            if (m[c.odpId] !== undefined) m[c.odpId]++;
        });
        return m;
    }, [odps, cables]);

    /* ---- Stats dashboard (useMemo) ------------------------------------------------ */
    const stats = useMemo(() => {
        const connectedHouses = new Set(cables.map((c) => c.houseId)).size;
        const totalLength = cables.reduce((s, c) => s + c.distanceM, 0);
        const hasDanger = cables.some((c) => statusOf(c.distanceM) === 'danger');
        const hasWarn = cables.some((c) => statusOf(c.distanceM) === 'warning');

        let status = { text: 'Belum Ada Koneksi', dot: 'bg-slate-400', textCls: 'text-slate-300' };
        if (cables.length > 0) {
            if (hasDanger) status = { text: 'Perlu Perbaikan', dot: 'bg-red-500', textCls: 'text-red-400' };
            else if (hasWarn) status = { text: 'Warning', dot: 'bg-yellow-400', textCls: 'text-yellow-400' };
            else status = { text: 'Optimal', dot: 'bg-green-400', textCls: 'text-green-400' };
        }
        return {
            odcCount: odcs.length,
            odpCount: odps.length,
            connectedHouses,
            totalLength,
            cableCount: cables.length,
            feederCount: feeders.length,
            status,
        };
    }, [odcs, odps, cables, feeders]);

    /* ---- Klik peta: tempatkan marker sesuai tool ----------------------------- */
    const handleMapClick = useCallback(
        (lat: number, lng: number) => {
            if (tool === 'odc') {
                const id = uid();
                const label = `ODC-${odcs.length + 1}`;
                setOdCs((p) => [...p, { id, label, lat, lng }]);
                setFlashMsg(`Ditempatkan ODC "${label}" (Biru).`);
            } else if (tool === 'odp') {
                const id = uid();
                const label = `ODP-${odps.length + 1}`;
                setOdps((p) => [...p, { id, label, lat, lng }]);
                setFlashMsg(`Ditempatkan ODP "${label}" (Merah) — ${MAX_PORT} port tersedia.`);
            } else if (tool === 'house') {
                const id = uid();
                const label = `H${houses.length + 1}`;
                setHouses((p) => [...p, { id, label, lat, lng }]);
                setFlashMsg(`Ditempatkan Rumah "${label}" (Hijau).`);
            } else if (tool === 'cable') {
                if (selectedOdpId) {
                    setDraftRoute((p) => [...p, [lat, lng]]);
                    setFlashMsg(
                        `Titik rute ditambahkan (${draftRoute.length} titik). Klik marker Rumah (Hijau) untuk menyelesaikan kabel. Tekan ESC untuk batal.`
                    );
                } else {
                    setFlashMsg(
                        'Pilih ODP dulu: klik marker ODP (Merah) → klik peta untuk membuat rute → klik Rumah untuk selesai.'
                    );
                }
            } else if (tool === 'feeder') {
                if (selectedOdcId) {
                    setDraftRoute((p) => [...p, [lat, lng]]);
                    setFlashMsg(
                        `Titik rute feeder ditambahkan (${draftRoute.length} titik). Klik marker ODP (Merah) untuk selesai. Tekan ESC untuk batal.`
                    );
                } else {
                    setFlashMsg(
                        'Pilih ODC dulu: klik marker ODC (Biru) → pilih peta untuk membuat rute → ODP untuk selesai.'
                    );
                }
            }
        },
        [tool, odcs, odps, houses, selectedOdpId, selectedOdcId]
    );

    /* ---- Tarik kabel ODP -> Rumah (drop core) ------------------------------ */
    const drawCable = useCallback(
        (odpId: string, houseId: string) => {
            const odp = odps.find((o) => o.id === odpId);
            const house = houses.find((h) => h.id === houseId);
            if (!odp || !house) return;
            if (cables.some((c) => c.odpId === odpId && c.houseId === houseId)) {
                setFlashMsg('Kabel drop ke rumah ini sudah ada dari ODP tersebut.');
                setDraftRoute([]);
                setSelectedOdpId(null);
                return;
            }
            const used = cables.filter((c) => c.odpId === odpId).length;
            if (used >= MAX_PORT) {
                setAlertMsg({
                    kind: 'error',
                    text: `ODP "${odp.label}" penuh (${used}/${MAX_PORT} port). Pilih ODP lain.`,
                });
                setDraftRoute([]);
                setSelectedOdpId(null);
                return;
            }
            // Bangun rute polyline: titik awal di ODP + waypoint dari draft + titik akhir di Rumah
            const route: [number, number][] = [...draftRoute, [house.lat, house.lng]];
            const dist = routeDistanceMeters(route);
            setCables((p) => [...p, { id: uid(), odpId, houseId, distanceM: Math.round(dist), route }]);
            setDraftRoute([]);
            setSelectedOdpId(null);
            const st = statusOf(dist);
            if (st === 'danger') {
                setAlertMsg({
                    kind: 'error',
                    text: `Kabel MERAH! ${Math.round(dist)} m (> ${WARN_MAX} m) — redaman tinggi. Pindahkan ODP lebih dekat.`,
                });
            } else {
                setFlashMsg(
                    st === 'good'
                        ? `Kabel HIJAU: ${Math.round(dist)} m (< ${GOOD_MAX} m) — sinyal baik.`
                        : `Kabel KUNING: ${Math.round(dist)} m (${GOOD_MAX}–${WARN_MAX} m) — awas redaman.`
                );
            }
        },
        [odps, houses, cables, draftRoute]
    );

    /* ---- Tarik kabel feeder ODC -> ODP ---------------------------------- */
    const drawFeeder = useCallback(
        (odcId: string, odpId: string) => {
            const odc = odcs.find((o) => o.id === odcId);
            const odp = odps.find((o) => o.id === odpId);
            if (!odc || !odp) return;
            if (feeders.some((f) => f.odcId === odcId && f.odpId === odpId)) {
                setFlashMsg('Kabel feeder dari ODC ini ke ODP tersebut sudah ada.');
                setDraftRoute([]);
                setSelectedOdcId(null);
                return;
            }
            const route: [number, number][] = [...draftRoute, [odp.lat, odp.lng]];
            const dist = routeDistanceMeters(route);
            setFeeders((p) => [...p, { id: uid(), odcId, odpId, distanceM: Math.round(dist), route }]);
            setDraftRoute([]);
            setSelectedOdcId(null);
            setFlashMsg(
                `Kabel feeder ${odc.label} → ${odp.label} terpasang: ${Math.round(dist)} m (rute ${route.length} titik).`
            );
        },
        [odcs, odps, feeders, draftRoute]
    );

    /* ---- Hapus kabel saat tool 'erase' ----------------------------------- */
    const removeCable = useCallback((id: string) => {
        setCables((p) => p.filter((c) => c.id !== id));
        setFlashMsg('Kabel drop dihapus.');
    }, []);
    const removeFeeder = useCallback((id: string) => {
        setFeeders((p) => p.filter((f) => f.id !== id));
        setFlashMsg('Kabel feeder dihapus.');
    }, []);

    /* ---- Klik pada marker --------------------------------------------------- */
    const handleNodeClick = useCallback(
        (kind: 'odc' | 'odp' | 'house', id: string) => {
            if (tool === 'erase') {
                if (kind === 'odc') {
                    setOdCs((p) => p.filter((x) => x.id !== id));
                    setFeeders((p) => p.filter((f) => f.odcId !== id));
                    if (selectedOdcId === id) setSelectedOdcId(null);
                } else if (kind === 'odp') {
                    setOdps((p) => p.filter((x) => x.id !== id));
                    setCables((p) => p.filter((c) => c.odpId !== id));
                    setFeeders((p) => p.filter((f) => f.odpId !== id));
                    if (selectedOdpId === id) setSelectedOdpId(null);
                } else {
                    setHouses((p) => p.filter((x) => x.id !== id));
                    setCables((p) => p.filter((c) => c.houseId !== id));
                }
                return;
            }

            if (tool === 'cable') {
                if (kind === 'odp') {
                    const odp = odps.find((o) => o.id === id);
                    if (!odp) return;
                    if (selectedOdpId === id) {
                        setSelectedOdpId(null);
                        setDraftRoute([]);
                        setFlashMsg(`ODP "${odp.label}" dibatalkan.`);
                        return;
                    }
                    const used = cables.filter((c) => c.odpId === id).length;
                    if (used >= MAX_PORT) {
                        setAlertMsg({
                            kind: 'error',
                            text: `ODP "${odp.label}" sudah penuh (${used}/${MAX_PORT} port). Silakan pilih ODP lain.`,
                        });
                        setDraftRoute([]);
                        return;
                    }
                    setSelectedOdpId(id);
                    setSelectedOdcId(null);
                    setDraftRoute([[odp.lat, odp.lng]]);
                    setFlashMsg(`ODP "${odp.label}" dipilih — klik peta untuk membuat rute, klik Rumah untuk selesai.`);
                } else if (kind === 'house') {
                    if (selectedOdpId) drawCable(selectedOdpId, id);
                    else setFlashMsg('Pilih ODP dulu: klik marker ODP (Merah), lalu Rumah.');
                }
                return;
            }

            if (tool === 'feeder') {
                if (kind === 'odc') {
                    const odc = odcs.find((o) => o.id === id);
                    if (!odc) return;
                    if (selectedOdcId === id) {
                        setSelectedOdcId(null);
                        setDraftRoute([]);
                        setFlashMsg(`ODC "${odc.label}" dibatalkan.`);
                        return;
                    }
                    setSelectedOdcId(id);
                    setSelectedOdpId(null);
                    setDraftRoute([[odc.lat, odc.lng]]);
                    setFlashMsg(`ODC "${odc.label}" dipilih — klik peta untuk membuat rute feeder, klik ODP untuk selesai.`);
                } else if (kind === 'odp') {
                    if (selectedOdcId) drawFeeder(selectedOdcId, id);
                    else setFlashMsg('Pilih ODC dulu: klik marker ODC (Biru), lalu ODP.');
                }
                return;
            }

            // Mode info: tampilkan info singkat
            if (kind === 'odp') {
                const used = cables.filter((c) => c.odpId === id).length;
                const odp = odps.find((o) => o.id === id);
                if (odp) setFlashMsg(`ODP "${odp.label}" — ${used}/${MAX_PORT} port terpakai.`);
            }
        },
        [tool, odps, cables, feeders, selectedOdpId, selectedOdcId, drawCable, drawFeeder]
    );

    /* ---- Reset -------------------------------------------------------------- */
    const handleReset = useCallback(() => {
        setOdCs([]);
        setOdps([]);
        setHouses([]);
        setCables([]);
        setFeeders([]);
        setSelectedOdpId(null);
        setSelectedOdcId(null);
        setDraftRoute([]);
        setTool('select');
        setAlertMsg(null);
        setFlashMsg('Peta direset. Mulai dengan menempatkan ODC/ODP/Rumah.');
    }, []);

    /* ---- Muat demo ---------------------------------------------------------------- */
    const handleDemo = useCallback(() => {
        const d = buildDemoData();
        setOdCs(d.odcs);
        setOdps(d.odps);
        setHouses(d.houses);
        setCables(d.cables);
        setFeeders(d.feeders);
        setSelectedOdpId(null);
        setSelectedOdcId(null);
        setDraftRoute([]);
        setTool('select');
        setFlashMsg('Data contoh dimuat. Perhatikan kabel feeder (biru putus), lalu coba "Calculate Link Budget".');
    }, []);

    /* ---- Link budget (useMemo) ------------------------------------------------------------ */
    const budget = useMemo(() => {
        const totalM = cables.reduce((s, c) => s + c.distanceM, 0) + feeders.reduce((s, f) => s + f.distanceM, 0);
        const fiberLoss = (totalM / 1000) * FIBER_LOSS_KM;
        const splitterLoss = odps.length > 0 ? SPLITTER_LOSS : 0;
        const connectorLoss = cables.length * 2 * CONNECTOR_LOSS;
        const spliceLoss = (odcs.length + odps.length) * SPLICE_LOSS;
        const totalLoss = fiberLoss + splitterLoss + connectorLoss + spliceLoss;
        const rx = OLT_TX - totalLoss;
        let st: 'BAIK' | 'CUKUP' | 'BURUK' = 'BAIK';
        let color = 'text-green-400';
        if (rx < -27) { st = 'BURUK'; color = 'text-red-400'; }
        else if (rx < -24) { st = 'CUKUP'; color = 'text-yellow-400'; }
        return { totalM, fiberLoss, splitterLoss, connectorLoss, spliceLoss, totalLoss, rx, st, color };
    }, [cables, odps, odcs]);

    const selectedOdp = selectedOdpId ? odps.find((o) => o.id === selectedOdpId) : null;
    const activeToolDesc = TOOLS.find((t) => t.id === tool)?.desc;

    return (
        <div className="w-full">
            <style>{MARKER_CSS}</style>

            {/* Header + legenda */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[#00d4ff]">
                    <span className="text-xl">🗺️</span>
                </div>
                <div className="min-w-0">
                    <h2 className="font-display text-xl md:text-2xl font-bold text-white">
                        Simulator Mapping FTTH
                    </h2>
                    <p className="text-xs text-[#64748b] mt-1">
                        Tempatkan ODC/ODP/Rumah di peta, tarik kabel feeder ODC-ODP lalu drop core ODP-Rumah
                        mengikuti rute (polyline). Aktifkan mode satelit untuk melihat peta udara.
                    </p>
                </div>
                <span className="ml-auto hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] text-[10px] font-mono text-[#00d4ff]">
                    React Leaflet • Rule 150m/200m
                </span>
            </div>

            {/* Legenda chip */}
            <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono border border-[rgba(59,130,246,0.3)] text-[#3b82f6] bg-[#3b82f6]/10"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> ODC</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono border border-[rgba(239,68,68,0.3)] text-[#ef4444] bg-[#ef4444]/10"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> ODP</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono border border-[rgba(34,197,94,0.3)] text-[#22c55e] bg-[#22c55e]/10"><span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> House</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono border border-[rgba(59,130,246,0.3)] text-[#3b82f6] bg-[#3b82f6]/10"><span className="w-4 h-1.5 rounded-full bg-[#3b82f6]" /> Feeder</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono border border-[rgba(34,197,94,0.3)] text-green-400 bg-green-500/10"><span className="w-4 h-1.5 rounded-full bg-[#22c55e]" /> &lt;150m Good</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono border border-[rgba(250,204,21,0.3)] text-yellow-400 bg-yellow-500/10"><span className="w-4 h-1.5 rounded-full bg-[#facc15]" /> 150–200m Warn</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono border border-[rgba(239,68,68,0.3)] text-red-400 bg-red-500/10"><span className="w-4 h-1.5 rounded-full bg-[#ef4444]" /> &gt;200m High Att.</span>
            </div>

            {/* Map + floating panels */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-[rgba(0,212,255,0.15)] bg-[#07090f]" style={{ height: 600 }}>

    <MapContainer
                    center={INITIAL_CENTER}
                    zoom={INITIAL_ZOOM}
                    scrollWheelZoom
                    zoomControl={false}
                    attributionControl
                    className="w-full h-full ftth-map"
                >
                    <TileLayer
                        attribution={
                            satellite
                                ? '&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
                                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }
                        url={
                            satellite
                                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    />
                    <StoreMap mapRef={mapRef} />
                    <MapClickHandler onMapClick={handleMapClick} />

                    {selectedOdp && (
                        <>
                            <Circle
                                center={[selectedOdp.lat, selectedOdp.lng]}
                                radius={GOOD_MAX}
                                pathOptions={{ color: '#22c55e', weight: 1, opacity: 0.6, dashArray: '4 6', fillColor: '#22c55e', fillOpacity: 0.04 }}
                            />
                            <Circle
                                center={[selectedOdp.lat, selectedOdp.lng]}
                                radius={WARN_MAX}
                                pathOptions={{ color: '#facc15', weight: 1, opacity: 0.6, dashArray: '4 6', fillColor: '#facc15', fillOpacity: 0.04 }}
                            />
                        </>
                    )}

                    {draftRoute.length > 1 && (
                        <Polyline
                            positions={draftRoute}
                            pathOptions={{ color: '#00d4ff', weight: 3, opacity: 0.6, dashArray: '5 6' }}
                        />
                    )}

                    {cables.map((c) => {
                        const o = odps.find((x) => x.id === c.odpId);
                        const h = houses.find((x) => x.id === c.houseId);
                        if (!o || !h) return null;
                        const st = statusOf(c.distanceM);
                        const pts: [number, number][] = c.route && c.route.length > 1 ? c.route : [[o.lat, o.lng], [h.lat, h.lng]];
                        const mid = routeMidpoint(pts);
                        return [
                            <Polyline
                                key={c.id}
                                positions={pts}
                                eventHandlers={tool === 'erase' ? { click: () => removeCable(c.id) } : undefined}
                                pathOptions={{ color: CABLE_COLOR[st], weight: 4, opacity: 0.85, dashArray: st === 'danger' ? '6 6' : undefined }}
                            />,
                            <Marker key={`${c.id}-tag`} position={mid} icon={distIcon(c.distanceM)} interactive={false} />,
                        ];
                    })}

                    {feeders.map((f) => {
                        const o = odcs.find((x) => x.id === f.odcId);
                        const p = odps.find((x) => x.id === f.odpId);
                        if (!o || !p) return null;
                        const pts: [number, number][] = f.route && f.route.length > 1 ? f.route : [[o.lat, o.lng], [p.lat, p.lng]];
                        return (
                            <Polyline
                                key={f.id}
                                positions={pts}
                                eventHandlers={tool === 'erase' ? { click: () => removeFeeder(f.id) } : undefined}
                                pathOptions={{ color: '#3b82f6', weight: 3, opacity: 0.8, dashArray: '8 6' }}
                            />
                        );
                    })}

                    {odcs.map((o) => (
                        <Marker key={o.id} position={[o.lat, o.lng]} icon={odcIcon()} eventHandlers={{ click: () => handleNodeClick('odc', o.id) }}>
                            <Tooltip direction="top" offset={[0, -14]}>{o.label} · Cabinet</Tooltip>
                        </Marker>
                    ))}

                    {odps.map((o) => {
                        const used = odpUsage[o.id] ?? 0;
                        return (
                            <Marker key={o.id} position={[o.lat, o.lng]} icon={odpIcon(used, selectedOdpId === o.id)} eventHandlers={{ click: () => handleNodeClick('odp', o.id) }}>
                                <Tooltip direction="right" offset={[12, 0]}>
                                    <div className="whitespace-nowrap font-mono text-[11px]">
                                        {o.label} · {used}/{MAX_PORT} port
                                    </div>
                                </Tooltip>
                            </Marker>
                        );
                    })}

                    {houses.map((h) => (
                        <Marker key={h.id} position={[h.lat, h.lng]} icon={houseIcon()} eventHandlers={{ click: () => handleNodeClick('house', h.id) }}>
                            <Tooltip direction="top" offset={[0, -12]}>{h.label}</Tooltip>
                        </Marker>
                    ))}
                </MapContainer>

    <div className="absolute top-3 left-3 w-56 rounded-2xl border border-[rgba(0,212,255,0.18)] bg-[#0d1525]/95 backdrop-blur-md p-3 flex flex-col gap-1.5" style={{ zIndex: 1000 }}>
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm">🛠️</span>
                        <span className="font-display font-bold text-sm text-white">Tools</span>
                        <span className="ml-auto font-mono text-[9px] text-[#4a5568]">Esc = batal</span>
                    </div>

                    <button
                        onClick={() => setTool('select')}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all ${
                            tool === 'select'
                                ? 'bg-[rgba(0,212,255,0.15)] border-[#00d4ff]/50 text-white'
                                : 'border-[rgba(255,255,255,0.08)] text-[#94a3b8] hover:border-[rgba(0,212,255,0.3)] hover:text-white'
                        }`}
                    >
                        <span className="text-base">🖱️</span>
                        <span className="font-mono text-[10px] font-bold">SELECT / INFO</span>
                    </button>

                    {TOOLS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTool(t.id)}
                            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all ${
                                tool === t.id
                                    ? 'bg-[rgba(0,212,255,0.15)] border-[#00d4ff]/50 text-white'
                                    : 'border-[rgba(255,255,255,0.08)] text-[#94a3b8] hover:border-[rgba(0,212,255,0.3)] hover:text-white'
                            }`}
                        >
                            <span className="text-base">{t.icon}</span>
                            <span className="min-w-0">
                                <span className="block font-mono text-[10px] font-bold">{t.label}</span>
                                <span className="block text-[9px] text-[#64748b] leading-tight">{t.desc}</span>
                            </span>
                        </button>
                    ))}

                    <button
                        onClick={() => setTool('erase')}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all ${
                            tool === 'erase'
                                ? 'bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.5)] text-white'
                                : 'border-[rgba(255,255,255,0.08)] text-[#94a3b8] hover:border-[rgba(239,68,68,0.4)] hover:text-white'
                        }`}
                    >
                        <span className="text-base">✖</span>
                        <span className="font-mono text-[10px] font-bold">ERASER</span>
                        <span className="ml-auto text-[9px] text-[#64748b]">klik marker</span>
                    </button>

                    <div className="border-t border-[rgba(255,255,255,0.08)] my-1" />

                    <button onClick={handleDemo} className="w-full px-2.5 py-2 rounded-lg border border-[rgba(16,185,129,0.3)] text-left text-[10px] font-mono font-bold text-emerald-400 hover:bg-emerald-500/10 transition-all">
                        ✦ Muat Data Contoh
                    </button>
                    <button onClick={handleReset} className="w-full px-2.5 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] text-left text-[10px] font-mono font-bold text-[#94a3b8] hover:border-[rgba(255,255,255,0.2)] hover:text-white transition-all">
                        ↺ Reset Peta
                    </button>
                    <button onClick={() => setShowBudget(true)} className="w-full px-2.5 py-2 rounded-lg border border-[rgba(0,212,255,0.3)] text-left text-[10px] font-mono font-bold text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)] transition-all">
                        🧮 Calculate Link Budget
                    </button>
                <button
                        onClick={() => setSatellite((s) => !s)}
                        className={`w-full px-2.5 py-2 rounded-lg border text-left text-[10px] font-mono font-bold transition-all ${
                            satellite
                                ? 'bg-[rgba(0,212,255,0.15)] border-[#00d4ff]/50 text-[#00d4ff]'
                                : 'border-[rgba(255,255,255,0.08)] text-[#94a3b8] hover:border-[rgba(0,212,255,0.3)] hover:text-white'
                        }`}
                    >
                        🛰️ {satellite ? 'Mode Satelit: ON' : 'Mode Satelit: OFF'}
                    </button>
                <div className="mt-2 grid grid-cols-3 gap-1">
                        <button onClick={() => mapRef.current?.zoomIn()} className="py-1.5 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)] text-white text-sm font-bold hover:border-[#00d4ff]/40 transition-all">+</button>
                        <button onClick={() => mapRef.current?.zoomOut()} className="py-1.5 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)] text-white text-sm font-bold hover:border-[#00d4ff]/40 transition-all">−</button>
                        <button onClick={() => mapRef.current?.setView(INITIAL_CENTER, INITIAL_ZOOM)} className="py-1.5 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)] text-[#00d4ff] text-sm font-bold hover:border-[#00d4ff]/40 transition-all">⌂</button>
                    </div>
                </div>

            {/* Floating Stats */}
            <div className="absolute top-3 right-3 w-60 rounded-2xl border border-[rgba(0,212,255,0.18)] bg-[#0d1525]/95 backdrop-blur-md p-3 flex flex-col gap-2" style={{ zIndex: 1000 }}>
                <div className="flex items-center gap-2">
                    <span className="text-sm">📊</span>
                    <span className="font-display font-bold text-sm text-white">Summary</span>
                    <span className={`ml-auto w-2.5 h-2.5 rounded-full ${stats.status.dot} animate-pulse`} />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                    <div className="rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.06)] p-2 text-center">
                        <div className="font-display text-xl font-bold text-[#ef4444]">{stats.odpCount}</div>
                        <div className="font-mono text-[9px] text-[#64748b]">ODP</div>
                    </div>
                    <div className="rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.06)] p-2 text-center">
                        <div className="font-display text-xl font-bold text-[#22c55e]">{stats.connectedHouses}</div>
                        <div className="font-mono text-[9px] text-[#64748b]">Houses</div>
                    </div>
                    <div className="col-span-2 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.06)] p-2 text-center">
                        <div className="font-display text-xl font-bold text-[#f59e0b]">{stats.totalLength.toLocaleString()} m</div>
                        <div className="font-mono text-[9px] text-[#64748b]">Total Kabel (drop+feeder)</div>
                    </div>
                    <div className="col-span-2 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.06)] p-2 text-center">
                        <div className={`font-display text-sm font-bold ${stats.status.textCls}`}>{stats.status.text}</div>
                        <div className="font-mono text-[9px] text-[#64748b]">ODC {stats.odcCount} • {stats.cableCount} kabel • {stats.feederCount} feeder</div>
                    </div>
                </div>
            </div>

            {/* Hint bar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 max-w-[92%] rounded-xl border border-[rgba(0,212,255,0.2)] bg-[#0d1525]/95 backdrop-blur-md px-3.5 py-2 text-center" style={{ zIndex: 1000 }}>
                <span className="font-mono text-[10px] text-[#94a3b8]">
                    {tool === 'cable'
                        ? selectedOdpId
                            ? '🔗 ODP terpilih — klik marker Rumah (Hijau) untuk tarik drop core.'
                            : '🔗 Mode Draw Cable — klik marker ODP (Merah) dulu.'
                        : tool === 'erase'
                            ? '✖ Mode Eraser — klik marker untuk menghapus.'
                            : tool !== 'select'
                                ? `${TOOLS.find((t) => t.id === tool)?.icon} ${activeToolDesc} — klik titik di peta untuk menempatkan.`
                                : '💡 Pilih tool lalu klik peta, atau tekan "Muat Data Contoh".'}
                </span>
            </div>

    </div>

            {/* Flash message */}
            {flashMsg && (
                <div className="mt-3 rounded-xl border border-[rgba(0,212,255,0.25)] bg-[rgba(0,212,255,0.08)] px-4 py-2.5 text-center animate-slide-up">
                    <span className="text-xs text-[#b6daf0]">{flashMsg}</span>
                </div>
            )}

            {/* Alert banner */}
            {alertMsg && (
                <div
                    className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[1200] flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl animate-modal-in ${
                        alertMsg.kind === 'error'
                            ? 'border-[rgba(239,68,68,0.6)] bg-[#1a0b0b] text-red-300'
                            : 'border-[rgba(0,212,255,0.6)] bg-[#0b1a2a] text-[#b6daf0]'
                    }`}
                >
                    <span className="text-xl">{alertMsg.kind === 'error' ? '⚠️' : 'ℹ️'}</span>
                    <span className="text-xs font-mono whitespace-pre-line">{alertMsg.text}</span>
                    <button onClick={() => setAlertMsg(null)} className="ml-1 px-2 py-1 rounded-lg border border-current text-[10px] font-bold hover:opacity-70">
                        OK
                    </button>
                </div>
            )}

    {/* Link Budget Modal */}
            {showBudget && (
                <div className="fixed inset-0 z-[1100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="animate-modal-in w-full max-w-lg max-h-[86vh] overflow-y-auto rounded-2xl border border-[rgba(0,212,255,0.25)] bg-[#0d1525] p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">🧮</span>
                            <h3 className="font-display text-lg font-bold text-white">Link Budget FTTH</h3>
                            <button onClick={() => setShowBudget(false)} className="ml-auto px-2.5 py-1 rounded-lg border border-[rgba(255,255,255,0.15)] text-xs text-[#94a3b8] hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-all">✕</button>
                        </div>

                        {cables.length === 0 && feeders.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-[#94a3b8]">Belum ada kabel drop atau feeder.</p>
                                <p className="text-xs text-[#64748b] mt-1 mb-6">Tarik ODP → Rumah dulu, atau "Muat Data Contoh".</p>
                                <button onClick={() => setShowBudget(false)} className="px-4 py-2 rounded-lg bg-[#00d4ff] text-[#07090f] font-bold text-sm hover:bg-white transition-all">Tutup</button>
                            </div>
                        ) : (
                            <>
                                <div className="max-h-44 overflow-y-auto rounded-xl border border-[rgba(255,255,255,0.06)] mb-4">
                                    <table className="w-full text-left text-xs">
                                        <thead className="sticky top-0 bg-[#0d1525] text-[#64748b] font-mono">
                                            <tr>
                                                <th className="px-3 py-2">Kabel</th>
                                                <th className="px-3 py-2 text-right">Jarak</th>
                                                <th className="px-3 py-2 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono">
                                            {cables.map((c) => {
                                                const o = odps.find((x) => x.id === c.odpId);
                                                const h = houses.find((x) => x.id === c.houseId);
                                                const st = statusOf(c.distanceM);
                                                return (
                                                    <tr key={c.id} className="border-t border-[rgba(255,255,255,0.04)]">
                                                        <td className="px-3 py-1.5 text-[#b0c4de]">{o?.label} → {h?.label}</td>
                                                        <td className="px-3 py-1.5 text-right text-[#f59e0b]">{c.distanceM} m</td>
                                                        <td className="px-3 py-1.5 text-right"><span className={STATUS_STYLE[st].text}>{STATUS_STYLE[st].label}</span></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

    <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.06)] p-3 text-center">
                                        <div className="font-mono text-[10px] text-[#64748b]">TX OLT</div>
                                        <div className="font-display text-lg font-bold text-[#00d4ff]">+{OLT_TX} dBm</div>
                                    </div>
                                    <div className="rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.06)] p-3 text-center">
                                        <div className="font-mono text-[10px] text-[#64748b]">Total Loss</div>
                                        <div className="font-display text-lg font-bold text-red-400">−{budget.totalLoss.toFixed(2)} dB</div>
                                    </div>
                                    <div className="col-span-2 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.06)] p-3 text-center">
                                        <div className="font-mono text-[10px] text-[#64748b]">Daya terima ONT (RX)</div>
                                        <div className={`font-display text-2xl font-bold ${budget.color}`}>{budget.rx.toFixed(2)} dBm</div>
                                        <div className={`font-mono text-[10px] font-bold mt-0.5 ${budget.color}`}>{budget.st}</div>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.1)] p-3 font-mono text-[10px] text-[#94a3b8] space-y-1.5">
                                    <div className="flex justify-between"><span>Loss kabel (drop + feeder) ({budget.totalM} m)</span><span className="text-white">−{budget.fiberLoss.toFixed(3)} dB</span></div>
                                    <div className="flex justify-between"><span>Splitter ODP 1:{MAX_PORT}</span><span className="text-white">−{budget.splitterLoss.toFixed(1)} dB</span></div>
                                    <div className="flex justify-between"><span>Konektor (2 × {cables.length + feeders.length})</span><span className="text-white">−{budget.connectorLoss.toFixed(1)} dB</span></div>
                                    <div className="flex justify-between"><span>Sambungan</span><span className="text-white">−{budget.spliceLoss.toFixed(1)} dB</span></div>
                                    <div className="flex justify-between border-t border-[rgba(255,255,255,0.08)] pt-1.5 font-bold"><span>Total</span><span className="text-red-400">−{budget.totalLoss.toFixed(2)} dB</span></div>
                                </div>

                                <button onClick={() => setShowBudget(false)} className="mt-4 w-full py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-bold text-sm hover:bg-white transition-all">
                                    Tutup
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}