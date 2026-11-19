import { useState, useRef } from 'react'

type Standard = 'T568A' | 'T568B'

interface WireInfo {
  id: string
  label: string
  color1: string
  color2: string | null
  textColor: string
}

const WIRES: WireInfo[] = [
  { id: 'white-orange', label: 'Putih/Oranye', color1: '#ffffff', color2: '#f97316', textColor: '#07090f' },
  { id: 'brown',        label: 'Coklat',        color1: '#92400e', color2: null,      textColor: '#ffffff' },
  { id: 'white-blue',   label: 'Putih/Biru',   color1: '#ffffff', color2: '#3b82f6', textColor: '#07090f' },
  { id: 'orange',       label: 'Oranye',       color1: '#f97316', color2: null,      textColor: '#07090f' },
  { id: 'white-green',  label: 'Putih/Hijau',  color1: '#ffffff', color2: '#22c55e', textColor: '#07090f' },
  { id: 'blue',         label: 'Biru',          color1: '#3b82f6', color2: null,      textColor: '#ffffff' },
  { id: 'green',        label: 'Hijau',         color1: '#22c55e', color2: null,      textColor: '#07090f' },
  { id: 'white-brown',  label: 'Putih/Coklat', color1: '#ffffff', color2: '#92400e', textColor: '#07090f' },
]

const STANDARDS: Record<Standard, string[]> = {
  T568A: ['white-green', 'green', 'white-orange', 'blue', 'white-blue', 'orange', 'white-brown', 'brown'],
  T568B: ['white-orange', 'orange', 'white-green', 'blue', 'white-blue', 'green', 'white-brown', 'brown'],
}

const PIN_FUNCTIONS: Record<Standard, string[]> = {
  T568A: ['TX+', 'TX-', 'RX+', '—', '—', 'RX-', '—', '—'],
  T568B: ['TX+', 'TX-', 'RX+', '—', '—', 'RX-', '—', '—'],
}

interface CrimpingSimulatorProps {
    simulatorConfig?: {
        targetStandard: Standard;
    };
    onComplete?: () => void;
    disabled?: boolean; // New prop
}

export default function CrimpingSimulator({ simulatorConfig, onComplete }: CrimpingSimulatorProps) {
  // Standar target ditentukan oleh tugas, dengan fallback ke T568B jika tidak ada config
  const targetStandard = simulatorConfig?.targetStandard || 'T568B';
  const [standard, setStandard] = useState<Standard>(targetStandard);
  const [slots, setSlots] = useState<(string | null)[]>(Array(8).fill(null))
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [draggingFrom, setDraggingFrom] = useState<number | null>(null)
  const [overSlot, setOverSlot] = useState<number | null>(null)
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle')
  const [wrongPins, setWrongPins] = useState<number[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const dragRef = useRef<string | null>(null)

  const usedWireIds = slots.filter(Boolean) as string[]
  const availableWires = WIRES.filter((w) => !usedWireIds.includes(w.id))

  function handleDragStartPool(wireId: string) {
    setDraggingId(wireId)
    setDraggingFrom(null)
    dragRef.current = wireId
  }

  function handleDragStartSlot(wireId: string, slotIndex: number) {
    setDraggingId(wireId)
    setDraggingFrom(slotIndex)
    dragRef.current = wireId
  }

  function handleDragOverSlot(e: React.DragEvent, idx: number) {
    e.preventDefault()
    setOverSlot(idx)
  }

  function handleDropOnSlot(e: React.DragEvent, idx: number) {
    e.preventDefault()
    const wireId = dragRef.current
    if (!wireId) return

    const newSlots = [...slots]

    if (draggingFrom !== null) {
      newSlots[draggingFrom] = null
    }

    // If target slot already has a wire, put it back in pool (clear it)
    newSlots[idx] = wireId

    setSlots(newSlots)
    setDraggingId(null)
    setDraggingFrom(null)
    setOverSlot(null)
    dragRef.current = null
    setResult('idle')
    setWrongPins([])
  }

  function handleDropOnPool(e: React.DragEvent) {
    e.preventDefault()
    if (draggingFrom !== null && draggingId) {
      const newSlots = [...slots]
      newSlots[draggingFrom] = null
      setSlots(newSlots)
      setResult('idle')
      setWrongPins([])
    }
    setDraggingId(null)
    setDraggingFrom(null)
    setOverSlot(null)
    dragRef.current = null
  }

  function testCable() {
    const correct = STANDARDS[standard]
    const errors: number[] = []
    for (let i = 0; i < 8; i++) {
      if (slots[i] !== correct[i]) errors.push(i)
    }
    if (errors.length === 0 && slots.every(Boolean)) {
      setResult('success')
      onComplete?.(); // Panggil onComplete saat berhasil
    } else {
      setResult('error')
      setWrongPins(errors)
    }
    setShowModal(true)
  }

  function reset() {
    setSlots(Array(8).fill(null))
    setResult('idle')
    setWrongPins([])
    setShowModal(false)
    setDraggingId(null)
    setDraggingFrom(null)
    setOverSlot(null)
    dragRef.current = null
  }

  const correctOrder = STANDARDS[standard]

  return (
    <div className="min-h-screen grid-bg flex">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-[#0d1525] border-r border-[rgba(0,212,255,0.1)] flex flex-col">
        <div className="p-5 border-b border-[rgba(0,212,255,0.08)]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔌</span>
            <h2 className="font-display font-bold text-white text-base">Crimping Simulator</h2>
          </div>
          <p className="font-mono text-[10px] text-[#4a5568]">Simulasi pemasangan kabel UTP → RJ45</p>
        </div>

        {/* Standard Toggle */}
        <div className="p-5 border-b border-[rgba(0,212,255,0.08)]">
          <div className="font-mono text-[10px] text-[#4a5568] mb-2 uppercase tracking-wider">Standar Kabel</div>
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#07090f] rounded-lg">
            {(['T568A', 'T568B'] as Standard[]).map((s) => (
              <button
                key={s}
                // Nonaktifkan tombol jika config sudah menentukan target
                onClick={() => !simulatorConfig && setStandard(s) && reset()}
                className={`py-2 rounded-md font-display font-bold text-xs transition-all duration-200 ${simulatorConfig ? 'cursor-not-allowed' : ''} ${
                  standard === s
                    ? 'bg-[#00d4ff] text-[#07090f] glow-cyan'
                    : 'text-[#64748b] hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-2 font-mono text-center text-[10px] text-amber-400">
            Target: {targetStandard}
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.08)]">
            <p className="font-mono text-[9px] text-[#4a5568] leading-relaxed">
              {standard === 'T568B'
                ? 'T568B adalah standar paling umum di industri. Digunakan untuk kabel straight-through.'
                : 'T568A digunakan di instalasi pemerintah AS dan untuk kabel crossover (dengan T568B).'}
            </p>
          </div>
        </div>

        {/* Color Code Reference */}
        <div className="p-5 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-[10px] text-[#4a5568] uppercase tracking-wider">Urutan Kabel {standard}</div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="font-mono text-[9px] text-[#00d4ff] hover:text-white transition-colors"
            >
              {showHint ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>
          <div className="space-y-1.5">
            {correctOrder.map((wireId, i) => {
              const wire = WIRES.find((w) => w.id === wireId)!
              const isStriped = wire.color2 !== null
              const bg = isStriped
                ? `repeating-linear-gradient(45deg, ${wire.color1} 0px, ${wire.color1} 4px, ${wire.color2} 4px, ${wire.color2} 8px)`
                : wire.color1
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold text-[#00d4ff] bg-[rgba(0,212,255,0.08)] flex-shrink-0">
                    {i + 1}
                  </div>
                  <div
                    className="flex-1 h-5 rounded border border-black/20 flex items-center justify-center font-mono text-[9px] font-bold"
                    style={{
                      background: showHint ? bg : 'rgba(255,255,255,0.04)',
                      color: showHint ? wire.textColor : '#4a5568',
                    }}
                  >
                    {showHint ? wire.label : '?????'}
                  </div>
                  <div className="w-12 text-[9px] font-mono text-[#4a5568]">
                    {PIN_FUNCTIONS[standard][i]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-5 border-t border-[rgba(0,212,255,0.08)]">
          <div className="font-mono text-[10px] text-[#4a5568] uppercase tracking-wider mb-2">Cara Bermain</div>
          <ol className="space-y-1.5">
            {[
              'Drag kabel dari pool ke slot RJ45',
              'Urutkan sesuai standar yang dipilih',
              'Klik "Test Cable" untuk memeriksa',
              'Reset untuk memulai ulang',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-[9px] text-[#00d4ff] mt-0.5 flex-shrink-0">{i + 1}.</span>
                <span className="font-mono text-[9px] text-[#64748b] leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">

          {/* RJ45 Connector Visual */}
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="font-display text-sm font-bold text-white">Konektor RJ45</div>
              <div className="font-mono text-[10px] text-[#4a5568]">— Drag kabel ke slot pin</div>
              <div className="ml-auto font-mono text-[10px] text-[#4a5568]">
                {slots.filter(Boolean).length}/8 terpasang
              </div>
            </div>

            {/* RJ45 body */}
            <div className="relative bg-[#0d1525] border-2 border-[rgba(0,212,255,0.2)] rounded-2xl p-6 glow-cyan">
              {/* Connector clip visual */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] rounded-b-xl" />

              <div className="font-mono text-[10px] text-[#4a5568] text-center mb-4 uppercase tracking-widest">
                ← Pin 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Pin 8 →
              </div>

              {/* Pin slots */}
              <div className="grid grid-cols-8 gap-2">
                {Array(8).fill(0).map((_, idx) => {
                  const wireId = slots[idx]
                  const wire = wireId ? WIRES.find((w) => w.id === wireId) : null
                  const isOver = overSlot === idx
                  const isWrong = wrongPins.includes(idx) && result === 'error'
                  const isStriped = wire?.color2 !== null
                  const bg = wire
                    ? isStriped
                      ? `repeating-linear-gradient(0deg, ${wire.color1} 0px, ${wire.color1} 4px, ${wire.color2} 4px, ${wire.color2} 8px)`
                      : wire.color1
                    : undefined

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-full h-24 rounded-lg border-2 transition-all duration-200 cursor-pointer relative overflow-hidden ${
                          isWrong
                            ? 'border-red-500 bg-red-500/10'
                            : isOver
                            ? 'border-[#00d4ff] bg-[rgba(0,212,255,0.1)]'
                            : wire
                            ? 'border-[rgba(255,255,255,0.15)]'
                            : 'border-dashed border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.02)]'
                        }`}
                        onDragOver={(e) => handleDragOverSlot(e, idx)}
                        onDrop={(e) => handleDropOnSlot(e, idx)}
                        onDragLeave={() => setOverSlot(null)}
                        draggable={!!wire}
                        onDragStart={() => wire && handleDragStartSlot(wire.id, idx)}
                        style={wire && bg ? { background: bg } : undefined}
                      >
                        {!wire && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-12 bg-[rgba(0,212,255,0.15)] rounded-full" />
                          </div>
                        )}
                        {isWrong && (
                          <div className="absolute top-1 right-1 text-red-400 text-xs">✕</div>
                        )}
                        {result === 'success' && wire && (
                          <div className="absolute top-1 right-1 text-green-400 text-xs">✓</div>
                        )}
                      </div>
                      <div className="font-mono text-[9px] text-[#4a5568]">P{idx + 1}</div>
                    </div>
                  )
                })}
              </div>

              {/* Cable wire visual below */}
              <div className="mt-6 flex items-center gap-1 justify-center">
                {slots.map((wireId, idx) => {
                  const wire = wireId ? WIRES.find((w) => w.id === wireId) : null
                  const bg = wire
                    ? wire.color2
                      ? `repeating-linear-gradient(90deg, ${wire.color1} 0px, ${wire.color1} 4px, ${wire.color2} 4px, ${wire.color2} 8px)`
                      : wire.color1
                    : 'rgba(255,255,255,0.05)'
                  return (
                    <div
                      key={idx}
                      className="h-8 rounded-sm border border-black/10 transition-all duration-300"
                      style={{ background: bg, width: '28px' }}
                    />
                  )
                })}
                <div className="ml-2 font-mono text-[10px] text-[#4a5568]">← Kabel UTP</div>
              </div>
            </div>
          </div>

          {/* Wire Pool */}
          <div className="w-full max-w-2xl">
            <div className="font-display text-sm font-bold text-white mb-3">
              Kabel Tersedia
              <span className="ml-2 font-mono text-xs text-[#4a5568]">({availableWires.length} kabel)</span>
            </div>
            <div
              className="min-h-20 bg-[#0d1525] border border-[rgba(0,212,255,0.1)] rounded-xl p-4 flex flex-wrap gap-2"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropOnPool}
            >
              {availableWires.length === 0 && (
                <div className="w-full flex items-center justify-center text-[#4a5568] font-mono text-xs">
                  Semua kabel sudah terpasang
                </div>
              )}
              {availableWires.map((wire) => {
                const isStriped = wire.color2 !== null
                const bg = isStriped
                  ? `repeating-linear-gradient(45deg, ${wire.color1} 0px, ${wire.color1} 4px, ${wire.color2} 4px, ${wire.color2} 8px)`
                  : wire.color1
                return (
                  <div
                    key={wire.id}
                    draggable
                    onDragStart={() => handleDragStartPool(wire.id)}
                    onDragEnd={() => {
                      setDraggingId(null)
                      setDraggingFrom(null)
                      setOverSlot(null)
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-black/20 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform select-none ${
                      draggingId === wire.id ? 'opacity-40 scale-95' : ''
                    }`}
                    style={{ background: bg }}
                  >
                    <div className="w-3 h-3 rounded-full bg-black/20" />
                    <span className="font-mono text-[10px] font-bold" style={{ color: wire.textColor }}>
                      {wire.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Control Panel */}
          <div className="w-full max-w-2xl">
            <div className="bg-[#0d1525] border border-[rgba(0,212,255,0.12)] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={reset}
                  className="font-display font-bold text-xs px-4 py-2.5 rounded-lg border border-[rgba(255,255,255,0.1)] text-[#64748b] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-all"
                >
                  ↺ Reset
                </button>
                {/* <button
                  onClick={autoFill}
                  className="font-display font-bold text-xs px-4 py-2.5 rounded-lg border border-[rgba(245,158,11,0.3)] text-[#f59e0b] hover:bg-[rgba(245,158,11,0.08)] transition-all"
                >
                  ✦ Auto-isi (Latihan)
                </button> */}
              </div>

              <div className="flex items-center gap-3">
                <div className="font-mono text-xs text-[#4a5568]">
                  {slots.filter(Boolean).length < 8 ? `Isi ${8 - slots.filter(Boolean).length} slot lagi` : 'Siap untuk diuji!'}
                </div>
                <button
                  onClick={testCable}
                  disabled={slots.filter(Boolean).length < 8}
                  className={`font-display font-bold text-sm px-6 py-2.5 rounded-lg transition-all duration-200 ${
                    slots.filter(Boolean).length === 8
                      ? 'bg-[#00d4ff] text-[#07090f] hover:bg-white glow-cyan cursor-pointer'
                      : 'bg-[rgba(0,212,255,0.1)] text-[#4a5568] cursor-not-allowed'
                  }`}
                >
                  ⚡ Test Cable
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Result Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="animate-modal-in bg-[#0d1525] border rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
            style={{ borderColor: result === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)' }}>

            {/* Background glow */} 
            <div className="absolute inset-0 opacity-10"
              style={{ background: result === 'success' ? 'radial-gradient(circle at 50% 0%, #10b981, transparent 70%)' : 'radial-gradient(circle at 50% 0%, #ef4444, transparent 70%)' }} />

            <div className="relative">
              <div className="text-6xl mb-4 animate-[slide-up_0.4s_ease_0.1s_both]">
                {result === 'success' ? '✅' : '❌'}
              </div>

              <h3 className="font-display text-2xl font-bold mb-2"
                style={{ color: result === 'success' ? '#10b981' : '#ef4444' }}>
                {result === 'success' ? 'Kabel Berhasil!' : 'Ada Kesalahan!'}
              </h3>

              <p className="font-mono text-xs text-[#64748b] mb-4">
                {result === 'success'
                  ? `Urutan kabel ${standard} sudah benar. Koneksi jaringan aktif!`
                  : `${wrongPins.length} pin salah: ${wrongPins.map((p) => `Pin ${p + 1}`).join(', ')}. Periksa urutan warna kabel.`}
              </p>

              {result === 'success' && (
                <div className="mb-4 p-3 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]">
                  <div className="flex items-center justify-center gap-6">
                    <div>
                      <div className="font-display text-xl font-bold text-[#00d4ff]">{standard}</div>
                      <div className="font-mono text-[9px] text-[#4a5568]">Standar</div>
                    </div>
                    <div>
                      <div className="font-display text-xl font-bold text-[#f59e0b]">A</div>
                      <div className="font-mono text-[9px] text-[#4a5568]">Nilai</div>
                    </div>
                  </div>
                  {/* Signal animation */}
                  <div className="mt-3 flex items-center justify-center gap-1">
                    {Array(8).fill(0).map((_, i) => (
                      <div key={i} className="w-1 rounded-full bg-[#10b981]"
                        style={{
                          height: `${8 + Math.sin(i * 0.8) * 6 + 8}px`,
                          animation: `blink ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                          opacity: 0.6 + (i % 3) * 0.2,
                        }} />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="flex-1 py-2.5 rounded-lg border border-[rgba(255,255,255,0.1)] font-display font-bold text-sm text-[#64748b] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-all"
                >
                  Reset
                </button>
                {result === 'error' && (
                  <button
                    onClick={() => { setShowModal(false); setResult('idle') }}
                    className="flex-1 py-2.5 rounded-lg font-display font-bold text-sm"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                  >
                    Coba Lagi
                  </button>
                )}
                {result === 'success' && (
                  <button
                    onClick={reset}
                    className="flex-1 py-2.5 rounded-lg font-display font-bold text-sm bg-[#10b981] text-[#07090f] hover:bg-emerald-400 transition-all glow-emerald"
                  >
                    Lanjutkan! →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
