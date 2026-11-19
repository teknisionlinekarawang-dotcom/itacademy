import { useState, useMemo } from 'react'

function ipToNum(ip: string): number {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return NaN
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

function numToIp(num: number): string {
  return [
    (num >>> 24) & 0xff,
    (num >>> 16) & 0xff,
    (num >>> 8) & 0xff,
    num & 0xff,
  ].join('.')
}

function calcSubnet(ip: string, cidr: number) {
  const ipNum = ipToNum(ip)
  if (isNaN(ipNum) || cidr < 0 || cidr > 32) return null
  const maskNum = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0
  const networkNum = (ipNum & maskNum) >>> 0
  const broadcastNum = (networkNum | (~maskNum >>> 0)) >>> 0
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2
  return {
    networkIP: numToIp(networkNum),
    broadcastIP: numToIp(broadcastNum),
    subnetMask: numToIp(maskNum),
    firstHost: cidr >= 31 ? numToIp(networkNum) : numToIp(networkNum + 1),
    lastHost: cidr >= 31 ? numToIp(broadcastNum) : numToIp(broadcastNum - 1),
    totalHosts,
    usableHosts,
    networkNum,
    broadcastNum,
    maskBinary: maskNum.toString(2).padStart(32, '0'),
    ipBinary: ipNum.toString(2).padStart(32, '0'),
  }
}

function BinaryDisplay({ binary, cidr, label }: { binary: string; cidr: number; label: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] text-[#4a5568] mb-1 uppercase tracking-wider">{label}</div>
      <div className="flex gap-px flex-wrap">
        {binary.split('').map((bit, i) => {
          const isNet = i < cidr
          return (
            <span
              key={i}
              className={`font-mono text-[10px] w-[11px] text-center ${
                i % 8 === 7 ? 'mr-1.5' : ''
              } ${
                isNet
                  ? 'text-[#00d4ff]'
                  : 'text-[#10b981]'
              }`}
            >
              {bit}
            </span>
          )
        })}
      </div>
      <div className="flex gap-px flex-wrap mt-0.5">
        {binary.split('').map((_, i) => {
          const isNet = i < cidr
          const isOctetEnd = i % 8 === 7
          return (
            <span
              key={i}
              className={`font-mono text-[8px] w-[11px] text-center ${isOctetEnd ? 'mr-1.5' : ''} ${isNet ? 'text-[#00d4ff]/40' : 'text-[#10b981]/40'}`}
            >
              {i === 0 ? 'N' : i === cidr - 1 ? 'N' : i === cidr ? 'H' : i === 31 ? 'H' : ''}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function ClassInfo({ ip }: { ip: string }) {
  const first = parseInt(ip.split('.')[0])
  if (first < 128) return <span className="text-[#00d4ff]">Kelas A (1–126)</span>
  if (first < 192) return <span className="text-[#10b981]">Kelas B (128–191)</span>
  if (first < 224) return <span className="text-[#f59e0b]">Kelas C (192–223)</span>
  if (first < 240) return <span className="text-[#a855f7]">Kelas D (Multicast)</span>
  return <span className="text-[#ef4444]">Kelas E (Riset)</span>
}

const exampleNetworks = [
  { label: 'Home Network', ip: '192.168.1.0', cidr: 24 },
  { label: 'Office LAN', ip: '10.0.0.0', cidr: 16 },
  { label: 'Small Subnet', ip: '172.16.5.0', cidr: 28 },
  { label: 'ISP Block', ip: '103.10.20.0', cidr: 22 },
]

export default function SubnettingVisualizer() {
  const [ip, setIp] = useState('192.168.1.0')
  const [cidr, setCidr] = useState(24)
  const [ipInput, setIpInput] = useState('192.168.1.0')
  const [ipError, setIpError] = useState(false)

  const subnet = useMemo(() => calcSubnet(ip, cidr), [ip, cidr])

  function handleIpChange(val: string) {
    setIpInput(val)
    const parts = val.split('.')
    if (parts.length === 4 && parts.every((p) => /^\d{1,3}$/.test(p) && parseInt(p) <= 255)) {
      setIp(val)
      setIpError(false)
    } else {
      setIpError(true)
    }
  }

  function loadExample(ex: typeof exampleNetworks[0]) {
    setIp(ex.ip)
    setIpInput(ex.ip)
    setCidr(ex.cidr)
    setIpError(false)
  }

  return (
    <div className="min-h-screen grid-bg p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌐</span>
              <h1 className="font-display text-xl font-bold text-white">Subnetting Visualizer</h1>
            </div>
            <p className="font-mono text-xs text-[#4a5568]">Kalkulator subnet IP dengan visualisasi interaktif CIDR</p>
          </div>
          <div className="flex items-center gap-2">
            {exampleNetworks.map((ex) => (
              <button
                key={ex.label}
                onClick={() => loadExample(ex)}
                className="font-mono text-[10px] px-2.5 py-1.5 rounded-lg border border-[rgba(0,212,255,0.15)] text-[#4a5568] hover:text-[#00d4ff] hover:border-[rgba(0,212,255,0.3)] transition-all"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Panel */}
        <div className="bg-[#0d1525] border border-[rgba(0,212,255,0.12)] rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* IP Input */}
            <div className="md:col-span-1">
              <label className="block font-mono text-[10px] text-[#4a5568] uppercase tracking-wider mb-2">
                Alamat IP
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => handleIpChange(e.target.value)}
                  placeholder="192.168.1.0"
                  className={`w-full bg-[#07090f] rounded-lg px-4 py-3 font-mono text-sm text-white placeholder-[#2d3748] focus:outline-none transition-all border ${
                    ipError
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-[rgba(0,212,255,0.15)] focus:border-[rgba(0,212,255,0.5)]'
                  }`}
                />
                {!ipError && !isNaN(ipToNum(ip)) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block" />
                  </div>
                )}
              </div>
              {ipError && <p className="font-mono text-[9px] text-red-400 mt-1">Format IP tidak valid</p>}
            </div>

            {/* CIDR Display */}
            <div className="md:col-span-1">
              <label className="block font-mono text-[10px] text-[#4a5568] uppercase tracking-wider mb-2">
                Notasi CIDR
              </label>
              <div className="flex items-center gap-2 bg-[#07090f] rounded-lg px-4 py-3 border border-[rgba(0,212,255,0.15)]">
                <span className="font-mono text-[#4a5568] text-sm">{ip} /</span>
                <span className="font-display text-2xl font-bold text-[#00d4ff]">{cidr}</span>
              </div>
            </div>

            {/* Quick CIDR buttons */}
            <div className="md:col-span-1">
              <label className="block font-mono text-[10px] text-[#4a5568] uppercase tracking-wider mb-2">
                Preset CIDR
              </label>
              <div className="flex flex-wrap gap-1">
                {[8, 16, 24, 25, 26, 27, 28, 30].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCidr(c)}
                    className={`font-mono text-[10px] px-2 py-1 rounded-md border transition-all ${
                      cidr === c
                        ? 'border-[#00d4ff] bg-[rgba(0,212,255,0.12)] text-[#00d4ff]'
                        : 'border-[rgba(0,212,255,0.1)] text-[#4a5568] hover:text-[#00d4ff] hover:border-[rgba(0,212,255,0.25)]'
                    }`}
                  >
                    /{c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CIDR Slider */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-[10px] text-[#4a5568] uppercase tracking-wider">
                Geser untuk ubah prefix length
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#4a5568]">/{cidr}</span>
                <span className="font-mono text-[10px] text-[#4a5568]">—</span>
                <span className="font-mono text-xs text-[#10b981]">
                  {subnet ? subnet.usableHosts.toLocaleString() : '—'} host
                </span>
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                min={1}
                max={32}
                value={cidr}
                onChange={(e) => setCidr(Number(e.target.value))}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #00d4ff ${((cidr - 1) / 31) * 100}%, rgba(0,212,255,0.15) ${((cidr - 1) / 31) * 100}%)`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[9px] text-[#4a5568]">/1 (2B hosts)</span>
              <span className="font-mono text-[9px] text-[#4a5568]">/32 (1 host)</span>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {subnet && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Network ID', value: subnet.networkIP, sub: 'Alamat jaringan', color: '#00d4ff', icon: '🏠' },
              { label: 'Subnet Mask', value: subnet.subnetMask, sub: `/${cidr} prefix`, color: '#a855f7', icon: '🎭' },
              { label: 'Broadcast ID', value: subnet.broadcastIP, sub: 'Alamat broadcast', color: '#f59e0b', icon: '📢' },
              { label: 'Usable Hosts', value: subnet.usableHosts.toLocaleString(), sub: `dari ${subnet.totalHosts.toLocaleString()} total`, color: '#10b981', icon: '💻' },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-[#0d1525] border border-[rgba(0,212,255,0.1)] rounded-xl p-5 hover:border-[rgba(0,212,255,0.2)] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl">{card.icon}</span>
                  <div className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: card.color }} />
                </div>
                <div className="font-mono text-[10px] text-[#4a5568] mb-1 uppercase tracking-wider">{card.label}</div>
                <div className="font-display text-lg font-bold" style={{ color: card.color }}>{card.value}</div>
                <div className="font-mono text-[9px] text-[#4a5568] mt-1">{card.sub}</div>
              </div>
            ))}
          </div>
        )}

        {subnet && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Host Range Details */}
            <div className="bg-[#0d1525] border border-[rgba(0,212,255,0.12)] rounded-xl p-6">
              <h3 className="font-display font-bold text-white text-sm mb-4">Range Host yang Tersedia</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.1)]">
                  <div>
                    <div className="font-mono text-[9px] text-[#4a5568] uppercase">Host Pertama</div>
                    <div className="font-mono text-sm font-bold text-[#00d4ff] mt-0.5">{subnet.firstHost}</div>
                  </div>
                  <div className="text-[#4a5568]">→</div>
                  <div className="text-right">
                    <div className="font-mono text-[9px] text-[#4a5568] uppercase">Host Terakhir</div>
                    <div className="font-mono text-sm font-bold text-[#10b981] mt-0.5">{subnet.lastHost}</div>
                  </div>
                </div>

                {/* Host count visualizer */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-[#4a5568]">Kapasitas host</span>
                    <span className="font-mono text-[10px] text-[#10b981]">{subnet.usableHosts.toLocaleString()} tersedia</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.04)]">
                    <div
                      className="h-full rounded-full transition-all duration-700 progress-bar-glow"
                      style={{
                        width: `${Math.min(100, Math.max(2, (Math.log2(subnet.usableHosts + 1) / 32) * 100))}%`,
                        background: 'linear-gradient(90deg, #00d4ff, #10b981)',
                        color: '#10b981',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[9px] text-[#4a5568]">2^{32 - cidr} = {subnet.totalHosts.toLocaleString()} total</span>
                    <span className="font-mono text-[9px] text-[#4a5568]">−2 (net+bcast)</span>
                  </div>
                </div>

                {/* Network class info */}
                <div className="p-3 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#4a5568]">Kelas IP</span>
                    <span className="font-mono text-[10px] font-bold">
                      <ClassInfo ip={ip} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-[10px] text-[#4a5568]">Jumlah subnet (/24)</span>
                    <span className="font-mono text-[10px] text-[#00d4ff]">
                      {cidr <= 24 ? Math.pow(2, cidr - (parseInt(ip.split('.')[0]) < 128 ? 8 : parseInt(ip.split('.')[0]) < 192 ? 16 : 24)).toLocaleString() : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-[10px] text-[#4a5568]">Wildcard Mask</span>
                    <span className="font-mono text-[10px] text-[#a855f7]">
                      {numToIp((~(cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0)) >>> 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Binary Visualization */}
            <div className="bg-[#0d1525] border border-[rgba(0,212,255,0.12)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-white text-sm">Representasi Binary</h3>
                <div className="flex items-center gap-3 text-[9px] font-mono">
                  <span className="text-[#00d4ff]">■ Network</span>
                  <span className="text-[#10b981]">■ Host</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Octet labels */}
                <div className="flex text-[9px] font-mono text-[#4a5568] mb-1">
                  {['Oktet 1', 'Oktet 2', 'Oktet 3', 'Oktet 4'].map((o, i) => (
                    <span key={i} className="flex-1 text-center">{o}</span>
                  ))}
                </div>

                <BinaryDisplay binary={subnet.ipBinary} cidr={cidr} label={`IP: ${ip}`} />
                <BinaryDisplay binary={subnet.maskBinary} cidr={cidr} label={`Mask: ${subnet.subnetMask}`} />

                {/* Mask visual bar */}
                <div>
                  <div className="font-mono text-[9px] text-[#4a5568] mb-1">Pembagian Network / Host bits</div>
                  <div className="flex h-6 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.06)]">
                    <div
                      className="bg-[#00d4ff] flex items-center justify-center font-mono text-[9px] font-bold text-[#07090f] transition-all duration-500"
                      style={{ width: `${(cidr / 32) * 100}%` }}
                    >
                      {cidr > 4 && `${cidr}b`}
                    </div>
                    <div
                      className="bg-[#10b981] flex items-center justify-center font-mono text-[9px] font-bold text-[#07090f] transition-all duration-500"
                      style={{ width: `${((32 - cidr) / 32) * 100}%` }}
                    >
                      {(32 - cidr) > 4 && `${32 - cidr}b`}
                    </div>
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="font-mono text-[9px] text-[#00d4ff]">{cidr} network bits</span>
                    <span className="font-mono text-[9px] text-[#10b981]">{32 - cidr} host bits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subnet Split Preview */}
        {subnet && cidr <= 28 && (
          <div className="bg-[#0d1525] border border-[rgba(0,212,255,0.12)] rounded-xl p-6">
            <h3 className="font-display font-bold text-white text-sm mb-4">
              Pembagian Subnet (/{cidr} → /{cidr + 1})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((half) => {
                const halfCidr = cidr + 1
                const halfHosts = Math.max(0, Math.pow(2, 32 - halfCidr) - 2)
                const baseNum = subnet.networkNum + half * Math.pow(2, 32 - halfCidr)
                const netIp = numToIp(baseNum)
                const bcastIp = numToIp(baseNum + Math.pow(2, 32 - halfCidr) - 1)
                return (
                  <div key={half} className="p-4 rounded-xl border border-[rgba(0,212,255,0.1)] bg-[rgba(0,212,255,0.03)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] text-[#4a5568]">Subnet {half + 1}</span>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-[rgba(0,212,255,0.2)] text-[#00d4ff]">/{halfCidr}</span>
                    </div>
                    <div className="font-display font-bold text-white text-sm">{netIp}/{halfCidr}</div>
                    <div className="font-mono text-[9px] text-[#4a5568] mt-1">
                      {netIp} — {bcastIp}
                    </div>
                    <div className="font-mono text-[10px] text-[#10b981] mt-1">{halfHosts.toLocaleString()} host</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
