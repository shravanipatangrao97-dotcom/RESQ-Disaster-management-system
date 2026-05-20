import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapApp.css'

// ─── ④⑦ Hazard icon: pulse rings + pop-in animation ─────────────────────────
const makeIcon = (color, size = 12, idx = 0) => L.divIcon({
  className: '',
  html: `<div class="hazard-wrap" style="animation-delay:${idx * 180}ms">
    <div class="hazard-dot" style="width:${size}px;height:${size}px;background:${color}"></div>
    <div class="pulse-ring" style="--rc:${color}"></div>
    <div class="pulse-ring pulse-ring--d2" style="--rc:${color}"></div>
  </div>`,
  iconSize: [44, 44], iconAnchor: [22, 22],
})

const YOU_ICON = L.divIcon({
  className: '',
  html: `<div class="you-wrap">
    <div class="you-dot"></div>
    <div class="pulse-ring" style="--rc:#4a9fff"></div>
  </div>`,
  iconSize: [44, 44], iconAnchor: [22, 22],
})

const HOSPITAL_ICON = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;border-radius:50%;background:#e03e3e;border:1.5px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;box-shadow:0 0 10px rgba(224,62,62,0.5)">H</div>`,
  iconSize: [26, 26], iconAnchor: [13, 13],
})

// ─── Data ─────────────────────────────────────────────────────────────────────
const SEV_COLOR = { CRITICAL: '#e03e3e', HIGH: '#e89040', MED: '#e8c840', LOW: '#50bb70' }

const ZONES = {
  danger: [
    // Coastal cyclone / flood zones
    { id: 1,  lat: 19.076,  lng: 72.877,  r: 8000,  label: 'Mumbai — Coastal Flood Zone' },
    { id: 2,  lat: 16.994,  lng: 73.300,  r: 6000,  label: 'Ratnagiri — Cyclone Belt' },
    { id: 3,  lat: 15.860,  lng: 73.680,  r: 5000,  label: 'Sindhudurg — Storm Surge Zone' },
    // Western Ghats landslide zones
    { id: 4,  lat: 17.924,  lng: 73.657,  r: 5000,  label: 'Mahabaleshwar — Landslide Zone' },
    { id: 5,  lat: 18.753,  lng: 73.407,  r: 4000,  label: 'Lonavala — Landslide Zone' },
    { id: 6,  lat: 18.510,  lng: 73.180,  r: 4500,  label: 'Raigad — Landslide/Flood Zone' },
    // Flood-prone river basins
    { id: 7,  lat: 16.695,  lng: 74.243,  r: 7000,  label: 'Kolhapur — Krishna Flood Basin' },
    { id: 8,  lat: 16.855,  lng: 74.564,  r: 6000,  label: 'Sangli — Flood-Prone Basin' },
    // Seismic zones
    { id: 9,  lat: 17.414,  lng: 73.756,  r: 5000,  label: 'Koyna — Seismic Zone IV' },
    { id: 10, lat: 18.403,  lng: 76.580,  r: 5500,  label: 'Latur — Earthquake-Prone Zone' },
  ],
  safe: [
    { id: 1, lat: 18.520,  lng: 73.856,  r: 2000, label: 'Pune NDRF Base Camp',          capacity: 42 },
    { id: 2, lat: 19.022,  lng: 72.850,  r: 1500, label: 'Mumbai Relief Center — Worli', capacity: 78 },
    { id: 3, lat: 16.700,  lng: 74.250,  r: 1800, label: 'Kolhapur Evacuation Camp',     capacity: 65 },
    { id: 4, lat: 21.145,  lng: 79.088,  r: 1500, label: 'Nagpur Civil Hospital Shelter', capacity: 55 },
    { id: 5, lat: 19.870,  lng: 75.340,  r: 1200, label: 'Aurangabad Relief Point',      capacity: 38 },
    { id: 6, lat: 17.000,  lng: 73.310,  r: 1000, label: 'Ratnagiri SDRF Camp',          capacity: 91 },
  ],
}

const HAZARDS = [
  // Coastal — cyclones & flooding
  { id: 1,  lat: 19.040,  lng: 72.820,  type: 'FLOOD',      sev: 'CRITICAL', time: '8m',  desc: 'Severe waterlogging in Bandra-Kurla — road impassable' },
  { id: 2,  lat: 19.180,  lng: 72.960,  type: 'WEATHER',    sev: 'HIGH',     time: '15m', desc: 'Cyclonic wind gusts 90 km/h along Mumbai coastline' },
  { id: 3,  lat: 16.980,  lng: 73.280,  type: 'WEATHER',    sev: 'HIGH',     time: '20m', desc: 'Storm surge warning — Ratnagiri harbour' },
  { id: 4,  lat: 15.870,  lng: 73.700,  type: 'FLOOD',      sev: 'MED',      time: '35m', desc: 'Tidal flooding in low-lying Sindhudurg villages' },
  // Western Ghats — landslides
  { id: 5,  lat: 17.930,  lng: 73.650,  type: 'EARTHQUAKE', sev: 'CRITICAL', time: '5m',  desc: 'Active landslide near Mahabaleshwar — NH-166 blocked' },
  { id: 6,  lat: 18.760,  lng: 73.400,  type: 'EARTHQUAKE', sev: 'HIGH',     time: '12m', desc: 'Rockfall alert on Lonavala ghat section' },
  { id: 7,  lat: 18.500,  lng: 73.170,  type: 'EARTHQUAKE', sev: 'MED',      time: '28m', desc: 'Soil erosion — Raigad hillside settlement at risk' },
  // River basin floods
  { id: 8,  lat: 16.700,  lng: 74.230,  type: 'FLOOD',      sev: 'CRITICAL', time: '3m',  desc: 'Krishna river at danger mark — Kolhapur evacuation underway' },
  { id: 9,  lat: 16.860,  lng: 74.560,  type: 'FLOOD',      sev: 'HIGH',     time: '10m', desc: 'Sangli bridge submerged — 200+ stranded' },
  { id: 10, lat: 18.530,  lng: 73.870,  type: 'FLOOD',      sev: 'MED',      time: '45m', desc: 'Mutha river overflow — Pune low-lying areas affected' },
  // Seismic
  { id: 11, lat: 17.420,  lng: 73.760,  type: 'EARTHQUAKE', sev: 'HIGH',     time: '2m',  desc: 'Tremor 4.2 magnitude — Koyna Dam region' },
  { id: 12, lat: 18.400,  lng: 76.580,  type: 'EARTHQUAKE', sev: 'MED',      time: '1h',  desc: 'Minor seismic activity — Latur district' },
  // Industrial fire
  { id: 13, lat: 18.630,  lng: 73.800,  type: 'FIRE',       sev: 'CRITICAL', time: '6m',  desc: 'Chemical fire at Pimpri-Chinchwad MIDC plant' },
  { id: 14, lat: 19.290,  lng: 73.050,  type: 'FIRE',       sev: 'HIGH',     time: '18m', desc: 'Warehouse blaze in Bhiwandi industrial zone' },
  // Biological
  { id: 15, lat: 21.150,  lng: 79.090,  type: 'BIOLOGICAL', sev: 'MED',      time: '2h',  desc: 'Water contamination alert — Nagpur east' },
  // Transport
  { id: 16, lat: 19.870,  lng: 75.330,  type: 'TRANSPORT',  sev: 'MED',      time: '30m', desc: 'NH-52 blocked by landslide debris near Aurangabad' },
]

const INCIDENTS = [
  { id: 1,  type: 'FLOOD',      color: '#1a6ef5', title: 'Severe flooding — Mumbai Bandra-Kurla',     dist: '—',      status: 'ACTIVE',     time: '8m ago',   verified: true,  sev: 'CRITICAL', cap: null },
  { id: 2,  type: 'FLOOD',      color: '#1a6ef5', title: 'Krishna river at danger mark — Kolhapur',   dist: '—',      status: 'ACTIVE',     time: '3m ago',   verified: true,  sev: 'CRITICAL', cap: null },
  { id: 3,  type: 'EARTHQUAKE', color: '#e89040', title: 'Landslide — Mahabaleshwar NH-166 blocked',  dist: '—',      status: 'ACTIVE',     time: '5m ago',   verified: true,  sev: 'CRITICAL', cap: null },
  { id: 4,  type: 'FIRE',       color: '#e03e3e', title: 'Chemical fire — Pimpri MIDC plant',         dist: '—',      status: 'ACTIVE',     time: '6m ago',   verified: true,  sev: 'CRITICAL', cap: null },
  { id: 5,  type: 'EARTHQUAKE', color: '#e89040', title: 'Tremor 4.2M — Koyna Dam region',            dist: '—',      status: 'ACTIVE',     time: '2m ago',   verified: true,  sev: 'HIGH',     cap: null },
  { id: 6,  type: 'SAFE ZONE',  color: '#50bb70', title: 'Pune NDRF Base Camp',                       dist: '—',      status: 'OPEN',       time: '1h ago',   verified: true,  sev: 'SAFE',     cap: 42  },
  { id: 7,  type: 'SAFE ZONE',  color: '#50bb70', title: 'Mumbai Relief Center — Worli',              dist: '—',      status: 'OPEN',       time: '30m ago',  verified: true,  sev: 'SAFE',     cap: 78  },
  { id: 8,  type: 'SAFE ZONE',  color: '#50bb70', title: 'Kolhapur Evacuation Camp',                  dist: '—',      status: 'OPEN',       time: '45m ago',  verified: true,  sev: 'SAFE',     cap: 65  },
  { id: 9,  type: 'WEATHER',    color: '#5a8a7a', title: 'Cyclonic winds — Mumbai coast',             dist: '—',      status: 'UNVERIFIED', time: '15m ago',  verified: false, sev: null,       cap: null },
  { id: 10, type: 'WEATHER',    color: '#5a8a7a', title: 'Storm surge — Ratnagiri harbour',           dist: '—',      status: 'UNVERIFIED', time: '20m ago',  verified: false, sev: null,       cap: null },
  { id: 11, type: 'TRANSPORT',  color: '#5a7a8a', title: 'NH-52 blocked — Aurangabad',                dist: '—',      status: 'UNVERIFIED', time: '30m ago',  verified: false, sev: null,       cap: null },
  { id: 12, type: 'BIOLOGICAL', color: '#2a8a40', title: 'Water contamination — Nagpur east',         dist: '—',      status: 'UNVERIFIED', time: '2h ago',   verified: false, sev: null,       cap: null },
]

const FILTER_CATS = [
  { id: 'ALL',        label: 'ALL HAZARDS',  bc: '#e03e3e', tc: '#fff',    bg: '#e03e3e' },
  { id: 'FLOOD',      label: 'FLOOD',        bc: '#1a6ef5', tc: '#5a9fff', bg: 'transparent' },
  { id: 'EARTHQUAKE', label: 'EARTHQUAKE',   bc: '#c07020', tc: '#e89040', bg: 'transparent' },
  { id: 'FIRE',       label: 'FIRE',         bc: '#cc3333', tc: '#f06060', bg: 'transparent' },
  { id: 'TECH',       label: 'TECH/MAN-MADE',bc: '#7a6a50', tc: '#b8a080', bg: 'transparent' },
  { id: 'BIOLOGICAL', label: 'BIOLOGICAL',   bc: '#2a8a40', tc: '#50bb70', bg: 'transparent' },
  { id: 'SECURITY',   label: 'SECURITY',     bc: '#6a5a8a', tc: '#9a88bb', bg: 'transparent' },
  { id: 'TRANSPORT',  label: 'TRANSPORT',    bc: '#5a7a8a', tc: '#88b0cc', bg: 'transparent' },
  { id: 'WEATHER',    label: 'WEATHER',      bc: '#5a8a7a', tc: '#80ccb0', bg: 'transparent' },
]

function LocationSetter({ pos }) {
  const map = useMap()
  useEffect(() => { if (pos) map.setView(pos, 8) }, [pos])
  return null
}

// ─── ⑧ Capacity bar ──────────────────────────────────────────────────────────
function CapBar({ pct }) {
  const color = pct > 90 ? '#e03e3e' : pct > 75 ? '#e89040' : '#50bb70'
  return (
    <div className="cap-bar-wrap">
      <div className="cap-bar-bg">
        <div className="cap-bar-fill" style={{ '--pct': `${pct}%`, '--cap-color': color }} />
      </div>
      <span className="cap-label" style={{ color }}>{pct}%</span>
    </div>
  )
}

// ─── Report Modal ─────────────────────────────────────────────────────────────
function ReportModal({ onClose }) {
  const [type, setType] = useState('FLOOD')
  const [sev, setSev]   = useState('HIGH')
  const [desc, setDesc] = useState('')
  const [done, setDone] = useState(false)

  if (done) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-success">
          <div className="success-icon">✓</div>
          <p className="modal-title">REPORT SUBMITTED</p>
          <p className="modal-sub">3 verifications needed to publish</p>
          <button className="modal-close-btn" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  )
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">⚠ REPORT HAZARD</span>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <span className="modal-label">HAZARD TYPE</span>
          <div className="modal-pills">
            {['FLOOD','FIRE','EARTHQUAKE','SECURITY','TRANSPORT','WEATHER','BIOLOGICAL'].map(t => (
              <button key={t} className={`modal-pill${type===t?' active':''}`} onClick={() => setType(t)}>{t}</button>
            ))}
          </div>
          <span className="modal-label">SEVERITY</span>
          <div className="modal-pills">
            {['LOW','MED','HIGH','CRITICAL'].map(s => (
              <button key={s} className={`modal-pill${sev===s?' active':''}`}
                style={sev===s?{borderColor:SEV_COLOR[s],background:SEV_COLOR[s]+'22',color:SEV_COLOR[s]}:{}}
                onClick={() => setSev(s)}>{s}</button>
            ))}
          </div>
          <span className="modal-label">DESCRIPTION</span>
          <textarea className="modal-textarea" rows={3} placeholder="Describe the hazard…" value={desc} onChange={e => setDesc(e.target.value)} />
          <button className="modal-submit" onClick={() => setDone(true)}>SUBMIT REPORT</button>
        </div>
      </div>
    </div>
  )
}

// ─── AI Drawer ────────────────────────────────────────────────────────────────
function AiDrawer({ onClose }) {
  const [msgs, setMsgs]       = useState([{ role:'ai', text:'ResQ AI online. How can I assist during this emergency?' }])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])
  const RESPONSES = [
    'Move to higher ground if in a flood-prone area. Follow marked evacuation routes.',
    'Emergency contacts — NDRF: 011-24363260 · Ambulance: 108 · Fire: 101 · State: 1070',
    'Nearest safe zone is 1.4 km northeast. Relief camp is fully operational.',
    'Wind advisory: 55–70 km/h expected. Secure loose objects and stay indoors.',
    'Avoid untreated water. Boil before use. Medical camp active at Town Hall.',
  ]
  const send = async () => {
    if (!input.trim() || loading) return
    const q = input.trim(); setInput(''); setLoading(true)
    setMsgs(m => [...m, { role:'user', text:q }])
    await new Promise(r => setTimeout(r, 900 + Math.random()*600))
    setMsgs(m => [...m, { role:'ai', text:RESPONSES[Math.floor(Math.random()*RESPONSES.length)] }])
    setLoading(false)
  }
  return (
    <div className="drawer">
      <div className="drawer-header">
        <span className="drawer-title">RESQ AI</span>
        <span className="ai-badge">GEMINI</span>
        <button className="modal-x" onClick={onClose}>✕</button>
      </div>
      <div className="drawer-msgs">
        {msgs.map((m,i) => <div key={i} className={`ai-msg ai-msg--${m.role}`}>{m.text}</div>)}
        {loading && <div className="ai-msg ai-msg--ai ai-thinking">Analyzing<span className="blink">…</span></div>}
        <div ref={endRef}/>
      </div>
      <div className="drawer-input-row">
        <input className="drawer-input" value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask ResQ AI…"/>
        <button className="drawer-send" onClick={send} disabled={loading}>→</button>
      </div>
    </div>
  )
}

// ─── Alerts Drawer ────────────────────────────────────────────────────────────
function AlertsDrawer({ onClose }) {
  const alerts = [
    { id: 1, type: 'CRITICAL', color: '#e03e3e', title: 'Flash flood warning — sector 4', time: '3m ago', desc: 'River levels at 9.2m, evacuation recommended' },
    { id: 2, type: 'CRITICAL', color: '#e03e3e', title: 'Structure fire — industrial zone', time: '12m ago', desc: 'NDRF dispatched, 2 units responding' },
    { id: 3, type: 'WARNING',  color: '#e89040', title: 'Road blockage NH-361', time: '8m ago', desc: 'Unverified — community report, needs confirmation' },
    { id: 4, type: 'ADVISORY', color: '#4a9fff', title: 'High wind advisory', time: '15m ago', desc: 'Winds 55-70 km/h expected until 0800' },
    { id: 5, type: 'WARNING',  color: '#e89040', title: 'Water contamination alert', time: '22m ago', desc: 'Boil advisory for sectors 3-6' },
  ]
  return (
    <div className="drawer">
      <div className="drawer-header">
        <span className="drawer-title">ALERTS</span>
        <span className="alert-count-badge">{alerts.length}</span>
        <button className="modal-x" onClick={onClose}>✕</button>
      </div>
      <div className="drawer-msgs" style={{ padding: 0 }}>
        {alerts.map(a => (
          <div key={a.id} className={`alert-item${a.type === 'CRITICAL' ? ' alert-item--critical' : ''}`}>
            <div className="alert-item-header">
              <span className="inc-dot" style={{ background: a.color }} />
              <span className="alert-type" style={{ color: a.color }}>{a.type}</span>
              <span className="alert-time">{a.time}</span>
            </div>
            <p className="alert-title">{a.title}</p>
            <p className="alert-desc">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ⑥ Incident card overlay (top-left) ──────────────────────────────────────
function IncidentCards() {
  return (
    <div className="incident-cards">
      {/* CRITICAL → ⑥ alert-flash animation */}
      <div className="inc-card inc-card--critical" style={{ borderColor:'#e03e3e' }}>
        <div className="inc-card-type">
          <span className="inc-dot" style={{ background:'#e03e3e' }}/>
          <span style={{ color:'#e03e3e', fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'0.1em' }}>CRITICAL — KOLHAPUR</span>
        </div>
        <p className="inc-card-desc">Krishna river at danger mark — evacuation underway</p>
        <p className="inc-card-meta">Updated 3 min ago · Kolhapur district</p>
      </div>
      <div className="inc-card inc-card--critical" style={{ borderColor:'#e03e3e' }}>
        <div className="inc-card-type">
          <span className="inc-dot" style={{ background:'#e03e3e' }}/>
          <span style={{ color:'#e03e3e', fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'0.1em' }}>CRITICAL — MAHABALESHWAR</span>
        </div>
        <p className="inc-card-desc">Active landslide — NH-166 blocked, NDRF deployed</p>
        <p className="inc-card-meta">Updated 5 min ago · Western Ghats</p>
      </div>
      <div className="inc-card" style={{ borderColor:'#e89040' }}>
        <div className="inc-card-type">
          <span className="inc-dot" style={{ background:'#e89040' }}/>
          <span style={{ color:'#e89040', fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'0.1em' }}>SEISMIC ALERT — KOYNA</span>
        </div>
        <p className="inc-card-desc">4.2M tremor near Koyna Dam — monitoring active</p>
        <p className="inc-card-meta">2 min ago · Seismic Zone IV</p>
      </div>
    </div>
  )
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────
function Sidebar() {
  const verified   = INCIDENTS.filter(i => i.verified)
  const unverified = INCIDENTS.filter(i => !i.verified)
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">INCIDENTS</span>
        <span className="sidebar-count">{INCIDENTS.length}</span>
      </div>
      <div className="sidebar-list">
        {verified.map(inc => (
          <div
            key={inc.id}
            className={`incident-row${inc.sev==='CRITICAL'?' incident-row--critical':''}`}
          >
            <div className="inc-type-row">
              <span className="inc-dot" style={{ background:inc.color }}/>
              <span className="inc-type" style={{ color:inc.color }}>{inc.type}</span>
              <span className="inc-status" style={{ color:inc.status==='ACTIVE'?'#e03e3e':'#50bb70' }}>{inc.status}</span>
            </div>
            <p className="inc-title">{inc.title}</p>
            {/* ⑧ Capacity bar for safe zones */}
            {inc.cap !== null && <CapBar pct={inc.cap} />}
            <p className="inc-meta">{inc.dist} · {inc.time}</p>
          </div>
        ))}
        <div className="unverified-banner">
          <span className="unverified-label">⚠ UNVERIFIED ({unverified.length} REPORTS)</span>
          <p className="unverified-sub">Community reports — not confirmed by authorities</p>
        </div>
        {unverified.map(inc => (
          <div className="incident-row incident-row--unverified" key={inc.id}>
            <div className="inc-type-row">
              <span className="inc-dot" style={{ background:'#e89040' }}/>
              <span className="inc-type" style={{ color:'#e89040' }}>{inc.type}</span>
              <button className="verify-btn">VERIFY</button>
            </div>
            <p className="inc-title">{inc.title}</p>
            <p className="inc-meta">{inc.dist} · {inc.time}</p>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <span className="coords-text">19°36′N 78°27′E · ±12m</span>
      </div>
    </aside>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="legend">
      <p className="legend-title">LEGEND</p>
      {[
        { c:'#e03e3e', l:'Danger Zone'     },
        { c:'#50bb70', l:'Safe Zone'       },
        { c:'#e89040', l:'Reported Hazard' },
        { c:'#4a9fff', l:'Your Location'   },
      ].map(({ c, l }) => (
        <div className="legend-row" key={l}>
          <span className="legend-dot" style={{ background:c }}/>
          <span>{l}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-dot" style={{ background:'#50bb70' }}/>
        <span>LOCATION ACTIVE</span>
      </div>
      <div className="status-item">
        <span className="status-dot" style={{ background:'#4a9fff' }}/>
        <span>SYNCED 12S AGO</span>
      </div>
      <div className="status-item">
        <span className="status-dot" style={{ background:'#e89040' }}/>
        <span>3 UNVERIFIED REPORTS NEARBY</span>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MapApp() {
  const DEFAULT = [18.5, 75.0]
  const [pos, setPos]           = useState(null)
  const [filter, setFilter]     = useState('ALL')
  const [showReport, setReport]   = useState(false)
  const [showAi, setAi]           = useState(false)
  const [showAlerts, setAlerts]   = useState(false)
  const [sos, setSos]             = useState(false)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => setPos([p.coords.latitude, p.coords.longitude]),
      () => setPos(DEFAULT),
    )
  }, [])

  const handleSos = () => { setSos(true); setTimeout(() => setSos(false), 3000) }

  return (
    <div className="mapapp">
      {/* ── Header ── */}
      <header className="mapapp-header">
        <div className="logo-lockup">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#e03e3e" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3"  fill="#e03e3e"/>
            <line x1="14" y1="1"  x2="14" y2="6"  stroke="#e03e3e" strokeWidth="1.5"/>
            <line x1="14" y1="22" x2="14" y2="27" stroke="#e03e3e" strokeWidth="1.5"/>
            <line x1="1"  y1="14" x2="6"  y2="14" stroke="#e03e3e" strokeWidth="1.5"/>
            <line x1="22" y1="14" x2="27" y2="14" stroke="#e03e3e" strokeWidth="1.5"/>
          </svg>
          <div>
            <div className="logo-name">RESQ</div>
            <div className="logo-sub">DISASTER RESPONSE</div>
          </div>
        </div>
        <div className="live-pill"><span className="live-dot-g"/>LIVE</div>
        <div className="hdr-actions">
          <button className="icon-btn" onClick={() => { setAlerts(!showAlerts); setAi(false) }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="notif-dot"/>
          </button>
          <button className="icon-btn" onClick={() => { setAi(!showAi); setAlerts(false) }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <button className={`sos-btn${sos?' sos-btn--active':''}`} onClick={handleSos}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z"/></svg>
            SOS
          </button>
        </div>
      </header>

      {/* ── Filter Bar ── */}
      <div className="filter-bar">
        {FILTER_CATS.map(cat => (
          <button key={cat.id} className="filter-pill"
            style={filter===cat.id
              ? { background:cat.bg, borderColor:cat.bc, color:cat.tc, opacity:1 }
              : { borderColor:cat.bc+'55', color:cat.tc+'aa' }
            }
            onClick={() => setFilter(cat.id)}
          >{cat.label}</button>
        ))}
      </div>

      {/* ── Main Area ── */}
      <div className="main-area">
        <div className="map-wrap">
          <div className="map-grid"/>
          {/* ③ Map scanline */}
          <div className="map-scanline"/>

          <MapContainer center={DEFAULT} zoom={7} zoomControl={false}
            style={{ width:'100%', height:'100%' }} attributionControl={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"/>
            {pos && <LocationSetter pos={pos}/>}

            {/* Danger zones — always visible (geographic risk areas) */}
            {ZONES.danger.map(z => (
              <Circle key={z.id} center={[z.lat,z.lng]} radius={z.r}
                pathOptions={{ color:'#e03e3e', weight:1.5, dashArray:'6 4', fillColor:'rgba(224,62,62,0.06)', fillOpacity:1 }}>
                <Popup><b style={{color:'#e03e3e'}}>{z.label}</b></Popup>
              </Circle>
            ))}

            {/* Safe zones */}
            {ZONES.safe.map(z => (
              <Circle key={z.id} center={[z.lat,z.lng]} radius={z.r}
                pathOptions={{ color:'#50bb70', weight:1.5, dashArray:'6 4', fillColor:'rgba(80,180,80,0.06)', fillOpacity:1 }}>
                <Popup><b style={{color:'#50bb70'}}>{z.label}</b></Popup>
              </Circle>
            ))}

            {/* ④⑦ Hazard markers with pulse rings + staggered pop-in */}
            {HAZARDS
              .filter(h => filter==='ALL' || h.type===filter)
              .map((h, i) => (
                <Marker key={h.id} position={[h.lat,h.lng]} icon={makeIcon(SEV_COLOR[h.sev], 12, i)}>
                  <Popup>
                    <div style={{ fontFamily:'monospace', fontSize:12, minWidth:170 }}>
                      <b style={{color:SEV_COLOR[h.sev]}}>[{h.type}] {h.sev}</b><br/>
                      <span style={{color:'#999'}}>{h.time} ago</span><br/>
                      {h.desc}
                    </div>
                  </Popup>
                </Marker>
              ))}


            {pos && (
              <Marker position={pos} icon={YOU_ICON}>
                <Popup><b style={{color:'#4a9fff'}}>You are here</b></Popup>
              </Marker>
            )}
          </MapContainer>

          <IncidentCards/>
          <Legend/>

          <button className="report-fab" onClick={() => setReport(true)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z"/></svg>
            Report Hazard
          </button>

          {sos && (
            <div className="sos-overlay">
              <div className="sos-ring"/>
              <p className="sos-text">SOS TRANSMITTED</p>
              <p className="sos-sub">Emergency services notified</p>
            </div>
          )}
        </div>

        <Sidebar/>
      </div>

      <StatusBar/>
      {showReport && <ReportModal onClose={() => setReport(false)}/>}
      {showAi     && <AiDrawer    onClose={() => setAi(false)}/>}
      {showAlerts && <AlertsDrawer onClose={() => setAlerts(false)}/>}
    </div>
  )
}
