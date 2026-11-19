import { useState, useEffect, useRef } from 'react';

type TopologyType = 'Bus' | 'Star' | 'Ring' | 'Mesh';

const topologies: TopologyType[] = ['Bus', 'Star', 'Ring', 'Mesh'];

interface NodeData {
    id: number;
    x: number;
    y: number;
    label: string;
    isDraggable: boolean;
}

const Node = ({ x, y, label, isCentral = false, onMouseDown }: { x: number, y: number, label: string, isCentral?: boolean, onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void }) => (
    <g transform={`translate(${x}, ${y})`} onMouseDown={onMouseDown} onTouchStart={onMouseDown} className="cursor-grab active:cursor-grabbing">
        <circle cx="0" cy="0" r={isCentral ? "20" : "15"} fill={isCentral ? "#0d1525" : "#07090f"} stroke={isCentral ? "#f59e0b" : "#00d4ff"} strokeWidth="2" />
        <text x="0" y="5" textAnchor="middle" fill="#e2e8f0" fontSize="12" className="font-mono select-none pointer-events-none">{label}</text>
    </g>
);

const TopologyVisualizer = ({ type }: { type: TopologyType }) => {
    const [nodes, setNodes] = useState<NodeData[]>([]);
    const [draggedNode, setDraggedNode] = useState<{ index: number; offsetX: number; offsetY: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        // Inisialisasi posisi node berdasarkan tipe topologi
        let initialNodes: NodeData[] = [];
        const numNodes = type === 'Ring' ? 6 : 5;
        const radiusX = 150;
        const radiusY = 120;
        const centerX = 200;
        const centerY = 150;

        if (type === 'Star') {
            initialNodes.push({ id: 99, x: centerX, y: centerY, label: 'SW', isDraggable: true });
        }

        for (let i = 0; i < numNodes; i++) {
            if (type === 'Bus') {
                initialNodes.push({ id: i, x: 80 + i * 60, y: 100, label: `PC-${i + 1}`, isDraggable: true });
            } else {
                initialNodes.push({ id: i, x: centerX + radiusX * Math.cos(2 * Math.PI * i / numNodes), y: centerY + radiusY * Math.sin(2 * Math.PI * i / numNodes), label: `PC-${i + 1}`, isDraggable: true });
            }
        }
        setNodes(initialNodes);
    }, [type]);

    const getSVGPoint = (clientX: number, clientY: number) => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        return pt.matrixTransform(svg.getScreenCTM()?.inverse());
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
        if (!nodes[index].isDraggable) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const point = getSVGPoint(clientX, clientY);
        setDraggedNode({
            index,
            offsetX: point.x - nodes[index].x,
            offsetY: point.y - nodes[index].y,
        });
    };

    const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
        if (!draggedNode) return;
        e.preventDefault();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const point = getSVGPoint(clientX, clientY);

        const newNodes = [...nodes];
        newNodes[draggedNode.index].x = point.x - draggedNode.offsetX;
        newNodes[draggedNode.index].y = point.y - draggedNode.offsetY;
        setNodes(newNodes);
    };

    const handleDragEnd = () => {
        setDraggedNode(null);
    };

    useEffect(() => {
        const svgElement = svgRef.current;
        if (svgElement) {
            svgElement.addEventListener('mousemove', handleDrag as any);
            svgElement.addEventListener('mouseup', handleDragEnd);
            svgElement.addEventListener('mouseleave', handleDragEnd);
            svgElement.addEventListener('touchmove', handleDrag as any);
            svgElement.addEventListener('touchend', handleDragEnd);

            return () => {
                svgElement.removeEventListener('mousemove', handleDrag as any);
                svgElement.removeEventListener('mouseup', handleDragEnd);
                svgElement.removeEventListener('mouseleave', handleDragEnd);
                svgElement.removeEventListener('touchmove', handleDrag as any);
                svgElement.removeEventListener('touchend', handleDragEnd);
            };
        }
    }, [draggedNode, nodes]); // Re-attach listeners if state changes

    const renderTopology = () => {
        switch (type) {
            case 'Bus':
                return (
                    <>
                        <line x1="50" y1="150" x2="350" y2="150" stroke="#4a5568" strokeWidth="4" />
                        {nodes.map((n, i) => <g key={n.id}><line x1={n.x} y1="150" x2={n.x} y2={n.y} stroke="#4a5568" strokeWidth="2" /><Node x={n.x} y={n.y} label={n.label} onMouseDown={(e) => handleDragStart(e, i)} /></g>)}
                        <circle cx="110" cy="150" r="3" fill="yellow" className="animate-[bus-packet_4s_linear_infinite]" />
                    </>
                );
            case 'Star':
                const centralNode = nodes.find(n => n.label === 'SW');
                const clientNodes = nodes.filter(n => n.label !== 'SW');
                return (
                    <>
                        {centralNode && clientNodes.map((n) => <line key={n.id} x1={centralNode.x} y1={centralNode.y} x2={n.x} y2={n.y} stroke="#4a5568" strokeWidth="2" />)}
                        {nodes.map((n, i) => <Node key={n.id} x={n.x} y={n.y} label={n.label} isCentral={n.label === 'SW'} onMouseDown={(e) => handleDragStart(e, i)} />)}
                        {centralNode && clientNodes.length > 1 && <circle cx={centralNode.x} cy={centralNode.y} r="3" fill="yellow" className="animate-[star-packet_3s_ease-in-out_infinite]" style={{ '--tx': `${clientNodes[1].x}px`, '--ty': `${clientNodes[1].y}px`, '--cx': `${centralNode.x}px`, '--cy': `${centralNode.y}px` } as React.CSSProperties} />}
                    </>
                );
            case 'Ring':
                return (
                    <>
                        {nodes.map((n, i) => <line key={n.id} x1={n.x} y1={n.y} x2={nodes[(i + 1) % nodes.length].x} y2={nodes[(i + 1) % nodes.length].y} stroke="#4a5568" strokeWidth="2" />)}
                        {nodes.map((n, i) => <Node key={n.id} x={n.x} y={n.y} label={n.label} onMouseDown={(e) => handleDragStart(e, i)} />)}
                        {nodes.length > 0 && <circle r="3" fill="yellow"><animateMotion dur="6s" repeatCount="indefinite" path={`M ${nodes.map(n => `${n.x},${n.y}`).join(' L ')} Z`} /></circle>}
                    </>
                );
            case 'Mesh':
                return (
                    <>
                        {nodes.map((n1, i) => nodes.slice(i + 1).map((n2) => <line key={`${n1.id}-${n2.id}`} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke="#4a5568" strokeWidth="1" opacity="0.5" />))}
                        {nodes.map((n, i) => <Node key={n.id} x={n.x} y={n.y} label={n.label} onMouseDown={(e) => handleDragStart(e, i)} />)}
                    </>
                );
            default: return null;
        }
    };

    return (
        <svg ref={svgRef} viewBox="0 0 400 300" className="w-full h-auto">
            {renderTopology()}
        </svg>
    );
};

export default function TopologySimulator() {
    const [activeTopology, setActiveTopology] = useState<TopologyType>('Star');

    return (
        <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-center text-[#00d4ff] mb-2">Simulator Topologi</h2>
            <p className="text-center text-[#64748b] font-mono text-sm mb-8">Pilih topologi untuk melihat visualisasi dan aliran datanya.</p>

            {/* Controls */}
            <div className="flex justify-center mb-6">
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#07090f] rounded-lg border border-[rgba(255,255,255,0.05)]">
                    {topologies.map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveTopology(type)}
                            className={`px-6 py-2 rounded-md font-display font-bold text-xs transition-all duration-200 ${activeTopology === type ? 'bg-[#00d4ff] text-[#07090f] glow-cyan' : 'text-[#64748b] hover:text-white'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Visualizer */}
            <div className="w-full max-w-2xl mx-auto">
                <TopologyVisualizer type={activeTopology} />
            </div>
        </div>
    );
}