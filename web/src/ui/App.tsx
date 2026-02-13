import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Application, Status } from "../lib/types";

const STATUSES: { key: Status; label: string }[] = [
  { key: "APPLIED", label: "Applied" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "OFFER", label: "Offer" },
  { key: "REJECTED", label: "Rejected" },
];

function formatDate(s?: string | null) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("demo@jobhunt.dev");
  const [password, setPassword] = useState("Demo123!");
  const [apps, setApps] = useState<Application[]>([]);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    link: "",
    salaryRange: "",
    status: "APPLIED" as Status,
    nextActionAt: "",
    notes: "",
  });

  const [analytics, setAnalytics] = useState<any>(null);

  const grouped = useMemo(() => {
    const m: Record<string, Application[]> = {};
    for (const st of STATUSES) m[st.key] = [];
    for (const a of apps) m[a.status]?.push(a);
    return m;
  }, [apps]);

  async function load() {
    const res = await api.listApps();
    setApps(res.items);
    const a = await api.analytics();
    setAnalytics(a);
  }

  async function onLogin() {
    setError("");
    try {
      await api.login(email, password);
      setAuthed(true);
      await load();
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  }

  async function onLogout() {
    await api.logout();
    setAuthed(false);
    setApps([]);
    setAnalytics(null);
  }

  async function addApp() {
    setError("");
    try {
      const payload = {
        ...form,
        nextActionAt: form.nextActionAt ? new Date(form.nextActionAt).toISOString() : null,
      };
      await api.createApp(payload);
      setForm({ company:"", role:"", location:"", link:"", salaryRange:"", status:"APPLIED", nextActionAt:"", notes:"" });
      await load();
    } catch (e: any) {
      setError(e.message || "Failed");
    }
  }

  async function move(id: string, status: Status) {
    await api.updateApp(id, { status });
    await load();
  }

  async function remove(id: string) {
    await api.deleteApp(id);
    await load();
  }

  return (
    <div className="container" style={{ padding: "28px 0 60px" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div className="k">JobHunt CRM</div>
          <h1 className="h">Applicant Tracking + Analytics</h1>
          <div className="row">
            <span className="pill">MERN</span>
            <span className="pill">JWT Auth</span>
            <span className="pill">Kanban</span>
          </div>
        </div>
        <div className="row">
          {authed ? (
            <button className="btn" onClick={onLogout}>Logout</button>
          ) : (
            <a className="btn" href="https://github.com/yoannchelin" target="_blank" rel="noreferrer">GitHub</a>
          )}
        </div>
      </div>

      {!authed ? (
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="card">
            <h2 className="h">Login</h2>
            <p className="small">Use the seeded demo account (run <code>npm run seed</code> on the server).</p>
            <div className="grid">
              <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" />
              <input className="input" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="password" />
              <button className="btn primary" onClick={onLogin}>Sign in</button>
              {error && <div className="small" style={{ color: "#ff7aa2" }}>{error}</div>}
            </div>
          </div>

          <div className="card">
            <h2 className="h">What this demo shows</h2>
            <ul className="small" style={{ lineHeight: 1.8 }}>
              <li>Auth via httpOnly cookies (access + refresh)</li>
              <li>CRUD for applications + status pipeline</li>
              <li>Analytics summary endpoint</li>
              <li>Docker + CI to look “production-like”</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          {analytics && (
            <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 12 }}>
              <div className="card"><div className="small">Total</div><div style={{ fontWeight: 900, fontSize: 22 }}>{analytics.total}</div></div>
              <div className="card"><div className="small">Interview rate</div><div style={{ fontWeight: 900, fontSize: 22 }}>{Math.round(analytics.interviewRate*100)}%</div></div>
              <div className="card"><div className="small">Offer rate</div><div style={{ fontWeight: 900, fontSize: 22 }}>{Math.round(analytics.offerRate*100)}%</div></div>
              <div className="card"><div className="small">Applied</div><div style={{ fontWeight: 900, fontSize: 22 }}>{analytics.counts?.APPLIED || 0}</div></div>
            </div>
          )}

          <div className="grid" style={{ gridTemplateColumns: "1fr 1.1fr", alignItems:"start" }}>
            <div className="card">
              <h2 className="h">Add application</h2>
              <div className="grid">
                <input className="input" value={form.company} onChange={(e)=>setForm({...form, company:e.target.value})} placeholder="Company *" />
                <input className="input" value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})} placeholder="Role *" />
                <div className="row">
                  <input className="input" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} placeholder="Location" />
                  <select className="input" value={form.status} onChange={(e)=>setForm({...form, status:e.target.value as Status})}>
                    {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <input className="input" value={form.link} onChange={(e)=>setForm({...form, link:e.target.value})} placeholder="Job link" />
                <input className="input" value={form.salaryRange} onChange={(e)=>setForm({...form, salaryRange:e.target.value})} placeholder="Salary range" />
                <input className="input" value={form.nextActionAt} onChange={(e)=>setForm({...form, nextActionAt:e.target.value})} type="date" />
                <textarea className="input" style={{ minHeight: 88 }} value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} placeholder="Notes" />
                <button className="btn primary" onClick={addApp}>Add</button>
                {error && <div className="small" style={{ color: "#ff7aa2" }}>{error}</div>}
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {STATUSES.map(s => (
                <div key={s.key} className="card">
                  <div className="row" style={{ justifyContent:"space-between", alignItems:"center" }}>
                    <h3 style={{ margin: 0 }}>{s.label}</h3>
                    <span className="pill">{grouped[s.key]?.length || 0}</span>
                  </div>
                  <div className="grid" style={{ marginTop: 10 }}>
                    {(grouped[s.key] || []).map(a => (
                      <div key={a._id} className="card" style={{ padding: 12, background:"#0f1420" }}>
                        <div style={{ fontWeight: 900 }}>{a.company}</div>
                        <div className="small">{a.role}</div>
                        <div className="small">{a.location || ""}</div>
                        {a.nextActionAt && <div className="small">Next action: {formatDate(a.nextActionAt)}</div>}
                        <div className="row" style={{ marginTop: 8 }}>
                          <button className="btn" onClick={()=>move(a._id, "APPLIED")}>A</button>
                          <button className="btn" onClick={()=>move(a._id, "INTERVIEW")}>I</button>
                          <button className="btn" onClick={()=>move(a._id, "OFFER")}>O</button>
                          <button className="btn" onClick={()=>move(a._id, "REJECTED")}>R</button>
                          <button className="btn" onClick={()=>remove(a._id)} title="Delete">✕</button>
                        </div>
                      </div>
                    ))}
                    {(grouped[s.key] || []).length === 0 && <div className="small">No items.</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
