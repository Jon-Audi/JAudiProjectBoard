'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// ─── SVG ILLUSTRATIONS ───────────────────────────────────────────────────────
const ILLUSTRATIONS = {
  vdipole_wiring: (
    <svg width="480" height="195" viewBox="0 0 480 195" xmlns="http://www.w3.org/2000/svg" style={{maxWidth:'100%'}}>
      <rect width="480" height="195" fill="#0a0c0b"/>
      <rect x="20" y="90" width="160" height="14" rx="3" fill="#2a3a2a" stroke="#00e676" strokeWidth="1.2"/>
      <text x="100" y="78" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="10" textAnchor="middle">545mm (21.5&quot;)</text>
      <text x="22" y="120" fill="#00e676" fontFamily="Share Tech Mono" fontSize="9">ARM 1</text>
      {[40,58,76,94,112,130,148,166].map(x=><line key={x} x1={x} x2={x} y1="90" y2="104" stroke="#ff9800" strokeWidth="1.5" strokeOpacity=".7"/>)}
      <circle cx="240" cy="97" r="24" fill="#191c1a" stroke="#00bcd4" strokeWidth="1.5"/>
      <text x="240" y="101" fill="#00bcd4" fontFamily="Share Tech Mono" fontSize="9" textAnchor="middle">HUB</text>
      <rect x="300" y="90" width="160" height="14" rx="3" fill="#2a3a2a" stroke="#00e676" strokeWidth="1.2"/>
      <text x="380" y="78" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="10" textAnchor="middle">545mm (21.5&quot;)</text>
      <text x="432" y="120" fill="#00e676" fontFamily="Share Tech Mono" fontSize="9">ARM 2</text>
      {[314,332,350,368,386,404,422,440].map(x=><line key={x} x1={x} x2={x} y1="90" y2="104" stroke="#ff9800" strokeWidth="1.5" strokeOpacity=".7"/>)}
      <line x1="240" x2="240" y1="121" y2="180" stroke="#ce93d8" strokeWidth="3"/>
      <text x="255" y="155" fill="#ce93d8" fontFamily="Share Tech Mono" fontSize="9">COAX DOWN</text>
      <text x="255" y="167" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="8">through mast pipe</text>
      <line x1="180" x2="228" y1="97" y2="97" stroke="#fff176" strokeWidth="1.5" strokeDasharray="3"/>
      <text x="150" y="87" fill="#fff176" fontFamily="Share Tech Mono" fontSize="8">CENTER COND.</text>
      <line x1="300" x2="252" y1="97" y2="97" stroke="#ff9800" strokeWidth="1.5" strokeDasharray="3"/>
      <text x="302" y="87" fill="#ff9800" fontFamily="Share Tech Mono" fontSize="8">SHIELD/BRAID</text>
      <text x="240" y="58" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="8" textAnchor="middle">180° spread (horizontal)</text>
    </svg>
  ),
  coax_strip: (
    <svg width="420" height="130" viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style={{maxWidth:'100%'}}>
      <rect width="420" height="130" fill="#0a0c0b"/>
      <rect x="20" y="52" width="380" height="26" rx="4" fill="#2a2a2a" stroke="#444" strokeWidth="1"/>
      <rect x="290" y="50" width="90" height="30" rx="2" fill="#777" stroke="#999" strokeWidth="1"/>
      <rect x="340" y="60" width="60" height="10" rx="2" fill="#ff9800"/>
      <line x1="150" x2="150" y1="50" y2="36" stroke="#6b756e" strokeWidth="1"/>
      <text x="80" y="33" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="9">OUTER JACKET — leave on</text>
      <line x1="320" x2="320" y1="50" y2="25" stroke="#aaa" strokeWidth="1"/>
      <text x="280" y="21" fill="#aaa" fontFamily="Share Tech Mono" fontSize="9">BRAID → ARM 2</text>
      <line x1="370" x2="370" y1="70" y2="105" stroke="#ff9800" strokeWidth="1"/>
      <text x="310" y="118" fill="#ff9800" fontFamily="Share Tech Mono" fontSize="9">CENTER COND. → ARM 1</text>
      <text x="315" y="100" fill="#00bcd4" fontFamily="Share Tech Mono" fontSize="8">~30mm exposed</text>
    </svg>
  ),
  proxmox_usb: (
    <svg width="460" height="190" viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg" style={{maxWidth:'100%'}}>
      <rect width="460" height="190" fill="#0a0c0b"/>
      <rect x="15" y="25" width="140" height="85" rx="3" fill="#191c1a" stroke="#f44336" strokeWidth="1.5"/>
      <text x="85" y="46" fill="#f44336" fontFamily="Share Tech Mono" fontSize="10" textAnchor="middle">PROXMOX HOST</text>
      <rect x="28" y="56" width="65" height="20" rx="2" fill="#111" stroke="#2a2e2c"/>
      <text x="60" y="70" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="8" textAnchor="middle">PVE NODE</text>
      <rect x="148" y="68" width="13" height="10" fill="#1a1a1a" stroke="#00bcd4" strokeWidth="1"/>
      <rect x="172" y="64" width="50" height="18" rx="2" fill="#1a2030" stroke="#00bcd4" strokeWidth="1.5"/>
      <text x="197" y="77" fill="#00bcd4" fontFamily="Share Tech Mono" fontSize="9" textAnchor="middle">RTL-SDR</text>
      <line x1="161" x2="172" y1="73" y2="73" stroke="#00bcd4" strokeWidth="2"/>
      <rect x="285" y="25" width="155" height="85" rx="3" fill="#191c1a" stroke="#00e676" strokeWidth="1.5"/>
      <text x="362" y="46" fill="#00e676" fontFamily="Share Tech Mono" fontSize="10" textAnchor="middle">UBUNTU VM</text>
      <rect x="298" y="56" width="129" height="18" rx="2" fill="#111" stroke="#2a2e2c"/>
      <text x="362" y="69" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="8" textAnchor="middle">SatDump + scheduler</text>
      <line x1="232" x2="278" y1="73" y2="73" stroke="#00bcd4" strokeWidth="1.5" strokeDasharray="4"/>
      <polygon points="278,69 286,73 278,77" fill="#00bcd4"/>
      <text x="244" y="65" fill="#00bcd4" fontFamily="Share Tech Mono" fontSize="8">USB PASSTHROUGH</text>
      <line x1="197" x2="197" y1="82" y2="120" stroke="#ce93d8" strokeWidth="1.5"/>
      <circle cx="197" cy="130" r="8" fill="none" stroke="#ce93d8" strokeWidth="1.5"/>
      <text x="210" y="134" fill="#ce93d8" fontFamily="Share Tech Mono" fontSize="8">SMA ← coax from antenna</text>
      <line x1="362" x2="362" y1="110" y2="148" stroke="#fff176" strokeWidth="1.5"/>
      <polygon points="358,140 362,150 366,140" fill="#fff176"/>
      <text x="372" y="143" fill="#fff176" fontFamily="Share Tech Mono" fontSize="8">DECODED IMAGES</text>
    </svg>
  ),
  esp32_dashboard: (
    <svg width="400" height="220" viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{maxWidth:'100%'}}>
      <rect width="400" height="220" fill="#0a0c0b"/>
      <rect x="55" y="18" width="290" height="175" rx="8" fill="#0d0f0e" stroke="#ff9800" strokeWidth="2"/>
      <rect x="63" y="26" width="274" height="159" rx="4" fill="#080a09"/>
      <text x="200" y="50" fill="#ff9800" fontFamily="Share Tech Mono" fontSize="11" textAnchor="middle">SATELLITE PASSES</text>
      <line x1="75" x2="325" y1="56" y2="56" stroke="#2a2e2c" strokeWidth="1"/>
      <rect x="78" y="62" width="244" height="25" rx="2" fill="#0f1210"/>
      <text x="88" y="79" fill="#00e676" fontFamily="Share Tech Mono" fontSize="10">NOAA-19</text>
      <text x="200" y="79" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="9" textAnchor="middle">15:08 UTC  67°</text>
      <text x="315" y="79" fill="#00bcd4" fontFamily="Share Tech Mono" fontSize="9" textAnchor="end">BEST</text>
      <rect x="78" y="91" width="244" height="25" rx="2" fill="#0f1210"/>
      <text x="88" y="108" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="10">METEOR-M2-3</text>
      <text x="200" y="108" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="9" textAnchor="middle">16:44 UTC  32°</text>
      <rect x="78" y="120" width="244" height="25" rx="2" fill="#0f1210"/>
      <text x="88" y="137" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="10">NOAA-18</text>
      <text x="200" y="137" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="9" textAnchor="middle">18:21 UTC  44°</text>
      <line x1="75" x2="325" y1="150" y2="150" stroke="#2a2e2c" strokeWidth="1"/>
      <text x="88" y="165" fill="#00bcd4" fontFamily="Share Tech Mono" fontSize="8">RECORDING NOAA-19...</text>
      <rect x="220" y="158" width="95" height="6" rx="2" fill="#1a2e1d"/>
      <rect x="220" y="158" width="44" height="6" rx="2" fill="#00e676"/>
      <text x="88" y="178" fill="#6b756e" fontFamily="Share Tech Mono" fontSize="7">WiFi ✓  API connected  Newark NJ</text>
    </svg>
  ),
}

// ─── VAR SUBSTITUTION ────────────────────────────────────────────────────────
function substituteVars(code, devices) {
  let out = code
  devices.forEach(d => {
    const prefix = d.name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()
    const extras = d.extras || {}
    const map = {
      IP: d.ip, HOST: d.host, USER: d.username,
      SSID: extras.ssid || '', PORT: extras.sshport || extras.port || '',
      COMPORT: extras.comport || '', BOARD: extras.board || '',
      WIFIPW: extras.wifipw || '',
    }
    Object.entries(map).forEach(([k, v]) => {
      if (v) out = out.replace(new RegExp(`\\{\\{${prefix}_${k}\\}\\}`, 'g'), v)
    })
  })
  out = out.replace(/\{\{LAT\}\}/g, '39.6837').replace(/\{\{LON\}\}/g, '-75.7497')
  return out
}

// ─── TAG COLOR MAP ────────────────────────────────────────────────────────────
const TAG_STYLES = {
  sdr:      { bg: 'rgba(0,188,212,.12)',   color: '#00bcd4' },
  homelab:  { bg: 'rgba(0,230,118,.1)',    color: '#00e676' },
  esp32:    { bg: 'rgba(255,152,0,.12)',   color: '#ff9800' },
  antenna:  { bg: 'rgba(180,0,255,.12)',   color: '#ce93d8' },
  proxmox:  { bg: 'rgba(244,67,54,.12)',   color: '#f44336' },
  print3d:  { bg: 'rgba(255,235,59,.12)', color: '#fff176' },
}
function TagPill({ tag, size = 'sm' }) {
  const s = TAG_STYLES[tag.toLowerCase()] || { bg: 'rgba(107,117,110,.2)', color: '#6b756e' }
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: size === 'xs' ? '9px' : '10px',
      letterSpacing: '1px', padding: size === 'xs' ? '2px 5px' : '3px 7px',
      textTransform: 'uppercase',
    }}>{tag}</span>
  )
}

// ─── DEVICE TYPE EXTRA FIELDS ─────────────────────────────────────────────────
const DEV_EXTRA_FIELDS = {
  proxmox: [{ key: 'port', label: 'Web UI Port', ph: '8006' }, { key: 'apitoken', label: 'API Token', ph: 'PVEAPIToken=...', secret: true }],
  vm:      [{ key: 'sshport', label: 'SSH Port', ph: '22' }, { key: 'pw', label: 'sudo Password', ph: '', secret: true }],
  esp32:   [{ key: 'ssid', label: 'WiFi SSID', ph: 'Audi_66' }, { key: 'wifipw', label: 'WiFi Password', ph: '', secret: true }, { key: 'board', label: 'Board Model', ph: 'ESP32-8048S050' }, { key: 'comport', label: 'COM Port', ph: 'COM3' }],
  pi:      [{ key: 'ssid', label: 'WiFi SSID', ph: 'Audi_66' }, { key: 'wifipw', label: 'WiFi Password', ph: '', secret: true }, { key: 'sshport', label: 'SSH Port', ph: '22' }],
  other:   [{ key: 'notes', label: 'Notes / Details', ph: 'Any useful info...' }],
}
const DEV_TYPE_COLOR = { proxmox: '#f44336', vm: '#00e676', esp32: '#ff9800', pi: '#00bcd4', other: '#6b756e' }

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [projects, setProjects]     = useState([])
  const [devices, setDevices]       = useState([])
  const [activeId, setActiveId]     = useState(null)
  const [activeTag, setActiveTag]   = useState(null)
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null) // 'new-project' | 'vault'
  const [openPhases, setOpenPhases] = useState({})
  const [copied, setCopied]         = useState(null)

  // Vault form state
  const [devType, setDevType]   = useState('proxmox')
  const [devForm, setDevForm]   = useState({ name:'', ip:'', host:'', username:'' })
  const [devExtras, setDevExtras] = useState({})
  const [editDevId, setEditDevId] = useState(null)
  const [showPw, setShowPw]     = useState({})

  // New project form state
  const [newProj, setNewProj] = useState({ title:'', desc:'', tags:'', difficulty:'Intermediate', time:'' })
  const [newPhases, setNewPhases] = useState([{ name:'', steps:[''] }])

  // ── LOAD DATA ──────────────────────────────────────────────
  const loadProjects = useCallback(async () => {
    const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (!projs) return
    const { data: phases } = await supabase.from('phases').select('*').order('position')
    const { data: steps } = await supabase.from('steps').select('*').order('position')
    const enriched = (projs || []).map(p => ({
      ...p,
      phases: (phases || []).filter(ph => ph.project_id === p.id).map(ph => ({
        ...ph,
        steps: (steps || []).filter(s => s.phase_id === ph.id)
      }))
    }))
    setProjects(enriched)
    if (!activeId && enriched.length) setActiveId(enriched[0].id)
    setLoading(false)
  }, [activeId])

  const loadDevices = useCallback(async () => {
    const { data } = await supabase.from('devices').select('*').order('created_at')
    if (data) setDevices(data)
  }, [])

  useEffect(() => { loadProjects(); loadDevices() }, [])

  // ── TOGGLE PHASE DONE ──────────────────────────────────────
  async function togglePhaseDone(phaseId, current) {
    await supabase.from('phases').update({ done: !current }).eq('id', phaseId)
    setProjects(prev => prev.map(p => ({
      ...p,
      phases: p.phases.map(ph => ph.id === phaseId ? { ...ph, done: !current } : ph)
    })))
  }

  // ── SAVE DEVICE ────────────────────────────────────────────
  async function saveDevice() {
    if (!devForm.name) return
    const record = { type: devType, name: devForm.name, ip: devForm.ip, host: devForm.host, username: devForm.username, extras: devExtras }
    if (editDevId) {
      await supabase.from('devices').update(record).eq('id', editDevId)
    } else {
      await supabase.from('devices').insert(record)
    }
    setDevForm({ name:'', ip:'', host:'', username:'' }); setDevExtras({}); setEditDevId(null)
    loadDevices()
  }

  async function deleteDevice(id) {
    await supabase.from('devices').delete().eq('id', id)
    setDevices(prev => prev.filter(d => d.id !== id))
  }

  function editDevice(d) {
    setEditDevId(d.id); setDevType(d.type)
    setDevForm({ name: d.name, ip: d.ip, host: d.host, username: d.username })
    setDevExtras(d.extras || {})
  }

  // ── SAVE NEW PROJECT ───────────────────────────────────────
  async function saveProject() {
    if (!newProj.title) return
    const { data: proj } = await supabase.from('projects').insert({
      title: newProj.title, description: newProj.desc,
      tags: newProj.tags.split(',').map(t => t.trim()).filter(Boolean),
      difficulty: newProj.difficulty, time_est: newProj.time || 'TBD'
    }).select().single()
    for (let i = 0; i < newPhases.length; i++) {
      const ph = newPhases[i]
      if (!ph.name) continue
      const { data: phase } = await supabase.from('phases').insert({ project_id: proj.id, name: ph.name, position: i }).select().single()
      for (let j = 0; j < ph.steps.length; j++) {
        const t = ph.steps[j]?.trim()
        if (t) await supabase.from('steps').insert({ phase_id: phase.id, text: t, position: j })
      }
    }
    setModal(null); setNewProj({ title:'', desc:'', tags:'', difficulty:'Intermediate', time:'' }); setNewPhases([{ name:'', steps:[''] }])
    await loadProjects(); setActiveId(proj.id)
  }

  // ── COPY CODE ──────────────────────────────────────────────
  function copyCode(id, code) {
    navigator.clipboard.writeText(substituteVars(code, devices))
    setCopied(id); setTimeout(() => setCopied(null), 2000)
  }

  // ── TROUBLESHOOT URL ───────────────────────────────────────
  function troubleshootUrl(projTitle, phaseName) {
    const devCtx = devices.length
      ? '\n\nMy devices:\n' + devices.map(d => `- ${d.name} (${d.type}): ${d.ip || (d.extras?.ssid) || 'no IP'}, user: ${d.username || '—'}`).join('\n')
      : ''
    const prompt = `I am following my Field Guide for project "${projTitle}", phase: "${phaseName}". I ran into an issue.\n${devCtx}\n\nHere is what happened: `
    return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
  }

  // ── FILTERED PROJECTS ──────────────────────────────────────
  const allTags = [...new Set(projects.flatMap(p => p.tags || []))]
  const filtered = projects.filter(p => {
    const ms = !search || p.title.toLowerCase().includes(search) || (p.description || '').toLowerCase().includes(search)
    const mt = !activeTag || (p.tags || []).includes(activeTag)
    return ms && mt
  })
  const activeProject = projects.find(p => p.id === activeId)

  // ── STYLES ─────────────────────────────────────────────────
  const S = {
    wrap:     { display:'flex', height:'100vh', flexDirection:'column' },
    header:   { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 22px', borderBottom:'1px solid var(--border)', background:'var(--surface)', flexShrink:0 },
    logo:     { fontFamily:"'Share Tech Mono',monospace", fontSize:'17px', color:'var(--accent)', letterSpacing:'3px' },
    body:     { display:'flex', flex:1, overflow:'hidden' },
    aside:    { width:'260px', minWidth:'260px', background:'var(--surface)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', overflow:'hidden' },
    main:     { flex:1, overflowY:'auto', padding:'24px 30px', background:'var(--bg)' },
    btn:      { fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', padding:'7px 14px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)', cursor:'pointer' },
    btnPri:   { fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', padding:'7px 14px', background:'var(--accent)', color:'#000', border:'1px solid var(--accent)', cursor:'pointer', fontWeight:700 },
    btnCyan:  { fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', padding:'7px 14px', border:'1px solid rgba(0,188,212,.5)', color:'var(--accent2)', background:'transparent', cursor:'pointer' },
    input:    { width:'100%', background:'var(--panel)', border:'1px solid var(--border)', color:'var(--text)', fontFamily:'Barlow, sans-serif', fontSize:'13px', padding:'7px 10px', outline:'none' },
    label:    { fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:'5px' },
    overlay:  { position:'fixed', inset:0, background:'rgba(0,0,0,.88)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' },
    modal:    { background:'var(--surface)', border:'1px solid var(--border)', width:'720px', maxWidth:'95vw', maxHeight:'92vh', overflowY:'auto', padding:'24px' },
  }

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div style={S.wrap}>

      {/* HEADER */}
      <header style={S.header}>
        <span style={S.logo}>FIELD<span style={{color:'var(--muted)'}}>//</span>GUIDE <span style={{fontSize:'10px',opacity:.5}}>JAudi Lab</span></span>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:'var(--accent)',boxShadow:'0 0 8px var(--accent)',animation:'pulse 2s infinite'}}/>
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',color:'var(--muted)',letterSpacing:'1px'}}>{projects.length} PROJECTS</span>
          <button style={S.btnCyan} onClick={() => setModal('vault')}>⬡ DEVICE VAULT</button>
          <button style={S.btnPri} onClick={() => setModal('new-project')}>+ NEW GUIDE</button>
        </div>
      </header>

      <div style={S.body}>

        {/* SIDEBAR */}
        <aside style={S.aside}>
          <div style={{padding:'12px 14px 9px',borderBottom:'1px solid var(--border)'}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'10px',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase',color:'var(--muted)'}}>Projects</span>
          </div>
          <div style={{padding:'7px 11px',borderBottom:'1px solid var(--border)'}}>
            <input style={S.input} placeholder="search guides..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          {allTags.length > 0 && (
            <div style={{padding:'6px 11px',borderBottom:'1px solid var(--border)',display:'flex',flexWrap:'wrap',gap:'4px'}}>
              {allTags.map(t => (
                <button key={t} onClick={() => setActiveTag(activeTag === t ? null : t)}
                  style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',letterSpacing:'1px',padding:'2px 6px',border:`1px solid ${activeTag===t?'var(--accent2)':'var(--border)'}`,cursor:'pointer',textTransform:'uppercase',color:activeTag===t?'var(--accent2)':'var(--muted)',background:activeTag===t?'rgba(0,188,212,.08)':'transparent'}}>
                  {t}
                </button>
              ))}
            </div>
          )}
          <div style={{overflowY:'auto',flex:1}}>
            {loading ? (
              <div style={{padding:'20px',textAlign:'center',fontFamily:"'Share Tech Mono',monospace",fontSize:'11px',color:'var(--muted)'}}>LOADING...</div>
            ) : filtered.map(p => {
              const tot = p.phases.length, don = p.phases.filter(x => x.done).length
              const pct = tot ? Math.round(don/tot*100) : 0
              return (
                <div key={p.id} onClick={() => setActiveId(p.id)}
                  style={{padding:'11px 14px',cursor:'pointer',borderLeft:`3px solid ${activeId===p.id?'var(--accent)':'transparent'}`,background:activeId===p.id?'var(--panel)':'transparent',borderBottom:'1px solid rgba(42,46,44,.4)'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'14px',fontWeight:600,marginBottom:'3px',color:activeId===p.id?'var(--accent)':'var(--text)'}}>{p.title}</div>
                  <div style={{display:'flex',gap:'4px',flexWrap:'wrap',marginBottom:'4px'}}>
                    {(p.tags||[]).slice(0,2).map(t => <TagPill key={t} tag={t} size="xs"/>)}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <div style={{flex:1,height:'2px',background:'var(--border)'}}>
                      <div style={{height:'100%',width:`${pct}%`,background:'var(--accent)',transition:'width .3s'}}/>
                    </div>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'var(--muted)'}}>{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div onClick={() => setModal('vault')} style={{margin:'10px',padding:'8px',background:'var(--panel)',border:'1px solid var(--border)',color:'var(--accent2)',fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',textAlign:'center'}}>
            ⬡ DEVICES &amp; CREDENTIALS
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={S.main}>
          {!activeProject ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:'14px',color:'var(--muted)'}}>
              <div style={{fontSize:'44px',opacity:.3,fontFamily:"'Share Tech Mono',monospace"}}>[_]</div>
              <p style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'11px',letterSpacing:'2px'}}>SELECT A PROJECT OR CREATE ONE</p>
            </div>
          ) : (() => {
            const p = activeProject
            const tot = p.phases.length, don = p.phases.filter(x => x.done).length
            const pct = tot ? Math.round(don/tot*100) : 0
            const next = p.phases.find(x => !x.done)
            return (
              <>
                {/* Project header */}
                <div style={{marginBottom:'22px',paddingBottom:'16px',borderBottom:'1px solid var(--border)'}}>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',letterSpacing:'3px',color:'var(--muted)',textTransform:'uppercase',marginBottom:'6px'}}>{p.difficulty} · Est. {p.time_est}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'32px',fontWeight:900,letterSpacing:'1px',lineHeight:1,marginBottom:'9px',textTransform:'uppercase'}}>{p.title}</div>
                  <div style={{display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'9px'}}>{(p.tags||[]).map(t=><TagPill key={t} tag={t}/>)}</div>
                  <div style={{color:'var(--muted)',fontSize:'13px',lineHeight:1.6,maxWidth:'680px',marginBottom:'11px'}}>{p.description}</div>
                  <div style={{display:'flex',gap:'22px'}}>
                    {[['Phases',tot],['Done',`${don}/${tot}`],['Progress',`${pct}%`]].map(([l,v])=>(
                      <div key={l}><div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',letterSpacing:'2px',color:'var(--muted)',textTransform:'uppercase'}}>{l}</div><div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'15px',color:'var(--accent)'}}>{v}</div></div>
                    ))}
                  </div>
                </div>

                {/* Next up banner */}
                {next ? (
                  <div style={{background:'rgba(0,188,212,.06)',border:'1px solid rgba(0,188,212,.25)',padding:'11px 14px',marginBottom:'16px',display:'flex',alignItems:'center',gap:'12px'}}>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',letterSpacing:'3px',color:'var(--accent2)',textTransform:'uppercase',whiteSpace:'nowrap'}}>▶ NEXT UP</span>
                    <span style={{fontSize:'13px'}}>{next.name}</span>
                  </div>
                ) : (
                  <div style={{background:'rgba(0,230,118,.06)',border:'1px solid rgba(0,230,118,.4)',padding:'11px 14px',marginBottom:'16px',display:'flex',alignItems:'center',gap:'12px'}}>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',letterSpacing:'3px',color:'var(--accent)',textTransform:'uppercase',whiteSpace:'nowrap'}}>✓ COMPLETE</span>
                    <span style={{fontSize:'13px'}}>All phases finished!</span>
                  </div>
                )}

                {/* Progress bar */}
                <div style={{height:3,background:'var(--border)',marginBottom:'20px',position:'relative'}}>
                  <div style={{position:'absolute',right:0,top:'-16px',fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',color:'var(--muted)'}}>{pct}% COMPLETE</div>
                  <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,var(--accent2),var(--accent))',transition:'width .4s'}}/>
                </div>

                {/* Phases */}
                <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                  {p.phases.map((ph, i) => {
                    const isOpen = openPhases[ph.id]
                    const illu = ph.illustration && ILLUSTRATIONS[ph.illustration]
                    return (
                      <div key={ph.id} style={{border:`1px solid ${ph.done?'rgba(0,230,118,.25)':'var(--border)'}`,background:ph.done?'var(--done)':'var(--surface)',overflow:'hidden'}}>
                        <div onClick={() => setOpenPhases(prev => ({...prev,[ph.id]:!prev[ph.id]}))}
                          style={{display:'flex',alignItems:'center',gap:'11px',padding:'12px 15px',cursor:'pointer',userSelect:'none'}}>
                          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'11px',color:ph.done?'var(--accent)':'var(--muted)',minWidth:'28px'}}>P{String(i+1).padStart(2,'0')}</span>
                          <div onClick={e=>{e.stopPropagation();togglePhaseDone(ph.id,ph.done)}}
                            style={{width:18,height:18,border:`1px solid ${ph.done?'var(--accent)':'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',cursor:'pointer',flexShrink:0,background:ph.done?'var(--accent)':'transparent',color:ph.done?'#000':'transparent'}}>
                            ✓
                          </div>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'16px',fontWeight:600,letterSpacing:'.5px',flex:1,color:ph.done?'var(--accent)':'var(--text)',textDecoration:ph.done?'line-through':'none'}}>{ph.name}</span>
                          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'11px',color:'var(--muted)',transform:isOpen?'rotate(90deg)':'none',transition:'transform .2s'}}>▶</span>
                        </div>

                        {isOpen && (
                          <div style={{padding:'0 15px 16px 58px',borderTop:'1px solid var(--border)'}}>
                            {illu && (
                              <div style={{margin:'12px 0',background:'var(--panel)',border:'1px solid var(--border)',padding:'14px',display:'flex',flexDirection:'column',alignItems:'center',gap:'7px'}}>
                                {illu}
                                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',letterSpacing:'2px',color:'var(--muted)',textTransform:'uppercase'}}>{ph.name}</span>
                              </div>
                            )}
                            <div style={{marginTop:'11px',display:'flex',flexDirection:'column',gap:'9px'}}>
                              {ph.steps.map(s => {
                                const subCode = s.code ? substituteVars(s.code, devices) : ''
                                return (
                                  <div key={s.id} style={{display:'flex',gap:'11px',alignItems:'flex-start'}}>
                                    <div style={{width:5,height:5,border:'1px solid var(--muted)',borderRadius:'50%',marginTop:8,flexShrink:0}}/>
                                    <div style={{flex:1}}>
                                      <div style={{fontSize:'13px',lineHeight:1.65,color:'#b8c0b9'}} dangerouslySetInnerHTML={{__html:s.text}}/>
                                      {s.note && <div style={{marginTop:5,padding:'6px 10px',background:'rgba(255,152,0,.07)',borderLeft:'2px solid var(--warn)',fontSize:'11px',color:'#b8a080',fontFamily:"'Share Tech Mono',monospace"}}>⚠ {s.note}</div>}
                                      {s.code && (
                                        <div style={{position:'relative',marginTop:7}}>
                                          <pre style={{background:'#080a09',border:'1px solid var(--border)',padding:'9px 70px 9px 13px',fontFamily:"'Share Tech Mono',monospace",fontSize:'12px',color:'var(--accent2)',whiteSpace:'pre',overflowX:'auto',lineHeight:1.7}}>{subCode}</pre>
                                          {s.code_type && <span style={{position:'absolute',bottom:6,left:8,fontFamily:"'Share Tech Mono',monospace",fontSize:'8px',letterSpacing:'1px',padding:'1px 5px',background:'rgba(0,0,0,.5)',color:'var(--muted)',textTransform:'uppercase'}}>{s.code_type}</span>}
                                          <button onClick={() => copyCode(s.id, s.code)}
                                            style={{position:'absolute',top:5,right:5,fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',letterSpacing:'1px',padding:'3px 9px',border:`1px solid ${copied===s.id?'var(--accent)':'var(--border)'}`,background:'var(--panel)',color:copied===s.id?'var(--accent)':'var(--muted)',cursor:'pointer',textTransform:'uppercase'}}>
                                            {copied === s.id ? 'COPIED!' : 'COPY'}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            <a href={troubleshootUrl(p.title, ph.name)} target="_blank" rel="noreferrer"
                              style={{display:'inline-flex',alignItems:'center',gap:'7px',marginTop:'10px',fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',letterSpacing:'1px',padding:'7px 14px',border:'1px solid rgba(206,147,216,.3)',background:'rgba(206,147,216,.05)',color:'var(--purple)',cursor:'pointer',textTransform:'uppercase',textDecoration:'none'}}>
                              🔮 TROUBLESHOOT THIS PHASE WITH CLAUDE
                            </a>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )
          })()}
        </main>
      </div>

      {/* ── DEVICE VAULT MODAL ── */}
      {modal === 'vault' && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{...S.modal,width:'800px'}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'21px',fontWeight:900,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px',color:'var(--accent)',borderBottom:'1px solid var(--border)',paddingBottom:'11px'}}>⬡ DEVICE VAULT</div>
            <p style={{fontSize:'12px',color:'var(--muted)',marginBottom:'14px',fontFamily:"'Share Tech Mono',monospace",letterSpacing:'.5px',lineHeight:1.6}}>Store device credentials here. They auto-fill into guide commands and are included as context in Claude troubleshooting sessions. Stored in your Supabase database — accessible from any device.</p>

            {/* Device cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'9px',marginBottom:'16px'}}>
              {devices.map(d => (
                <div key={d.id} onClick={() => editDevice(d)} style={{background:'var(--panel)',border:'1px solid var(--border)',padding:'12px',cursor:'pointer',position:'relative'}}>
                  <span onClick={e=>{e.stopPropagation();deleteDevice(d.id)}} style={{position:'absolute',top:6,right:6,fontSize:'10px',cursor:'pointer',color:'var(--muted)',padding:'2px 5px'}}>✕</span>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'3px',color:DEV_TYPE_COLOR[d.type]||'var(--muted)'}}>{d.type}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'15px',fontWeight:700,marginBottom:'4px'}}>{d.name}</div>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'11px',color:'var(--accent2)'}}>{d.ip || (d.extras?.ssid) || '—'}</div>
                </div>
              ))}
              {!devices.length && <div style={{gridColumn:'1/-1',fontFamily:"'Share Tech Mono',monospace",fontSize:'11px',color:'var(--muted)',padding:'8px 0'}}>No devices yet — add one below.</div>}
            </div>

            {/* Add/edit form */}
            <div style={{background:'var(--panel)',border:'1px solid var(--border)',padding:'15px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'13px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)',marginBottom:'11px'}}>{editDevId ? '✏ Edit Device' : '+ Add Device'}</div>
              <div style={{display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'12px'}}>
                {['proxmox','vm','esp32','pi','other'].map(t => (
                  <button key={t} onClick={() => { setDevType(t); setDevExtras({}) }}
                    style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',letterSpacing:'1px',padding:'5px 11px',border:`1px solid ${devType===t?'var(--accent2)':'var(--border)'}`,background:devType===t?'rgba(0,188,212,.08)':'transparent',color:devType===t?'var(--accent2)':'var(--muted)',cursor:'pointer',textTransform:'uppercase'}}>
                    {t}
                  </button>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
                {[['name','Device Name / Label','e.g. Sat Receiver VM'],['ip','IP Address','192.168.x.x'],['host','Hostname','proxmox.local'],['username','Username','root / jon']].map(([k,l,ph]) => (
                  <div key={k}>
                    <label style={S.label}>{l}</label>
                    <input style={S.input} placeholder={ph} value={devForm[k]||''} onChange={e => setDevForm(p => ({...p,[k]:e.target.value}))}/>
                  </div>
                ))}
              </div>
              {(DEV_EXTRA_FIELDS[devType]||[]).map(f => (
                <div key={f.key} style={{marginBottom:'9px'}}>
                  <label style={S.label}>{f.label}</label>
                  <div style={{position:'relative'}}>
                    <input type={f.secret && !showPw[f.key] ? 'password' : 'text'} style={{...S.input,paddingRight: f.secret ? '36px' : '10px'}} placeholder={f.ph||''} value={devExtras[f.key]||''} onChange={e => setDevExtras(p => ({...p,[f.key]:e.target.value}))}/>
                    {f.secret && <button type="button" onClick={() => setShowPw(p=>({...p,[f.key]:!p[f.key]}))} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:'13px'}}>👁</button>}
                  </div>
                </div>
              ))}
              <div style={{display:'flex',gap:'8px',marginTop:'11px'}}>
                <button style={{...S.btnPri,flex:1}} onClick={saveDevice}>SAVE DEVICE</button>
                <button style={S.btn} onClick={() => {setDevForm({name:'',ip:'',host:'',username:''});setDevExtras({});setEditDevId(null)}}>CLEAR</button>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:'16px',paddingTop:'13px',borderTop:'1px solid var(--border)'}}>
              <button style={S.btn} onClick={() => setModal(null)}>DONE</button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW PROJECT MODAL ── */}
      {modal === 'new-project' && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={S.modal}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'21px',fontWeight:900,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px',color:'var(--accent)',borderBottom:'1px solid var(--border)',paddingBottom:'11px'}}>{'//'} NEW GUIDE</div>
            {[['title','Project Title','e.g. SDR Satellite Receiver Setup'],['desc','Description','What will you build or configure?']].map(([k,l,ph]) => (
              <div key={k} style={{marginBottom:'13px'}}>
                <label style={S.label}>{l}</label>
                {k === 'desc' ? <textarea style={{...S.input,minHeight:'65px',resize:'vertical'}} placeholder={ph} value={newProj[k]} onChange={e=>setNewProj(p=>({...p,[k]:e.target.value}))}/> : <input style={S.input} placeholder={ph} value={newProj[k]} onChange={e=>setNewProj(p=>({...p,[k]:e.target.value}))}/>}
              </div>
            ))}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'11px',marginBottom:'13px'}}>
              <div><label style={S.label}>Tags (comma separated)</label><input style={S.input} placeholder="sdr, proxmox, antenna" value={newProj.tags} onChange={e=>setNewProj(p=>({...p,tags:e.target.value}))}/></div>
              <div><label style={S.label}>Difficulty</label><select style={{...S.input,cursor:'pointer'}} value={newProj.difficulty} onChange={e=>setNewProj(p=>({...p,difficulty:e.target.value}))}>{['Beginner','Intermediate','Advanced'].map(d=><option key={d}>{d}</option>)}</select></div>
            </div>
            <div style={{marginBottom:'14px'}}><label style={S.label}>Estimated Time</label><input style={S.input} placeholder="e.g. 2-4 hours" value={newProj.time} onChange={e=>setNewProj(p=>({...p,time:e.target.value}))}/></div>
            <div style={{margin:'14px 0 7px',fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',letterSpacing:'2px',color:'var(--muted)'}}>PHASES / STEPS</div>
            {newPhases.map((ph, pi) => (
              <div key={pi} style={{background:'var(--panel)',border:'1px solid var(--border)',padding:'11px',marginBottom:'6px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'7px'}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'12px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'var(--muted)'}}>Phase {pi+1}</span>
                  {newPhases.length > 1 && <button style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',padding:'3px 7px',border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer'}} onClick={()=>setNewPhases(p=>p.filter((_,i)=>i!==pi))}>REMOVE</button>}
                </div>
                <input style={{...S.input,marginBottom:'6px'}} placeholder="Phase name" value={ph.name} onChange={e=>setNewPhases(p=>p.map((x,i)=>i===pi?{...x,name:e.target.value}:x))}/>
                {ph.steps.map((st, si) => (
                  <div key={si} style={{display:'flex',gap:'6px',marginBottom:'5px'}}>
                    <textarea style={{...S.input,flex:1,minHeight:'36px',resize:'none'}} placeholder="Step text..." value={st} onChange={e=>setNewPhases(p=>p.map((x,i)=>i===pi?{...x,steps:x.steps.map((s,j)=>j===si?e.target.value:s)}:x))}/>
                    <button style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',padding:'4px 8px',border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer'}} onClick={()=>setNewPhases(p=>p.map((x,i)=>i===pi?{...x,steps:x.steps.filter((_,j)=>j!==si)}:x))}>✕</button>
                  </div>
                ))}
                <button style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',padding:'4px 10px',border:'1px solid var(--accent)',background:'transparent',color:'var(--accent)',cursor:'pointer',marginTop:'4px'}} onClick={()=>setNewPhases(p=>p.map((x,i)=>i===pi?{...x,steps:[...x.steps,'']}:x))}>+ ADD STEP</button>
              </div>
            ))}
            <button style={{...S.btn,width:'100%',marginTop:'5px',padding:'8px'}} onClick={()=>setNewPhases(p=>[...p,{name:'',steps:['']}])}>+ ADD PHASE</button>
            <div style={{display:'flex',gap:'8px',justifyContent:'flex-end',marginTop:'16px',paddingTop:'13px',borderTop:'1px solid var(--border)'}}>
              <button style={S.btn} onClick={()=>setModal(null)}>CANCEL</button>
              <button style={S.btnPri} onClick={saveProject}>SAVE GUIDE</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        input, textarea, select, button { font-family: inherit; }
        select option { background: var(--panel); }
      `}</style>
    </div>
  )
}
