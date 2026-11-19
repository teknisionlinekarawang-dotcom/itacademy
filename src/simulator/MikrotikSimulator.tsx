import React, { useCallback, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    addEdge,
    Node,
    Edge,
    Connection,
    MarkerType,
} from 'reactflow';

import 'reactflow/dist/style.css';

// Custom Node Types (simplified for this example)
const CloudNode = ({ data }: { data: { label: string } }) => (
    <div className="bg-blue-600 text-white p-2 rounded-md shadow-md border border-blue-700 text-center">
        <div className="text-2xl mb-1">☁️</div>
        <div className="text-xs font-bold">{data.label}</div>
    </div>
);

const MikroTikNode = ({ data }: { data: { label: string } }) => (
    <div className="bg-red-600 text-white p-2 rounded-md shadow-md border border-red-700 text-center">
        <div className="text-2xl mb-1">🎛️</div>
        <div className="text-xs font-bold">{data.label}</div>
    </div>
);

const RouterNode = ({ data }: { data: { label: string } }) => (
    <div className="bg-purple-600 text-white p-2 rounded-md shadow-md border border-purple-700 text-center">
        <div className="text-2xl mb-1">📡</div>
        <div className="text-xs font-bold">{data.label}</div>
    </div>
);

const ClientNode = ({ data }: { data: { label: string; icon: string } }) => (
    <div className="bg-green-600 text-white p-2 rounded-md shadow-md border border-green-700 text-center">
        <div className="text-2xl mb-1">{data.icon}</div>
        <div className="text-xs font-bold">{data.label}</div>
    </div>
);

const nodeTypes = {
    cloud: CloudNode,
    mikrotik: MikroTikNode,
    router: RouterNode,
    client: ClientNode,
};

// Initial nodes for the simulation
const initialNodes: Node[] = [
    { id: '1', type: 'cloud', position: { x: 100, y: 50 }, data: { label: 'ISP Cloud' } },
    { id: '2', type: 'mikrotik', position: { x: 300, y: 150 }, data: { label: 'MikroTik Router' } },
    { id: '3', type: 'router', position: { x: 500, y: 250 }, data: { label: 'Client Router' } },
    { id: '4', type: 'client', position: { x: 700, y: 100 }, data: { label: 'PC', icon: '💻' } },
    { id: '5', type: 'client', position: { x: 700, y: 200 }, data: { label: 'Smartphone', icon: '📱' } },
    { id: '6', type: 'client', position: { x: 700, y: 300 }, data: { label: 'Smart TV', icon: '📺' } },
];

// Initial edges (connections)
const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'step', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-3', source: '2', target: '3', type: 'step', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-4', source: '3', target: '4', type: 'step', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-5', source: '3', target: '5', type: 'step', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-6', source: '3', target: '6', type: 'step', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

interface MikrotikSimulatorProps {
    onComplete?: () => void; // Optional callback for when simulation is "complete"
    disabled?: boolean; // To disable interactions if needed
}

export default function MikrotikSimulator({ onComplete, disabled }: MikrotikSimulatorProps) {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [mikrotikConfig, setMikrotikConfig] = useState({
        ispIp: '192.168.100.1/24', // Example static IP from ISP
        dhcpPool: '192.168.88.100-192.168.88.200',
        pppoeUser: 'devacademy',
        pppoePass: '12345',
        vlanId: '100',
    });
    const [clientRouterConfig, setClientRouterConfig] = useState({
        wanType: 'dhcp', // 'dhcp', 'static', 'pppoe'
        wanIp: '', // if static
        pppoeUser: '',
        pppoePass: '',
        vlanId: '',
        lanDhcp: true,
    });
    const [simulationStatus, setSimulationStatus] = useState<'idle' | 'configuring' | 'running' | 'success' | 'failure'>('idle');
    const [message, setMessage] = useState('');

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
        [setEdges],
    );

    const handleMikrotikConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMikrotikConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleClientRouterConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setClientRouterConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const runSimulation = () => {
        setSimulationStatus('running');
        setMessage('Mengecek konfigurasi...');

        let isMikrotikConnectedToISP = false;
        // Simplified check: MikroTik WAN IP must match ISP's expected network
        if (mikrotikConfig.ispIp.includes('192.168.100')) { // Very basic check
            isMikrotikConnectedToISP = true;
        }

        let isClientRouterConnected = false;
        if (isMikrotikConnectedToISP) {
            if (clientRouterConfig.wanType === 'dhcp' && mikrotikConfig.dhcpPool) {
                isClientRouterConnected = true; // MikroTik provides DHCP, client router uses DHCP
            } else if (clientRouterConfig.wanType === 'pppoe' &&
                       clientRouterConfig.pppoeUser === mikrotikConfig.pppoeUser &&
                       clientRouterConfig.pppoePass === mikrotikConfig.pppoePass &&
                       clientRouterConfig.vlanId === mikrotikConfig.vlanId) {
                isClientRouterConnected = true; // MikroTik provides PPPoE/VLAN, client router uses PPPoE/VLAN
            }
            // Add more complex logic for static IP, etc.
        }

        setTimeout(() => {
            if (isMikrotikConnectedToISP && isClientRouterConnected) {
                setSimulationStatus('success');
                setMessage('🎉 Konfigurasi Berhasil! Semua perangkat terhubung ke internet.');
                onComplete?.(); // Trigger completion callback
            } else {
                setSimulationStatus('failure');
                setMessage('❌ Konfigurasi Gagal. Periksa kembali pengaturan MikroTik dan Client Router Anda.');
            }
        }, 2000);
    };

    return (
        <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8 mb-8">
            <h3 className="font-display text-xl font-bold text-white mb-4">Simulasi Jaringan MikroTik Sederhana</h3>
            <p className="text-[#94a3b8] text-sm mb-6">
                Hubungkan perangkat dan konfigurasikan MikroTik serta Client Router agar semua klien dapat terhubung ke internet.
                <br/>
                <strong className="text-yellow-400">Catatan:</strong> Ini adalah simulasi visual dan konseptual. Logika konfigurasi dan validasi sangat disederhanakan.
            </p>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* React Flow Canvas */}
                <div className="flex-1 h-[400px] bg-[#07090f] rounded-lg border border-[rgba(255,255,255,0.05)]">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                        attributionPosition="bottom-left"
                        proOptions={{ hideAttribution: true }}
                        nodesDraggable={!disabled}
                        edgesFocusable={!disabled}
                        nodesConnectable={!disabled}
                        elementsSelectable={!disabled}
                        panOnDrag={!disabled}
                        zoomOnScroll={!disabled}
                    >
                        <MiniMap nodeStrokeColor={(n) => {
                            if (n.type === 'cloud') return '#3b82f6';
                            if (n.type === 'mikrotik') return '#ef4444';
                            if (n.type === 'router') return '#a855f7';
                            return '#10b981';
                        }} nodeColor={(n) => {
                            if (n.type === 'cloud') return '#3b82f6';
                            if (n.type === 'mikrotik') return '#ef4444';
                            if (n.type === 'router') return '#a855f7';
                            return '#10b981';
                        }} nodeBorderRadius={2} />
                        <Controls />
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    </ReactFlow>
                </div>

                {/* Configuration Panel */}
                <div className="w-full lg:w-1/3 bg-[#07090f] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 space-y-4">
                    <h4 className="font-bold text-white mb-2">Konfigurasi</h4>

                    {/* MikroTik Configuration */}
                    <div className="p-3 bg-[#1a2535] rounded-md border border-[rgba(255,255,255,0.03)]">
                        <h5 className="font-semibold text-red-400 mb-2">MikroTik Router</h5>
                        <label className="block text-xs text-gray-400 mb-1">ISP Static IP (WAN):</label>
                        <input
                            type="text"
                            name="ispIp"
                            value={mikrotikConfig.ispIp}
                            onChange={handleMikrotikConfigChange}
                            className="w-full bg-gray-800 text-white text-xs p-1.5 rounded mb-2"
                            disabled={disabled || simulationStatus === 'running'}
                        />
                        <label className="block text-xs text-gray-400 mb-1">DHCP Pool (LAN):</label>
                        <input
                            type="text"
                            name="dhcpPool"
                            value={mikrotikConfig.dhcpPool}
                            onChange={handleMikrotikConfigChange}
                            className="w-full bg-gray-800 text-white text-xs p-1.5 rounded mb-2"
                            disabled={disabled || simulationStatus === 'running'}
                        />
                        <label className="block text-xs text-gray-400 mb-1">PPPoE User:</label>
                        <input
                            type="text"
                            name="pppoeUser"
                            value={mikrotikConfig.pppoeUser}
                            onChange={handleMikrotikConfigChange}
                            className="w-full bg-gray-800 text-white text-xs p-1.5 rounded mb-2"
                            disabled={disabled || simulationStatus === 'running'}
                        />
                        <label className="block text-xs text-gray-400 mb-1">PPPoE Password:</label>
                        <input
                            type="password"
                            name="pppoePass"
                            value={mikrotikConfig.pppoePass}
                            onChange={handleMikrotikConfigChange}
                            className="w-full bg-gray-800 text-white text-xs p-1.5 rounded mb-2"
                            disabled={disabled || simulationStatus === 'running'}
                        />
                        <label className="block text-xs text-gray-400 mb-1">VLAN ID:</label>
                        <input
                            type="text"
                            name="vlanId"
                            value={mikrotikConfig.vlanId}
                            onChange={handleMikrotikConfigChange}
                            className="w-full bg-gray-800 text-white text-xs p-1.5 rounded mb-2"
                            disabled={disabled || simulationStatus === 'running'}
                        />
                    </div>

                    {/* Client Router Configuration */}
                    <div className="p-3 bg-[#1a2535] rounded-md border border-[rgba(255,255,255,0.03)]">
                        <h5 className="font-semibold text-purple-400 mb-2">Client Router</h5>
                        <label className="block text-xs text-gray-400 mb-1">WAN Connection Type:</label>
                        <select
                            name="wanType"
                            value={clientRouterConfig.wanType}
                            onChange={handleClientRouterConfigChange}
                            className="w-full bg-gray-800 text-white text-xs p-1.5 rounded mb-2"
                            disabled={disabled || simulationStatus === 'running'}
                        >
                            <option value="dhcp">DHCP Client</option>
                            <option value="static">Static IP</option>
                            <option value="pppoe">PPPoE Client</option>
                        </select>

                        {clientRouterConfig.wanType === 'static' && (
                            <>
                                <label className="block text-xs text-gray-400 mb-1">WAN IP:</label>
                                <input
                                    type="text"
                                    name="wanIp"
                                    value={clientRouterConfig.wanIp}
                                    onChange={handleClientRouterConfigChange}
                                    className="w-full bg-gray-800 text-white text-xs p-1.5 rounded mb-2"
                                    disabled={disabled || simulationStatus === 'running'}
                                />
                            </>
                        )}
                        {clientRouterConfig.wanType === 'pppoe' && (
                            <>
                                <label className="block text-xs text-gray-400 mb-1">PPPoE User:</label>
                                <input
                                    type="text"
                                    name="pppoeUser"
                                    value={clientRouterConfig.pppoeUser}
                                    onChange={handleClientRouterConfigChange}
                                    className="w-full bg-gray-800 text-white text-xs p-1.5 rounded mb-2"
                                    disabled={disabled || simulationStatus === 'running'}
                                />
                                <label className="block text-xs text-gray-400 mb-1">PPPoE Password:</label>
                                <input
                                    type="password"
                                    name="pppoePass"
                                    value={clientRouterConfig.pppoePass}
                                    onChange={handleClientRouterConfigChange}
                                    className="w-full bg-gray-800 text-white text-xs p-1.5 rounded mb-2"
                                    disabled={disabled || simulationStatus === 'running'}
                                />
                                <label className="block text-xs text-gray-400 mb-1">VLAN ID:</label>
                                <input
                                    type="text"
                                    name="vlanId"
                                    value={clientRouterConfig.vlanId}
                                    onChange={handleClientRouterConfigChange}
                                    className="w-full bg-gray-800 text-white text-xs p-1.5 rounded mb-2"
                                    disabled={disabled || simulationStatus === 'running'}
                                />
                            </>
                        )}
                        <label className="flex items-center text-xs text-gray-400 mt-2">
                            <input
                                type="checkbox"
                                name="lanDhcp"
                                checked={clientRouterConfig.lanDhcp}
                                onChange={handleClientRouterConfigChange}
                                className="mr-2"
                                disabled={disabled || simulationStatus === 'running'}
                            />
                            LAN DHCP Server
                        </label>
                    </div>

                    <button
                        onClick={runSimulation}
                        disabled={disabled || simulationStatus === 'running'}
                        className="w-full bg-[#00d4ff] text-[#07090f] font-bold py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {simulationStatus === 'running' ? 'Menjalankan Simulasi...' : 'Mulai Simulasi'}
                    </button>
                    {message && (
                        <p className={`text-center text-sm mt-2 ${simulationStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}