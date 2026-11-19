import { useState } from 'react';

// Helper functions
function ipToNum(ip: string): number {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return NaN;
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

const DeviceCard = ({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) => (
    <div className="bg-[#0d1525]/80 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 backdrop-blur-sm flex-1 min-w-[300px] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{icon}</span>
            <h3 className="font-display text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="space-y-4 flex-grow">{children}</div>
    </div>
);

const InputField = ({ label, value, onChange, placeholder, error, disabled }: { label: string, value: string, onChange: (val: string) => void, placeholder: string, error?: string, disabled?: boolean }) => (
    <div>
        <label className="block font-mono text-[10px] text-[#4a5568] uppercase tracking-wider mb-1.5">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-[#07090f] rounded-lg px-3 py-2 font-mono text-sm text-white placeholder-[#2d3748] focus:outline-none transition-all border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-[rgba(0,212,255,0.15)] focus:border-[rgba(0,212,255,0.5)]'}`}
        />
        {error && <p className="font-mono text-[9px] text-red-400 mt-1">{error}</p>}
    </div>
);

interface IPAddressSimulatorProps {
    simulatorConfig?: {
        gateway: string;
        subnetMask: string;
        dns: string;
        // Skenario: bisa ada nilai awal yang salah untuk client
        initialClientIp?: string;
        initialClientSubnetMask?: string;
        initialClientGateway?: string;
        initialClientDns?: string;
    };
    onComplete?: () => void;
    disabled?: boolean; // New prop
}

export default function IPAddressSimulator({ simulatorConfig, onComplete, disabled }: IPAddressSimulatorProps) {
    // Gunakan config dari props, atau nilai default jika tidak ada (untuk halaman materi)
    const targetGateway = simulatorConfig?.gateway || '192.168.1.1';
    const targetSubnetMask = simulatorConfig?.subnetMask || '255.255.255.0';
    const targetDns = simulatorConfig?.dns || '8.8.8.8';

    // State untuk Client
    const [clientIp, setClientIp] = useState('');
    const [clientGateway, setClientGateway] = useState('');
    const [clientSubnetMask, setClientSubnetMask] = useState('');
    const [clientDns, setClientDns] = useState('');

    // State untuk hasil simulasi
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const testConnection = () => {
        setConnectionStatus('idle');
        setErrorMessage('');

        const gatewayNum = ipToNum(targetGateway);
        const maskNum = ipToNum(targetSubnetMask);
        const clientNum = ipToNum(clientIp);
        const clientMaskNum = ipToNum(clientSubnetMask);

        if ([gatewayNum, maskNum, clientNum, ipToNum(clientGateway), clientMaskNum, ipToNum(clientDns)].some(isNaN)) {
            setErrorMessage('Format salah satu IP Address tidak valid.');
            setConnectionStatus('error');
            return;
        }

        const serverNetwork = gatewayNum & maskNum;
        const clientNetwork = clientNum & ipToNum(clientSubnetMask);
        if (serverNetwork !== clientNetwork || targetSubnetMask !== clientSubnetMask) {
            setErrorMessage('Client dan Server tidak berada di jaringan yang sama. Periksa Subnet Mask dan IP.');
            setConnectionStatus('error');
            return;
        }

        if (clientNum === gatewayNum) {
            setErrorMessage('IP Client tidak boleh sama dengan alamat Gateway.');
            setConnectionStatus('error');
            return;
        }

        if (clientGateway !== targetGateway) {
            setErrorMessage('IP Gateway pada Client tidak sesuai dengan konfigurasi Server.');
            setConnectionStatus('error');
            return;
        }

        if (clientDns !== targetDns) {
            setErrorMessage('DNS Server pada Client tidak sesuai dengan konfigurasi Server.');
            setConnectionStatus('error');
            return;
        }

        setConnectionStatus('success');
        onComplete?.(); // Panggil onComplete saat berhasil
    };

    return (
        <div className="my-6">
            <h2 className="font-display text-xl font-bold text-center text-[#00d4ff] mb-2">Area Simulasi Jaringan</h2>
            <p className="text-center text-[#64748b] font-mono text-sm mb-8">Konfigurasikan Client PC agar sesuai dengan server, lalu uji koneksinya.</p>

            <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
                <DeviceCard title="DHCP Server (Read-Only)" icon="🎛️">
                    <InputField label="IP Gateway" value={targetGateway} onChange={() => {}} placeholder="" />
                    <InputField label="Subnet Mask" value={targetSubnetMask} onChange={() => {}} placeholder="" />
                    <InputField label="DNS Server" value={targetDns} onChange={() => {}} placeholder="" />
                </DeviceCard>

                <div className="flex-shrink-0 w-full lg:w-48 text-center pt-8 lg:pt-24">
                    <div className="relative h-16 lg:h-auto">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[rgba(0,212,255,0.2)]" />
                        {connectionStatus === 'success' && (
                            <>
                                <div className="ping-dot" style={{ animation: 'ping-pong 2s ease-in-out infinite' }} />
                                <div className="ping-dot" style={{ animation: 'ping-pong 2s ease-in-out 1s infinite' }} />
                            </>
                        )}
                    </div>
                    <button onClick={testConnection} disabled={disabled} className="mt-4 font-display font-bold text-sm px-6 py-2.5 rounded-lg transition-all duration-200 bg-[#00d4ff] text-[#07090f] hover:bg-white glow-cyan disabled:opacity-50 disabled:cursor-not-allowed">
                        ⚡ Test Koneksi
                    </button>
                    {connectionStatus === 'error' && (
                        <div className="mt-2 p-2 rounded-md bg-red-500/10 border border-red-500/30">
                            <p className="font-mono text-[10px] text-red-400">{errorMessage}</p>
                        </div>
                    )}
                    {connectionStatus === 'success' && (
                        <div className="mt-2 p-2 rounded-md bg-green-500/10 border border-green-500/30">
                            <p className="font-mono text-[10px] text-green-400">Koneksi Berhasil!</p>
                        </div>
                    )}
                </div>

                <DeviceCard title="Client PC" icon="💻">
                    <InputField label="IP Address" value={clientIp} onChange={setClientIp} placeholder="Isi IP Address..." disabled={disabled} />
                    <InputField label="Subnet Mask" value={clientSubnetMask} onChange={setClientSubnetMask} placeholder="Isi Subnet Mask..." disabled={disabled} />
                    <InputField label="IP Gateway" value={clientGateway} onChange={setClientGateway} placeholder="Isi Gateway..." disabled={disabled} />
                    <InputField label="DNS Server" value={clientDns} onChange={setClientDns} placeholder="Isi DNS..." disabled={disabled} />
                </DeviceCard>
            </div>
        </div>
    );
}
