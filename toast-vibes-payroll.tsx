import { useState, useEffect } from "react";

const STORAGE_KEY = "toast_vibes_v3";

const DEFAULT_PEOPLE = [
  { id: 1, name: "Sarah", role: "Agent", location: "Toast Kambove", baseSalary: 150, cycle: 15 },
  { id: 2, name: "Ado", role: "Agent", location: "Toast Kambove", baseSalary: 100, cycle: 15 },
  { id: 3, name: "Magalie", role: "Agent", location: "Toast Kambove", baseSalary: 100, cycle: 15 },
  { id: 4, name: "Blessing", role: "Agent", location: "Dépôt", baseSalary: 150, cycle: 15 },
  { id: 5, name: "Junior", role: "Agent", location: "Dépôt", baseSalary: 100, cycle: 15 },
  { id: 6, name: "Belange", role: "Agent", location: "Toast Malela", baseSalary: 100, cycle: 15 },
  { id: 7, name: "Prescillia", role: "Gestion réseaux sociaux", location: "—", baseSalary: 50, cycle: 15 },
  { id: 8, name: "Dan", role: "Agent", location: "Dépôt", baseSalary: 100, cycle: 15 },
  { id: 9, name: "Josh", role: "Agent", location: "Toast Lac Kipopo", baseSalary: 100, cycle: 15 },
  { id: 10, name: "Vany", role: "Agent", location: "Toast Malela", baseSalary: 150, cycle: 15 },
  { id: 11, name: "Chadrack", role: "Cuisine centrale", location: "Cuisine Centrale", baseSalary: 120, cycle: 15 },
  { id: 12, name: "Ruth Amisi", role: "Agent", location: "Toast Lac Kipopo", baseSalary: 150, cycle: 15 },
  { id: 13, name: "Fideline", role: "Agent", location: "Toast Lac Kipopo", baseSalary: 115, cycle: 15 },
  { id: 14, name: "Loyer Dépôt", role: "Loyer", location: "Dépôt", baseSalary: 70, cycle: 15, isFixed: true },
  { id: 15, name: "Ma Leki", role: "Agent", location: "Dépôt", baseSalary: 120, cycle: 2 },
  { id: 16, name: "Cedrick", role: "Agent", location: "Dépôt", baseSalary: 140, cycle: 2 },
  { id: 17, name: "Ruth Bwa", role: "Agent", location: "Toast Malela", baseSalary: 100, cycle: 2 },
  { id: 18, name: "Jesmiel", role: "Administration", location: "Administration", baseSalary: 140, cycle: 2 },
  { id: 19, name: "Marcella", role: "Agent", location: "Toast Malela", baseSalary: 120, cycle: 2 },
  { id: 20, name: "Chef Didier", role: "Chef cuisinier", location: "Cuisine Centrale", baseSalary: 200, cycle: 2 },
  { id: 21, name: "Chef Kefass", role: "Chef cuisinier", location: "Cuisine Centrale", baseSalary: 150, cycle: 2 },
  { id: 22, name: "Lucresse", role: "Administration", location: "Administration", baseSalary: 180, cycle: 2 },
  { id: 23, name: "Brave", role: "Cuisine", location: "Cuisine Centrale", baseSalary: 120, cycle: 2 },
  { id: 24, name: "William", role: "Agent", location: "Dépôt", baseSalary: 80, cycle: 2 },
  { id: 25, name: "Narcisse", role: "Agent", location: "Toast Malela", baseSalary: 100, cycle: 2 },
  { id: 26, name: "Victor", role: "Agent", location: "Toast Malela", baseSalary: 140, cycle: 2 },
  { id: 27, name: "Issac", role: "Agent", location: "Toast Kambove", baseSalary: 100, cycle: 2 },
  { id: 28, name: "Cabinet Jhonny", role: "Avocat", location: "—", baseSalary: 150, cycle: 2, isFixed: true },
  { id: 29, name: "Garde Lac Kipopo", role: "Gardien", location: "Toast Lac Kipopo", baseSalary: 200, cycle: 2, isFixed: true },
  { id: 30, name: "Loyer Kambove", role: "Loyer", location: "Toast Kambove", baseSalary: 200, cycle: 2, isFixed: true },
  { id: 31, name: "Loyer Lac Kipopo", role: "Loyer", location: "Toast Lac Kipopo", baseSalary: 200, cycle: 5, isFixed: true },
  { id: 32, name: "Loyer Malela", role: "Loyer", location: "Toast Malela", baseSalary: 500, cycle: 5, isFixed: true },
];

const DEFAULT_SITES = ["Toast Kambove", "Toast Malela", "Toast Lac Kipopo", "Dépôt", "Cuisine Centrale", "Administration", "—"];
const CYCLE_COLORS = { 15: "#f5c842", 2: "#4ecb71", 5: "#7eb8f5" };
const CYCLE_LABELS = { 15: "Paye du 15", 2: "Paye du 2", 5: "Paiements du 5" };

function loadState() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; }
  catch { return null; }
}

const EMPTY_PERSON = { name: "", role: "", location: "", baseSalary: "", cycle: 15, isFixed: false };

export default function App() {
  const saved = loadState();
  const [people, setPeople] = useState(saved?.people || DEFAULT_PEOPLE);
  const [sites, setSites] = useState(saved?.sites || DEFAULT_SITES);
  const [deductions, setDeductions] = useState(saved?.deductions || {});
  const [advances, setAdvances] = useState(saved?.advances || {});
  const [payHistory, setPayHistory] = useState(saved?.payHistory || []);
  const [view, setView] = useState("dashboard");
  const [activeCycle, setActiveCycle] = useState(15);
  const [deductionModal, setDeductionModal] = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [confirmPay, setConfirmPay] = useState(false);
  const [newDed, setNewDed] = useState({ amount: "", reason: "" });
  const [search, setSearch] = useState("");

  // Manage modal state
  const [manageModal, setManageModal] = useState(null); // null | 'add' | person object
  const [manageForm, setManageForm] = useState(EMPTY_PERSON);
  const [siteModal, setSiteModal] = useState(false);
  const [newSite, setNewSite] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ people, sites, deductions, advances, payHistory }));
  }, [people, sites, deductions, advances, payHistory]);

  const getPending = (id) => (deductions[id] || []).filter(d => !d.paid);
  const getAdvanceAmt = (p) => Math.floor(p.baseSalary * 0.5);
  const hasPendingAdv = (id) => advances[id]?.pending || false;

  const getNet = (p) => {
    const dedTotal = getPending(p.id).reduce((s, d) => s + d.amount, 0);
    const advAmt = hasPendingAdv(p.id) ? getAdvanceAmt(p) : 0;
    return Math.max(0, p.baseSalary - dedTotal - advAmt);
  };

  const cyclePeople = (c) => people.filter(p => p.cycle === c);
  const cycleTotal = (c) => cyclePeople(c).reduce((s, p) => s + getNet(p), 0);
  const cycleBase = (c) => cyclePeople(c).reduce((s, p) => s + p.baseSalary, 0);

  const addDeduction = (id) => {
    if (!newDed.amount || !newDed.reason) return;
    const d = { id: Date.now(), amount: Number(newDed.amount), reason: newDed.reason, date: new Date().toLocaleDateString("fr-FR"), paid: false };
    setDeductions(prev => ({ ...prev, [id]: [...(prev[id] || []), d] }));
    setNewDed({ amount: "", reason: "" });
    setDeductionModal(null);
  };

  const removeDeduction = (empId, dedId) => {
    setDeductions(prev => ({ ...prev, [empId]: (prev[empId] || []).filter(d => d.id !== dedId) }));
  };

  const toggleAdvance = (id, baseSalary) => {
    setAdvances(prev => ({ ...prev, [id]: { pending: !prev[id]?.pending, amount: Math.floor(baseSalary * 0.5) } }));
  };

  const processPay = (cycle) => {
    const cp = cyclePeople(cycle);
    const record = {
      id: Date.now(), cycle, label: CYCLE_LABELS[cycle],
      date: new Date().toLocaleDateString("fr-FR"),
      payments: cp.map(p => ({ name: p.name, location: p.location, base: p.baseSalary, net: getNet(p), deductions: getPending(p.id), advance: hasPendingAdv(p.id) ? getAdvanceAmt(p) : 0 })),
      total: cycleTotal(cycle),
    };
    setPayHistory(prev => [record, ...prev]);
    const nd = { ...deductions }; const na = { ...advances };
    cp.forEach(p => {
      if (nd[p.id]) nd[p.id] = nd[p.id].map(d => ({ ...d, paid: true }));
      if (na[p.id]?.pending) na[p.id] = { ...na[p.id], pending: false };
    });
    setDeductions(nd); setAdvances(na);
    setPayModal(null); setConfirmPay(false);
  };

  const openAdd = () => { setManageForm(EMPTY_PERSON); setManageModal("add"); };
  const openEdit = (p) => { setManageForm({ ...p }); setManageModal(p); };

  const savePerson = () => {
    if (!manageForm.name || !manageForm.baseSalary) return;
    const entry = { ...manageForm, baseSalary: Number(manageForm.baseSalary) };
    if (manageModal === "add") {
      setPeople(prev => [...prev, { ...entry, id: Date.now() }]);
    } else {
      setPeople(prev => prev.map(p => p.id === manageModal.id ? { ...p, ...entry } : p));
    }
    setManageModal(null);
  };

  const deletePerson = (id) => {
    setPeople(prev => prev.filter(p => p.id !== id));
    setDeductions(prev => { const n = { ...prev }; delete n[id]; return n; });
    setAdvances(prev => { const n = { ...prev }; delete n[id]; return n; });
    setDeleteConfirm(null); setManageModal(null);
  };

  const addSite = () => {
    if (!newSite.trim()) return;
    setSites(prev => [...prev, newSite.trim()]);
    setNewSite("");
  };

  const removeSite = (s) => setSites(prev => prev.filter(x => x !== s));

  const filtered = cyclePeople(activeCycle).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
  );

  const inp = (val, onChange, placeholder, type = "text") => (
    <input type={type} value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 6, padding: "8px 10px", color: "#f0ece4", fontSize: 13, boxSizing: "border-box" }} />
  );

  const totalAllBase = cycleBase(15) + cycleBase(2) + cycleBase(5);
  const totalAllNet = cycleTotal(15) + cycleTotal(2) + cycleTotal(5);

  const btn = (label, onClick, style = {}) => (
    <button onClick={onClick} style={{ border: "none", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600, ...style }}>{label}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#f0ece4", fontFamily: "'Inter', -apple-system, sans-serif", fontSize: 14 }}>

      {/* Header */}
      <div style={{ background: "#141414", borderBottom: "1px solid #222", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.08em", color: "#f5c842" }}>TOAST VIBES</span>
          <span style={{ fontSize: 10, color: "#555", letterSpacing: "0.15em" }}>PAYROLL</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["dashboard","Accueil"],["team","Équipe"],["manage","Gestion"],["history","Historique"]].map(([k,l]) => (
            <button key={k} onClick={() => setView(k)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: view === k ? "#f5c842" : "#222", color: view === k ? "#111" : "#888", fontSize: 11, fontWeight: 600 }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px", maxWidth: 860, margin: "0 auto" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#141414", border: "1px solid #222", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", marginBottom: 6 }}>TOTAL MENSUEL BRUT</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>${totalAllBase}</div>
              </div>
              <div style={{ background: "#141414", border: "1px solid #2a3d2a", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", marginBottom: 6 }}>À DÉCAISSER NET</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#4ecb71" }}>${totalAllNet}</div>
              </div>
            </div>
            {[15, 2, 5].map(cycle => {
              const cp = cyclePeople(cycle);
              const color = CYCLE_COLORS[cycle];
              return (
                <div key={cycle} style={{ background: "#141414", border: `1px solid ${color}25`, borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, color, letterSpacing: "0.12em", marginBottom: 4 }}>{CYCLE_LABELS[cycle].toUpperCase()}</div>
                      <div style={{ fontSize: 13, color: "#666" }}>{cp.length} lignes · Base ${cycleBase(cycle)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 20, color: cycleTotal(cycle) < cycleBase(cycle) ? "#ff6b6b" : color }}>${cycleTotal(cycle)}</div>
                      {cycle !== 5 && btn("Valider →", () => { setPayModal(cycle); setConfirmPay(false); }, { background: color, color: "#111" })}
                    </div>
                  </div>
                  {cp.map(p => {
                    const deds = getPending(p.id); const adv = hasPendingAdv(p.id); const net = getNet(p);
                    return (
                      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid #1e1e1e" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{p.name} {p.isFixed && <span style={{ fontSize: 9, background: "#222", color: "#666", borderRadius: 4, padding: "1px 5px", marginLeft: 4 }}>FIXE</span>}</div>
                          <div style={{ fontSize: 11, color: "#555" }}>{p.location}</div>
                          {deds.map(d => <div key={d.id} style={{ fontSize: 11, color: "#ff8c8c" }}>⚠ {d.reason} −${d.amount}</div>)}
                          {adv && <div style={{ fontSize: 11, color: "#f5c842" }}>↓ Avance −${getAdvanceAmt(p)}</div>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 600, color: (deds.length > 0 || adv) ? "#ff6b6b" : "#f0ece4" }}>${net}</div>
                            {(deds.length > 0 || adv) && <div style={{ fontSize: 10, color: "#555" }}>/${p.baseSalary}</div>}
                          </div>
                          {!p.isFixed && btn("−", () => setDeductionModal(p), { background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#666", padding: "4px 8px" })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        )}

        {/* TEAM */}
        {view === "team" && (
          <>
            <div style={{ marginBottom: 12 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ width: "100%", background: "#141414", border: "1px solid #222", borderRadius: 8, padding: "9px 14px", color: "#f0ece4", fontSize: 13, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {[15, 2, 5].map(c => btn(CYCLE_LABELS[c], () => setActiveCycle(c), { background: activeCycle === c ? CYCLE_COLORS[c] : "#222", color: activeCycle === c ? "#111" : "#888" }))}
            </div>
            {filtered.map(p => {
              const deds = deductions[p.id] || []; const adv = hasPendingAdv(p.id); const net = getNet(p);
              return (
                <div key={p.id} style={{ background: "#141414", border: getPending(p.id).length > 0 ? "1px solid #ff6b6b30" : "1px solid #1e1e1e", borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{p.role} · {p.location}</div>
                      <div style={{ fontSize: 12, color: CYCLE_COLORS[p.cycle], marginTop: 4 }}>Base ${p.baseSalary} · {CYCLE_LABELS[p.cycle]}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: net < p.baseSalary ? "#ff6b6b" : "#4ecb71" }}>${net}</div>
                        {net < p.baseSalary && <div style={{ fontSize: 10, color: "#555" }}>/{p.baseSalary}</div>}
                      </div>
                      {btn("✏", () => openEdit(p), { background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#888" })}
                    </div>
                  </div>
                  {deds.length > 0 && (
                    <div style={{ marginTop: 10, borderTop: "1px solid #1e1e1e", paddingTop: 8 }}>
                      {deds.map(d => (
                        <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3, opacity: d.paid ? 0.35 : 1 }}>
                          <span style={{ fontSize: 11, color: d.paid ? "#555" : "#ff8c8c" }}>{d.paid ? "✓" : "⚠"} {d.reason} <span style={{ color: "#444" }}>({d.date})</span></span>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: d.paid ? "#444" : "#ff6b6b" }}>−${d.amount}</span>
                            {!d.paid && <button onClick={() => removeDeduction(p.id, d.id)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 13 }}>×</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!p.isFixed && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {btn("+ Sanction", () => setDeductionModal(p), { background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#888" })}
                      {activeCycle !== 5 && btn(adv ? `✓ Avance −$${getAdvanceAmt(p)}` : `Avance 50% ($${getAdvanceAmt(p)})`, () => toggleAdvance(p.id, p.baseSalary), { background: adv ? "#2a1e00" : "#1e1e1e", border: adv ? "1px solid #f5c84250" : "1px solid #2a2a2a", color: adv ? "#f5c842" : "#888" })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* MANAGE */}
        {view === "manage" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em" }}>GESTION DES AGENTS & SITES</div>
              <div style={{ display: "flex", gap: 8 }}>
                {btn("+ Nouveau site", () => setSiteModal(true), { background: "#222", color: "#aaa" })}
                {btn("+ Nouvel agent", openAdd, { background: "#f5c842", color: "#111" })}
              </div>
            </div>

            {/* Sites */}
            <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", marginBottom: 10 }}>SITES ({sites.length})</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {sites.map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e1e1e", borderRadius: 6, padding: "5px 10px" }}>
                    <span style={{ fontSize: 12 }}>{s}</span>
                    {s !== "—" && <button onClick={() => removeSite(s)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 12, padding: 0 }}>×</button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Agent list by cycle */}
            {[15, 2, 5].map(cycle => (
              <div key={cycle} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: CYCLE_COLORS[cycle], letterSpacing: "0.12em", marginBottom: 10 }}>{CYCLE_LABELS[cycle].toUpperCase()} — {cyclePeople(cycle).length} lignes</div>
                {cyclePeople(cycle).map(p => (
                  <div key={p.id} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 8, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{p.name} {p.isFixed && <span style={{ fontSize: 9, background: "#222", color: "#666", borderRadius: 4, padding: "1px 5px", marginLeft: 4 }}>FIXE</span>}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{p.role} · {p.location} · ${p.baseSalary}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {btn("✏ Modifier", () => openEdit(p), { background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#aaa" })}
                      {btn("Supprimer", () => setDeleteConfirm(p), { background: "#1e1e1e", border: "1px solid #ff6b6b30", color: "#ff6b6b" })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* HISTORY */}
        {view === "history" && (
          <>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", marginBottom: 14 }}>HISTORIQUE DES PAIEMENTS</div>
            {payHistory.length === 0 && <div style={{ textAlign: "center", color: "#444", padding: "60px 0" }}>Aucun paiement effectué.</div>}
            {payHistory.map(record => (
              <div key={record.id} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: CYCLE_COLORS[record.cycle] }}>{record.label}</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Traité le {record.date}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#4ecb71" }}>${record.total}</div>
                </div>
                {record.payments.map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #1a1a1a" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{p.name}</div>
                      {p.deductions.map((d, j) => <div key={j} style={{ fontSize: 10, color: "#ff8c8c" }}>⚠ {d.reason} −${d.amount}</div>)}
                      {p.advance > 0 && <div style={{ fontSize: 10, color: "#f5c842" }}>↓ Avance −${p.advance}</div>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>${p.net}</div>
                      {p.net < p.base && <div style={{ fontSize: 10, color: "#555" }}>/{p.base}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add/Edit Person Modal */}
      {manageModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 12, padding: 24, width: 340, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>{manageModal === "add" ? "Nouvel agent / paiement" : `Modifier — ${manageModal.name}`}</div>

            {[
              { label: "Nom", key: "name", placeholder: "Nom complet" },
              { label: "Poste", key: "role", placeholder: "Ex: Cuisinier, Agent..." },
              { label: "Salaire / Montant ($)", key: "baseSalary", placeholder: "Ex: 150", type: "number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 5 }}>{f.label.toUpperCase()}</div>
                {inp(manageForm[f.key], v => setManageForm(p => ({ ...p, [f.key]: v })), f.placeholder, f.type)}
              </div>
            ))}

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 5 }}>SITE</div>
              <select value={manageForm.location} onChange={e => setManageForm(p => ({ ...p, location: e.target.value }))}
                style={{ width: "100%", background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 6, padding: "8px 10px", color: "#f0ece4", fontSize: 13 }}>
                {sites.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 5 }}>CYCLE DE PAYE</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[15, 2, 5].map(c => (
                  <button key={c} onClick={() => setManageForm(p => ({ ...p, cycle: c }))}
                    style={{ flex: 1, padding: "7px", borderRadius: 6, border: "none", cursor: "pointer", background: manageForm.cycle === c ? CYCLE_COLORS[c] : "#1e1e1e", color: manageForm.cycle === c ? "#111" : "#888", fontWeight: 600, fontSize: 12 }}>
                    {c === 15 ? "15" : c === 2 ? "2" : "5"}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" id="isFixed" checked={manageForm.isFixed || false} onChange={e => setManageForm(p => ({ ...p, isFixed: e.target.checked }))} />
              <label htmlFor="isFixed" style={{ fontSize: 12, color: "#888", cursor: "pointer" }}>Paiement fixe (loyer, avocat...)</label>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setManageModal(null)} style={{ flex: 1, background: "#1e1e1e", border: "none", color: "#888", borderRadius: 6, padding: "9px", cursor: "pointer", fontSize: 12 }}>Annuler</button>
              <button onClick={savePerson} style={{ flex: 1, background: "#f5c842", border: "none", color: "#111", borderRadius: 6, padding: "9px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                {manageModal === "add" ? "Ajouter" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
          <div style={{ background: "#141414", border: "1px solid #ff6b6b40", borderRadius: 12, padding: 24, width: 300 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Supprimer {deleteConfirm.name} ?</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Cette action est irréversible. L'historique des sanctions sera également supprimé.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: "#1e1e1e", border: "none", color: "#888", borderRadius: 6, padding: "9px", cursor: "pointer", fontSize: 12 }}>Annuler</button>
              <button onClick={() => deletePerson(deleteConfirm.id)} style={{ flex: 1, background: "#ff6b6b", border: "none", color: "#fff", borderRadius: 6, padding: "9px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Site Modal */}
      {siteModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 12, padding: 24, width: 320 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Nouveau site</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 5 }}>NOM DU SITE</div>
              {inp(newSite, setNewSite, "Ex: Toast Fungurume")}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setSiteModal(false); setNewSite(""); }} style={{ flex: 1, background: "#1e1e1e", border: "none", color: "#888", borderRadius: 6, padding: "9px", cursor: "pointer", fontSize: 12 }}>Annuler</button>
              <button onClick={() => { addSite(); setSiteModal(false); }} style={{ flex: 1, background: "#f5c842", border: "none", color: "#111", borderRadius: 6, padding: "9px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* Deduction Modal */}
      {deductionModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 12, padding: 24, width: 320 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Sanction</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>{deductionModal.name} · Base ${deductionModal.baseSalary}</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 5 }}>MOTIF</div>
              {inp(newDed.reason, v => setNewDed(p => ({ ...p, reason: v })), "Retard, comportement, casse...")}
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 5 }}>MONTANT ($)</div>
              {inp(newDed.amount, v => setNewDed(p => ({ ...p, amount: v })), "Ex: 20", "number")}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setDeductionModal(null); setNewDed({ amount: "", reason: "" }); }} style={{ flex: 1, background: "#1e1e1e", border: "none", color: "#888", borderRadius: 6, padding: "9px", cursor: "pointer", fontSize: 12 }}>Annuler</button>
              <button onClick={() => addDeduction(deductionModal.id)} style={{ flex: 1, background: "#ff6b6b", border: "none", color: "#fff", borderRadius: 6, padding: "9px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {payModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 12, padding: 24, width: 380, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: CYCLE_COLORS[payModal], marginBottom: 4 }}>{CYCLE_LABELS[payModal]}</div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>Récapitulatif avant validation</div>
            {cyclePeople(payModal).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #1e1e1e" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{p.name}</div>
                  {getPending(p.id).map(d => <div key={d.id} style={{ fontSize: 10, color: "#ff8c8c" }}>⚠ {d.reason} −${d.amount}</div>)}
                  {hasPendingAdv(p.id) && <div style={{ fontSize: 10, color: "#f5c842" }}>↓ Avance −${getAdvanceAmt(p)}</div>}
                </div>
                <div style={{ fontWeight: 600, color: getNet(p) < p.baseSalary ? "#ff6b6b" : "#f0ece4" }}>${getNet(p)}</div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #333", paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>TOTAL</span><span style={{ color: CYCLE_COLORS[payModal] }}>${cycleTotal(payModal)}</span>
            </div>
            {!confirmPay ? (
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => setPayModal(null)} style={{ flex: 1, background: "#1e1e1e", border: "none", color: "#888", borderRadius: 6, padding: "9px", cursor: "pointer", fontSize: 12 }}>Annuler</button>
                <button onClick={() => setConfirmPay(true)} style={{ flex: 1, background: CYCLE_COLORS[payModal], border: "none", color: "#111", borderRadius: 6, padding: "9px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Confirmer</button>
              </div>
            ) : (
              <div style={{ marginTop: 16 }}>
                <div style={{ background: "#1a1800", border: "1px solid #f5c84240", borderRadius: 8, padding: 10, fontSize: 12, color: "#f5c842", marginBottom: 12 }}>Les sanctions et avances seront archivées comme traitées.</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setConfirmPay(false)} style={{ flex: 1, background: "#1e1e1e", border: "none", color: "#888", borderRadius: 6, padding: "9px", cursor: "pointer", fontSize: 12 }}>Retour</button>
                  <button onClick={() => processPay(payModal)} style={{ flex: 1, background: "#4ecb71", border: "none", color: "#111", borderRadius: 6, padding: "9px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>✓ Valider & payer</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
