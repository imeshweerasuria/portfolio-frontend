import { useEffect, useState } from "react";
import { fetchAwards } from "../services/api";
import { AWARDS_FALLBACK } from "../data/awards";


export default function Awards() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetchAwards();
        if (!ok) return;
        setItems((res.data && res.data.length > 0) ? res.data : AWARDS_FALLBACK);

      } catch (e) {
        if (!ok) return;
        setErr("");
setItems(AWARDS_FALLBACK);

      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => { ok = false; };
  }, []);

  const styles = `
    .page { padding-top: 90px; max-width: 1100px; margin: 0 auto; padding-left: 18px; padding-right: 18px; color: #e2e8f0; }
    h2 { margin: 0; font-size: 1.8rem; background: linear-gradient(135deg,#f59e0b,#8b5cf6,#3b82f6); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .sub { margin-top: 10px; opacity: 0.8; line-height: 1.6; }
    .grid { margin-top: 16px; display: grid; grid-template-columns: repeat(12, 1fr); gap: 14px; }
    .card { grid-column: span 12; border-radius: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.10);
      background: linear-gradient(135deg, rgba(15,23,42,0.82), rgba(30,41,59,0.72));
      box-shadow: 0 10px 30px rgba(0,0,0,0.22);
    }
    .title { margin:0; font-size:1.1rem; color:#fff; }
    .meta { margin-top:6px; opacity:0.9; display:flex; gap:8px; flex-wrap:wrap; }
    .pill { font-size:0.75rem; padding:6px 10px; border-radius:999px;
      border:1px solid rgba(245,158,11,0.35); background: rgba(245,158,11,0.10); color:#fcd34d;
    }
    .desc { margin-top:12px; opacity:0.9; line-height:1.6; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <h2>Honours & Awards</h2>
        <div className="sub">
          Leadership, community impact, and personal milestones.
        </div>

        {loading && <p className="sub">Loading…</p>}
        {err && <p className="sub" style={{ color: "#fb7185" }}>{err}</p>}

        <div className="grid">
          {items.map((a, idx) => (
            <div className="card" key={`${a.title}-${idx}`}>
              <h3 className="title">{a.title}</h3>

              <div className="meta">
                {a.org && <span className="pill">{a.org}</span>}
                {a.nameTag && <span className="pill">{a.nameTag}</span>}
                {a.period && <span className="pill">{a.period}</span>}
              </div>

              {a.description && <div className="desc">{a.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
