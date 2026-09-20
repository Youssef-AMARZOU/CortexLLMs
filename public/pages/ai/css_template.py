CSS = """*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0d0d0f;--card:#1a1a2e;--accent:#3b82f6;--accent-h:#2563eb;--accent-l:rgba(59,130,246,.15);--t1:#f0f0f5;--t2:#9ca3af;--t3:#6b7280;--bdr:#2a2a3e;--ok:#10b981;--warn:#f59e0b;--purple:#8b5cf6;--cyan:#06b6d4;--sans:'Inter',-apple-system,sans-serif;--serif:'Source Serif 4',Georgia,serif}
html{scroll-behavior:smooth}body{font-family:var(--sans);background:var(--bg);color:var(--t1);line-height:1.7;min-height:100vh}
a{color:var(--accent);text-decoration:none}a:hover{color:#60a5fa}
header{position:sticky;top:0;z-index:100;background:rgba(13,13,15,.88);backdrop-filter:blur(20px);border-bottom:1px solid var(--bdr)}
.hi{max-width:1280px;margin:0 auto;padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:1.35rem;font-weight:800;letter-spacing:-.5px}.logo .io{color:var(--accent)}
nav{display:flex;align-items:center;gap:.25rem}nav a{color:var(--t2);font-size:.88rem;font-weight:500;padding:.45rem .9rem;border-radius:8px;transition:all .2s}nav a:hover{color:var(--t1);background:rgba(255,255,255,.05)}
.bc{background:rgba(13,13,15,.6);border-bottom:1px solid var(--bdr)}.bci{max-width:1280px;margin:0 auto;padding:.65rem 2rem;display:flex;align-items:center;gap:.5rem;font-size:.82rem}.bci a{color:var(--t3)}.bci .sep{color:var(--t3);opacity:.5}.bci .cur{color:var(--t2)}
.ll{max-width:1280px;margin:0 auto;padding:2rem;display:grid;grid-template-columns:1fr 280px;gap:2.5rem;align-items:start}.lm{min-width:0}
.mt{display:flex;flex-wrap:wrap;align-items:center;gap:.65rem;margin-bottom:1.25rem}
.tag{display:inline-flex;align-items:center;font-size:.75rem;font-weight:600;padding:.28rem .65rem;border-radius:100px;text-transform:uppercase;letter-spacing:.3px}
.tag.c{background:var(--accent-l);color:var(--accent)}.tag.d{background:rgba(245,158,11,.12);color:var(--warn)}.tag.u{background:rgba(16,185,129,.12);color:var(--ok)}.tag.n{background:rgba(139,92,246,.12);color:var(--purple)}
.lm h1{font-family:var(--serif);font-size:2.3rem;font-weight:700;line-height:1.25;margin-bottom:.4rem}
.mod{font-size:.88rem;color:var(--t3);margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid var(--bdr)}.mod span{color:var(--t2);font-weight:500}
.lc{font-family:var(--serif);font-size:1.05rem;line-height:1.85}
.lc h2{font-family:var(--sans);font-size:1.5rem;font-weight:700;margin:2.8rem 0 1rem;padding-top:1rem}
.lc h3{font-family:var(--sans);font-size:1.15rem;font-weight:600;margin:2rem 0 .75rem}
.lc p{color:var(--t2);margin-bottom:1.25rem}
.lc ul,.lc ol{margin:1rem 0 1.5rem 1.5rem;color:var(--t2)}.lc li{margin-bottom:.5rem}
.lc strong{color:var(--t1);font-weight:600}.lc em{color:var(--cyan)}
.lc code{font-family:'JetBrains Mono','Consolas',monospace;background:rgba(255,255,255,.06);color:var(--cyan);padding:.15rem .4rem;border-radius:4px;font-size:.87em}
.cb{position:relative;margin:1.5rem 0;border-radius:10px;overflow:hidden;border:1px solid var(--bdr)}
.ch{display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.04);padding:.5rem 1rem;border-bottom:1px solid var(--bdr)}
.cl{font-family:var(--sans);font-size:.72rem;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px}
.cd{display:flex;gap:6px}.cd span{width:10px;height:10px;border-radius:50%}.cd span:nth-child(1){background:#ff5f57}.cd span:nth-child(2){background:#febc2e}.cd span:nth-child(3){background:#28c840}
pre{background:#0d1117;padding:1.25rem 1.5rem;overflow-x:auto;font-family:'JetBrains Mono','Consolas',monospace;font-size:.85rem;line-height:1.65;color:#c9d1d9}pre code{background:none;color:inherit;padding:0;font-size:inherit}
.co{margin:1.5rem 0;padding:1.25rem 1.5rem;border-radius:10px;border-left:4px solid}
.co.i{background:var(--accent-l);border-color:var(--accent)}.co.w{background:rgba(245,158,11,.12);border-color:var(--warn)}.co.t{background:rgba(16,185,129,.12);border-color:var(--ok)}.co.im{background:rgba(139,92,246,.12);border-color:var(--purple)}
.ct{font-family:var(--sans);font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:.5rem}
.co.i .ct{color:var(--accent)}.co.w .ct{color:var(--warn)}.co.t .ct{color:var(--ok)}.co.im .ct{color:var(--purple)}
.kt{margin:2.5rem 0;background:var(--card);border:1px solid var(--bdr);border-radius:10px;overflow:hidden}
.kth{background:var(--accent-l);padding:1rem 1.5rem;border-bottom:1px solid var(--bdr)}.kth h3{font-family:var(--sans);font-size:1rem;font-weight:700;color:var(--accent)}
.kt ul{list-style:none;padding:1.25rem 1.5rem;margin:0}.kt li{position:relative;padding-left:1.5rem;margin-bottom:.75rem;font-size:.95rem;color:var(--t2)}.kt li::before{content:'';position:absolute;left:0;top:.55rem;width:8px;height:8px;border-radius:50%;background:var(--ok)}
.qa{margin:2.5rem 0;background:var(--card);border:1px solid var(--bdr);border-radius:10px;overflow:hidden}
.qah{background:rgba(139,92,246,.12);padding:1rem 1.5rem;border-bottom:1px solid var(--bdr)}.qah h3{font-family:var(--sans);font-size:1rem;font-weight:700;color:var(--purple)}
.qa .qitem{padding:1.25rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.03)}.qa .qitem:last-child{border-bottom:none}
.qa .qq{font-family:var(--sans);font-size:1rem;font-weight:600;color:var(--t1);margin-bottom:.75rem}.qa .qa p{margin:0}
.qct{margin:2.5rem 0;background:linear-gradient(135deg,rgba(59,130,246,.1),rgba(139,92,246,.1));border:1px solid rgba(59,130,246,.25);border-radius:10px;padding:2rem;text-align:center}
.qct h3{font-family:var(--sans);font-size:1.2rem;font-weight:700;margin-bottom:.5rem}.qct p{color:var(--t2);font-size:.95rem;margin-bottom:1.25rem}
.qct .btn{display:inline-flex;align-items:center;gap:.5rem;background:var(--accent);color:#fff;font-family:var(--sans);font-size:.95rem;font-weight:600;padding:.7rem 1.8rem;border-radius:8px;border:none;cursor:pointer;transition:all .2s}.qct .btn:hover{background:var(--accent-h);transform:translateY(-1px)}
.ln{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:3rem 0 2rem;padding-top:2rem;border-top:1px solid var(--bdr)}
.nc{background:var(--card);border:1px solid var(--bdr);border-radius:10px;padding:1.25rem;transition:all .2s;text-decoration:none;color:inherit;display:block}.nc:hover{border-color:var(--accent);transform:translateY(-2px)}
.nc .nl{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--t3);margin-bottom:.4rem}.nc .nt{font-size:.95rem;font-weight:600;color:var(--t1);line-height:1.4}
.nc.next{text-align:right}.nc.empty{opacity:.3;pointer-events:none}
.sb{position:sticky;top:84px}.sbc{background:var(--card);border:1px solid var(--bdr);border-radius:10px;overflow:hidden;margin-bottom:1.25rem}
.sbch{padding:1rem 1.25rem;border-bottom:1px solid var(--bdr)}.sbch h3{font-size:.85rem;font-weight:700;text-transform:uppercase;letter-spacing:.3px}
.toc{list-style:none;padding:.75rem 1.25rem}.toc li{margin-bottom:.2rem}
.toc a{display:block;padding:.32rem .6rem;font-size:.82rem;color:var(--t3);border-radius:6px;border-left:2px solid transparent;transition:all .2s}.toc a:hover{color:var(--accent);background:var(--accent-l);border-left-color:var(--accent)}
.sb .btn{display:block;width:100%;text-align:center;background:var(--accent);color:#fff;font-family:var(--sans);font-size:.92rem;font-weight:600;padding:.8rem 1.5rem;border-radius:8px;border:none;cursor:pointer;transition:all .2s;margin-top:.5rem}.sb .btn:hover{background:var(--accent-h)}
footer{background:rgba(13,13,15,.6);border-top:1px solid var(--bdr);margin-top:3rem}
.fi{max-width:1280px;margin:0 auto;padding:2.5rem 2rem}
.ft{display:flex;justify-content:space-between;align-items:start;margin-bottom:2rem;padding-bottom:2rem;border-bottom:1px solid var(--bdr)}
.fb p{color:var(--t3);font-size:.88rem;max-width:320px;line-height:1.6}
.fl{display:flex;gap:3rem}.fc h4{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--t3);margin-bottom:1rem}.fc a{display:block;font-size:.88rem;color:var(--t2);margin-bottom:.5rem}.fc a:hover{color:var(--accent)}
.fbt{display:flex;justify-content:space-between;align-items:center;font-size:.8rem;color:var(--t3);padding-top:1.5rem;border-top:1px solid var(--bdr);margin-top:1.5rem}
@media(max-width:900px){.ll{grid-template-columns:1fr}.sb{position:static}.lm h1{font-size:1.8rem}.ln{grid-template-columns:1fr}}
@media(max-width:640px){.hi{padding:0 1rem}nav a{display:none}.ll{padding:1rem}.bci{padding:.65rem 1rem}.fi{padding:1.5rem 1rem}}
"""
