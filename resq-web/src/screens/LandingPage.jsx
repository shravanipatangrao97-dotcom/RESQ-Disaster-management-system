import { useState, useEffect, useRef } from 'react'
import './LandingPage.css'

// ── Data ──────────────────────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: '> GPS LOCK.................OK',        type: 'ok'   },
  { text: '> NDRF CONNECTED...........OK',        type: 'ok'   },
  { text: '> CRITICAL ALERTS..........3',          type: 'crit' },
  { text: '> SYSTEM READY',                       type: 'rdy'  },
]

const STATS_DEF = [
  { raw: 2847, label: 'ACTIVE USERS',    sub: '↑ 142 last hour',               fmt: 'comma', accent: '#2a5a2a', color: '#4db84d', delay: 0   },
  { raw: 3,    label: 'CRITICAL ALERTS', sub: 'Kolhapur · Koyna · NH-166',     fmt: 'int',   accent: '#5a1a1a', color: '#cc3333', delay: 150 },
  { raw: 12,   label: 'SAFE ZONES OPEN', sub: '4 near capacity',               fmt: 'int',   accent: '#1a4a3a', color: '#2dd4bf', delay: 300 },
  { raw: 98,   label: 'SYSTEM UPTIME',   sub: 'All modules online',            fmt: 'pct',   accent: '#2a5a2a', color: '#4db84d', delay: 450 },
]

const TICKER_TEXT = '● CRITICAL: Krishna river at danger mark — Kolhapur  |  ● SEISMIC: 4.2M tremor — Koyna Dam region  |  ● FIRE: Chemical fire — Pimpri MIDC plant  |  ● LANDSLIDE: NH-166 blocked — Mahabaleshwar'

const INCIDENTS = [
  { type: 'CRITICAL', typeColor: '#cc3333', label: 'CRITICAL — KOLHAPUR',       title: 'Krishna river evacuation underway',   meta: '3 min ago · 2.1km from you' },
  { type: 'SEISMIC',  typeColor: '#e89040', label: 'SEISMIC — KOYNA',           title: '4.2M tremor — monitoring active',      meta: '7 min ago · Zone IV' },
  { type: 'CRITICAL', typeColor: '#cc3333', label: 'CRITICAL — MAHABALESHWAR',  title: 'Landslide — NH-166 blocked',           meta: '5 min ago · NDRF deployed' },
  { type: 'FLOOD',    typeColor: '#1a6ef5', label: 'FLOOD — MUMBAI',            title: 'Bandra-Kurla waterlogging',            meta: '12 min ago' },
]

const ZONE_CAPACITY = [
  { name: 'PUNE NDRF BASE',  pct: 42 },
  { name: 'MUMBAI RELIEF',   pct: 78 },
  { name: 'KOLHAPUR EVAC',   pct: 65 },
  { name: 'NASHIK SHELTER',  pct: 91 },
]

const PILLS_QUICK = [
  { label: 'LIVE MAP',    sos: false },
  { label: '⚠ SOS',       sos: true  },
  { label: 'AI ASSIST',   sos: false },
  { label: 'SAFE ZONES',  sos: false },
  { label: 'HAZARD RPT',  sos: false },
  { label: 'NDRF HQ',     sos: false },
]

const FIXED_BLIPS = [
  { r: 90,  a: 0.72, color: '#cc3333' },
  { r: 55,  a: 2.30, color: '#cc3333' },
  { r: 118, a: 4.50, color: '#e89040' },
]

// ② CountUp hook — easeOut cubic, skips if prefers-reduced-motion
function useCountUp(target, duration = 800, delay = 0) {
  const [value, setValue] = useState(0)
  const reduced = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    if (reduced.current) { setValue(target); return }
    const tid = setTimeout(() => {
      const t0 = Date.now()
      const tick = () => {
        const p = Math.min((Date.now() - t0) / duration, 1)
        const e = 1 - Math.pow(1 - p, 3)          // easeOutCubic
        setValue(Math.round(e * target))
        if (p < 1) requestAnimationFrame(tick)
        else setValue(target)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(tid)
  }, [target, duration, delay])
  return value
}

function StatCell({ s }) {
  const n = useCountUp(s.raw, 800, s.delay)
  const display = s.fmt === 'comma' ? n.toLocaleString()
                : s.fmt === 'pct'   ? `${n}%`
                :                     `${n}`
  return (
    <div className="stat-cell">
      <div className="stat-accent" style={{ background: s.accent }} />
      <span className="stat-value" style={{ color: s.color }}>{display}</span>
      <span className="stat-label">{s.label}</span>
      <span className="stat-sub">{s.sub}</span>
    </div>
  )
}

function capColor(pct) {
  if (pct >= 90) return '#cc3333'
  if (pct >= 70) return '#e89040'
  return '#4db84d'
}

// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage({ onEnter }) {
  // ⑤ Typewriter state
  const [doneLines,    setDoneLines]    = useState([])
  const [typingText,   setTypingText]   = useState('')
  const [ready,        setReady]        = useState(false)
  const [exiting,      setExiting]      = useState(false)
  // ① Glitch
  const [glitching,    setGlitching]    = useState(false)

  const canvasRef  = useRef(null)
  const animRef    = useRef(null)
  const reduced    = typeof window !== 'undefined' &&
                     window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ⑤ Typewriter — char-by-char boot sequence
  useEffect(() => {
    let cancelled = false
    setDoneLines([])
    setTypingText('')
    setReady(false)

    function typeLine(idx) {
      if (cancelled) return
      if (idx >= BOOT_LINES.length) {
        setTypingText('')
        setTimeout(() => { if (!cancelled) setReady(true) }, 300)
        return
      }
      if (reduced) {
        setDoneLines(BOOT_LINES)
        setReady(true)
        return
      }
      const { text } = BOOT_LINES[idx]
      let charI = 0
      setTypingText('')
      const typeChar = () => {
        if (cancelled) return
        charI++
        setTypingText(text.slice(0, charI))
        if (charI < text.length) {
          setTimeout(typeChar, 18 + Math.random() * 12)
        } else {
          setTimeout(() => {
            if (cancelled) return
            setDoneLines(prev => [...prev, BOOT_LINES[idx]])
            setTypingText('')
            setTimeout(() => typeLine(idx + 1), 80)
          }, 60)
        }
      }
      const startDelay = idx === 0 ? 400 : 100
      setTimeout(typeChar, startDelay)
    }
    typeLine(0)
    return () => { cancelled = true }
  }, [])

  // ① Glitch timer
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 220)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  // Radar canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width  = 220
    const H = canvas.height = 220
    const cx = W / 2, cy = H / 2
    let angle = 0
    const blipState = FIXED_BLIPS.map(b => ({ ...b, life: 0 }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ;[38, 72, 105].forEach(r => {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(77,184,77,0.18)'; ctx.lineWidth = 0.8; ctx.stroke()
      })
      ctx.strokeStyle = 'rgba(77,184,77,0.1)'; ctx.lineWidth = 0.8
      ctx.beginPath(); ctx.moveTo(cx-115,cy); ctx.lineTo(cx+115,cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx,cy-115); ctx.lineTo(cx,cy+115); ctx.stroke()

      ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle)
      ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,105,0,Math.PI*0.32); ctx.closePath()
      ctx.fillStyle='rgba(77,184,77,0.10)'; ctx.fill()
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(105,0)
      ctx.strokeStyle='rgba(77,184,77,0.85)'; ctx.lineWidth=1.5; ctx.stroke()
      ctx.restore()

      blipState.forEach(b => {
        const da = ((angle % (Math.PI*2)) - b.a + Math.PI*4) % (Math.PI*2)
        if (da < 0.32) b.life = 1
        b.life = Math.max(0, b.life - 0.010)
        if (b.life > 0) {
          const bx = cx + Math.cos(b.a)*b.r*0.72, by = cy + Math.sin(b.a)*b.r*0.72
          const glowAlpha = Math.round(b.life*0.22*255).toString(16).padStart(2,'0')
          const dotAlpha  = Math.round(b.life*255).toString(16).padStart(2,'0')
          ctx.beginPath(); ctx.arc(bx,by,8,0,Math.PI*2)
          ctx.fillStyle = b.color + glowAlpha; ctx.fill()
          ctx.beginPath(); ctx.arc(bx,by,3,0,Math.PI*2)
          ctx.fillStyle = b.color + dotAlpha; ctx.fill()
        }
      })
      ctx.beginPath(); ctx.arc(cx,cy,2.5,0,Math.PI*2)
      ctx.fillStyle='#4db84d'; ctx.fill()
      angle += 0.022
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const handleEnter = () => {
    if (!ready) return
    setExiting(true)
    setTimeout(onEnter, 600)
  }

  return (
    <div className={`landing${exiting ? ' landing--exit' : ''}`}>
      <div className="scanlines" />
      <div className="scan-sweep" />

      {/* ─── ZONE 1: TOPBAR (unchanged) ─── */}
      <header className="landing-header">
        <div className="logo-mark">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#cc3333" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3" fill="#cc3333"/>
            <line x1="14" y1="1"  x2="14" y2="6"  stroke="#cc3333" strokeWidth="1.5"/>
            <line x1="14" y1="22" x2="14" y2="27" stroke="#cc3333" strokeWidth="1.5"/>
            <line x1="1"  y1="14" x2="6"  y2="14" stroke="#cc3333" strokeWidth="1.5"/>
            <line x1="22" y1="14" x2="27" y2="14" stroke="#cc3333" strokeWidth="1.5"/>
          </svg>
          <span className="logo-text">ResQ</span>
        </div>
        <div className="live-badge"><span className="live-dot" />LIVE</div>
        <div className="header-version">v2.1 · MAHARASHTRA</div>
      </header>

      {/* ─── ZONE 2: BREAKING ALERT TICKER ─── */}
      <div className="ticker-bar">
        <span className="ticker-label">⚠ BREAKING</span>
        <div className="ticker-track">
          <span className="ticker-text">{TICKER_TEXT}&nbsp;&nbsp;&nbsp;{TICKER_TEXT}&nbsp;&nbsp;&nbsp;</span>
        </div>
      </div>

      {/* ─── ZONE 3: CENTRED HERO ─── */}
      <section className="hero-zone">
        <p className="hero-eyebrow">// DISASTER RESPONSE SYSTEM</p>
        <h1
          className={`hero-title${glitching ? ' hero-title--glitch' : ''}`}
          data-text="RESQ"
        >RES<span className="hero-q">Q</span></h1>
        <p className="hero-desc">
          Hyperlocal disaster management for Maharashtra. Live hazard mapping,
          AI-powered guidance, and community-driven safe zone tracking — all in real time.
        </p>
      </section>

      {/* ─── ZONE 4: STATS BAR ─── */}
      <div className="stats-bar">
        {STATS_DEF.map(s => <StatCell key={s.label} s={s} />)}
      </div>

      {/* ─── ZONE 5: THREE COLUMN BOTTOM ─── */}
      <div className="three-col">
        {/* COL 1 — LIVE INCIDENTS */}
        <div className="col col--incidents">
          <div className="col-header">// LIVE INCIDENTS</div>
          <div className="col-body incident-list">
            {INCIDENTS.map((inc, i) => (
              <div key={i} className="inc" style={{ borderLeftColor: inc.typeColor }}>
                <span className="inc-type" style={{ color: inc.typeColor }}>{inc.label}</span>
                <p className="inc-title">{inc.title}</p>
                <p className="inc-meta">{inc.meta}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COL 2 — ZONE SCAN */}
        <div className="col col--radar">
          <div className="col-header">// ZONE SCAN · ACTIVE</div>
          <div className="col-body radar-col">
            <div className="radar-wrapper">
              <canvas ref={canvasRef} className="radar-canvas" />
              <div className="radar-scanline" />
              <div className="radar-center-label">ZONE SCAN<br/>ACTIVE</div>
            </div>
            <div className="boot-console">
              {doneLines.map((l, i) => (
                <div key={i} className={`boot-line boot-line--${l.type}`}>{l.text}</div>
              ))}
              {typingText && (
                <div className="boot-line boot-line--typing">
                  {typingText}<span className="blink-block">█</span>
                </div>
              )}
              {!typingText && doneLines.length === BOOT_LINES.length && (
                <div className="boot-line boot-line--cursor">&gt; <span className="blink-block">█</span></div>
              )}
            </div>
          </div>
        </div>

        {/* COL 3 — QUICK ACCESS */}
        <div className="col col--quick">
          <div className="col-header">// QUICK ACCESS</div>
          <div className="col-body quick-col">
            <div className="pill-grid">
              {PILLS_QUICK.map(p => (
                <span className={`qpill${p.sos ? ' qpill--sos' : ''}`} key={p.label}>{p.label}</span>
              ))}
            </div>

            <button
              className={`enter-btn${ready ? ' enter-btn--ready' : ''}`}
              onClick={handleEnter}
              disabled={!ready}
            >
              {ready
                ? <><span className="btn-arrow">▶</span>   ENTER RESQ</>
                : <span className="btn-loading">LOADING SYSTEM<span className="blink">_</span></span>
              }
            </button>
            <p className="enter-hint">
              {ready ? 'SYSTEM OPERATIONAL — CLICK TO PROCEED' : 'INITIALIZING...'}
            </p>

            <div className="zone-cap-section">
              <span className="zone-cap-label">// ZONE CAPACITY</span>
              {ZONE_CAPACITY.map(z => (
                <div key={z.name} className="cap-row">
                  <span className="cap-name">{z.name}</span>
                  <div className="cap-track">
                    <div className="cap-fill" style={{ width: `${z.pct}%`, background: capColor(z.pct) }} />
                  </div>
                  <span className="cap-pct" style={{ color: capColor(z.pct) }}>{z.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── ZONE 6: FOOTER (unchanged) ─── */}
      <footer className="landing-footer">
        <span>© 2025 RESQ DISASTER RESPONSE</span>
        <span className="footer-sep">·</span>
        <span>MAHARASHTRA, INDIA</span>
        <span className="footer-sep">·</span>
        <span>NDRF INTEGRATED</span>
        <div className="footer-alert-pill">
          <span className="footer-alert-dot" />
          3 CRITICAL ALERTS ACTIVE
        </div>
      </footer>
    </div>
  )
}
