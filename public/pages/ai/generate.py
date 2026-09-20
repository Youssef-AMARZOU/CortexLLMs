#!/usr/bin/env python3
import os

OUT = os.path.dirname(os.path.abspath(__file__))

CSS = """,
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0d0d0f;--card:#1a1a2e;--card-hover:#222240;--accent:#3b82f6;--accent-h:#2563eb;--accent-l:rgba(59,130,246,.15);--accent-g:rgba(59,130,246,.3);--t1:#f0f0f5;--t2:#9ca3af;--t3:#6b7280;--bdr:#2a2a3e;--ok:#10b981;--warn:#f59e0b;--err:#ef4444;--purple:#8b5cf6;--cyan:#06b6d4;--sans:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;--serif:'Source Serif 4',Georgia,serif}
html{scroll-behavior:smooth}body{font-family:var(--sans);background:var(--bg);color:var(--t1);line-height:1.7;min-height:100vh;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none;transition:color .2s}a:hover{color:#60a5fa}
header{position:sticky;top:0;z-index:100;background:rgba(13,13,15,.88);backdrop-filter:blur(20px);border-bottom:1px solid var(--bdr)}
.header-inner{max-width:1280px;margin:0 auto;padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:1.35rem;font-weight:800;color:var(--t1);letter-spacing:-.5px}.logo .io{color:var(--accent)}
nav{display:flex;align-items:center;gap:.25rem}
nav a{color:var(--t2);font-size:.88rem;font-weight:500;padding:.45rem .9rem;border-radius:8px;transition:all .2s}
nav a:hover,nav a.active{color:var(--t1);background:rgba(255,255,255,.05)}
.breadcrumb-bar{background:rgba(13,13,15,.6);border-bottom:1px solid var(--bdr)}
.breadcrumb-inner{max-width:1280px;margin:0 auto;padding:.65rem 2rem;display:flex;align-items:center;gap:.5rem;font-size:.82rem}
.breadcrumb-inner a{color:var(--t3)}.breadcrumb-inner a:hover{color:var(--accent)}
.breadcrumb-inner .sep{color:var(--t3);opacity:.5}.breadcrumb-inner .current{color:var(--t2)}
.lesson-layout{max-width:1280px;margin:0 auto;padding:2rem;display:grid;grid-template-columns:1fr 280px;gap:2.5rem;align-items:start}
.lesson-main{min-width:0}
.lesson-meta{display:flex;flex-wrap:wrap;align-items:center;gap:.65rem;margin-bottom:1.25rem}
.meta-tag{display:inline-flex;align-items:center;gap:.3rem;font-size:.75rem;font-weight:600;padding:.28rem .65rem;border-radius:100px;text-transform:uppercase;letter-spacing:.3px}
.meta-tag.cat{background:var(--accent-l);color:var(--accent)}.meta-tag.diff{background:rgba(245,158,11,.12);color:var(--warn)}.meta-tag.dur{background:rgba(16,185,129,.12);color:var(--ok)}.meta-tag.num{background:rgba(139,92,246,.12);color:var(--purple)}
.lesson-main h1{font-family:var(--serif);font-size:2.3rem;font-weight:700;line-height:1.25;margin-bottom:.4rem}
.lesson-module{font-size:.88rem;color:var(--t3);margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid var(--bdr)}.lesson-module span{color:var(--t2);font-weight:500}
.lesson-content{font-family:var(--serif);font-size:1.05rem;line-height:1.85}
.lesson-content h2{font-family:var(--sans);font-size:1.5rem;font-weight:700;margin:2.8rem 0 1rem;padding-top:1rem}
.lesson-content h3{font-family:var(--sans);font-size:1.15rem;font-weight:600;margin:2rem 0 .75rem}
.lesson-content p{color:var(--t2);margin-bottom:1.25rem}
.lesson-content ul,.lesson-content ol{margin:1rem 0 1.5rem 1.5rem;color:var(--t2)}.lesson-content li{margin-bottom:.5rem}
.lesson-content strong{color:var(--t1);font-weight:600}.lesson-content em{color:var(--cyan)}
.lesson-content code{font-family:'JetBrains Mono','Fira Code','Consolas',monospace;background:rgba(255,255,255,.06);color:var(--cyan);padding:.15rem .4rem;border-radius:4px;font-size:.87em}
.code-block{position:relative;margin:1.5rem 0;border-radius:10px;overflow:hidden;border:1px solid var(--bdr)}
.code-header{display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.04);padding:.5rem 1rem;border-bottom:1px solid var(--bdr)}
.code-lang{font-family:var(--sans);font-size:.72rem;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px}
.code-dots{display:flex;gap:6px}.code-dots span{width:10px;height:10px;border-radius:50%}
.code-dots span:nth-child(1){background:#ff5f57}.code-dots span:nth-child(2){background:#febc2e}.code-dots span:nth-child(3){background:#28c840}
pre{background:#0d1117;padding:1.25rem 1.5rem;overflow-x:auto;font-family:'JetBrains Mono','Fira Code','Consolas',monospace;font-size:.85rem;line-height:1.65;color:#c9d1d9}
pre code{background:none;color:inherit;padding:0;font-size:inherit}
.callout{margin:1.5rem 0;padding:1.25rem 1.5rem;border-radius:10px;border-left:4px solid}
.callout.info{background:var(--accent-l);border-color:var(--accent)}.callout.warn{background:rgba(245,158,11,.12);border-color:var(--warn)}.callout.tip{background:rgba(16,185,129,.12);border-color:var(--ok)}.callout.important{background:rgba(139,92,246,.12);border-color:var(--purple)}
.callout-title{font-family:var(--sans);font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:.5rem}
.callout.info .callout-title{color:var(--accent)}.callout.warn .callout-title{color:var(--warn)}.callout.tip .callout-title{color:var(--ok)}.callout.important .callout-title{color:var(--purple)}
.callout p{margin:0;font-size:.93rem}
.key-takeaways{margin:2.5rem 0;background:var(--card);border:1px solid var(--bdr);border-radius:10px;overflow:hidden}
.key-takeaways-header{background:var(--accent-l);padding:1rem 1.5rem;border-bottom:1px solid var(--bdr)}
.key-takeaways-header h3{font-family:var(--sans);font-size:1rem;font-weight:700;color:var(--accent)}
.key-takeaways ul{list-style:none;padding:1.25rem 1.5rem;margin:0}
.key-takeaways li{position:relative;padding-left:1.5rem;margin-bottom:.75rem;font-size:.95rem;color:var(--t2)}
.key-takeaways li::before{content:'';position:absolute;left:0;top:.55rem;width:8px;height:8px;border-radius:50%;background:var(--ok)}
.quiz-cta{margin:2.5rem 0;background:linear-gradient(135deg,rgba(59,130,246,.1),rgba(139,92,246,.1));border:1px solid rgba(59,130,246,.25);border-radius:10px;padding:2rem;text-align:center}
.quiz-cta h3{font-family:var(--sans);font-size:1.2rem;font-weight:700;margin-bottom:.5rem}
.quiz-cta p{color:var(--t2);font-size:.95rem;margin-bottom:1.25rem}
.quiz-cta .btn-quiz{display:inline-flex;align-items:center;gap:.5rem;background:var(--accent);color:#fff;font-family:var(--sans);font-size:.95rem;font-weight:600;padding:.7rem 1.8rem;border-radius:8px;border:none;cursor:pointer;transition:all .2s}
.quiz-cta .btn-quiz:hover{background:var(--accent-h);transform:translateY(-1px)}
.lesson-nav{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:3rem 0 2rem;padding-top:2rem;border-top:1px solid var(--bdr)}
.nav-card{background:var(--card);border:1px solid var(--bdr);border-radius:10px;padding:1.25rem;transition:all .2s;text-decoration:none;color:inherit;display:block}
.nav-card:hover{border-color:var(--accent);transform:translateY(-2px)}
.nav-card-label{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--t3);margin-bottom:.4rem}
.nav-card-title{font-size:.95rem;font-weight:600;color:var(--t1);line-height:1.4}
.nav-card.next{text-align:right}.nav-card.empty{opacity:.3;pointer-events:none}
.sidebar{position:sticky;top:84px}
.sidebar-card{background:var(--card);border:1px solid var(--bdr);border-radius:10px;overflow:hidden;margin-bottom:1.25rem}
.sidebar-card-header{padding:1rem 1.25rem;border-bottom:1px solid var(--bdr)}
.sidebar-card-header h3{font-size:.85rem;font-weight:700;text-transform:uppercase;letter-spacing:.3px}
.toc-list{list-style:none;padding:.75rem 1.25rem}.toc-list li{margin-bottom:.2rem}
.toc-list a{display:block;padding:.32rem .6rem;font-size:.82rem;color:var(--t3);border-radius:6px;border-left:2px solid transparent;transition:all .2s}
.toc-list a:hover,.toc-list a.active{color:var(--accent);background:var(--accent-l);border-left-color:var(--accent)}
.sidebar .btn-quiz{display:block;width:100%;text-align:center;background:var(--accent);color:#fff;font-family:var(--sans);font-size:.92rem;font-weight:600;padding:.8rem 1.5rem;border-radius:8px;border:none;cursor:pointer;transition:all .2s;margin-top:.5rem}
.sidebar .btn-quiz:hover{background:var(--accent-h)}
footer{background:rgba(13,13,15,.6);border-top:1px solid var(--bdr);margin-top:3rem}
.footer-inner{max-width:1280px;margin:0 auto;padding:2.5rem 2rem}
.footer-top{display:flex;justify-content:space-between;align-items:start;margin-bottom:2rem;padding-bottom:2rem;border-bottom:1px solid var(--bdr)}
.footer-brand p{color:var(--t3);font-size:.88rem;max-width:320px;line-height:1.6}
.footer-links{display:flex;gap:3rem}
.footer-col h4{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--t3);margin-bottom:1rem}
.footer-col a{display:block;font-size:.88rem;color:var(--t2);margin-bottom:.5rem}.footer-col a:hover{color:var(--accent)}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;font-size:.8rem;color:var(--t3);padding-top:1.5rem;border-top:1px solid var(--bdr);margin-top:1.5rem}
@media(max-width:900px){.lesson-layout{grid-template-columns:1fr}.sidebar{position:static}.lesson-main h1{font-size:1.8rem}.lesson-nav{grid-template-columns:1fr}}
@media(max-width:640px){.header-inner{padding:0 1rem}nav a:not(.nav-cta){display:none}.lesson-layout{padding:1rem}.breadcrumb-inner{padding:.65rem 1rem}}
""".strip()

def code_block(lang, code):
    return f'<div class="code-block"><div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><span class="code-lang">{lang}</span></div><pre><code>{code}</code></pre></div>'

def callout(ctype, title, text):
    return f'<div class="callout {ctype}"><div class="callout-title">{title}</div><p>{text}</p></div>'

def header(title, prev_url, prev_title, next_url, next_title, toc_items, quiz_id):
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} - CortexLLMs.io</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
<header><div class="header-inner">
<a href="../../index.html" class="logo">Cortex<span class="io">LLMs.io</span></a>
<nav>
<a href="../../index.html">Accueil</a>
<a href="../ai-engineering.html" class="active">Ingenierie IA</a>
<a href="../devops.html">DevOps</a>
<a href="../system-design.html">System Design</a>
</nav>
</div></header>
<div class="breadcrumb-bar"><div class="breadcrumb-inner">
<a href="../../index.html">Accueil</a><span class="sep">/</span>
<a href="../ai-engineering.html">Ingenierie IA</a><span class="sep">/</span>
<span class="current">{title}</span>
</div></div>
<div class="lesson-layout">
<main class="lesson-main">"""

def sidebar(toc_items, quiz_id):
    toc = ""
    for item in toc_items:
        slug = item.lower().replace(" ", "-").replace("'", "").replace("(", "").replace(")", "")
        toc += f'<li><a href="#{slug}">{item}</a></li>\n'
    return f"""<aside class="sidebar">
<div class="sidebar-card"><div class="sidebar-card-header"><h3>Sommaire</h3></div>
<ul class="toc-list">{toc}</ul></div>
<div class="sidebar-card" style="padding:1.25rem"><button class="btn-quiz" onclick="window.location.href='../quiz.html?id={quiz_id}'">Commencer le Quiz</button></div>
</aside>"""

def footer():
    return """</div>
<footer><div class="footer-inner">
<div class="footer-top"><div class="footer-brand">
<div class="logo" style="font-size:1.2rem;font-weight:800">Cortex<span class="io" style="color:var(--accent)">LLMs.io</span></div>
<p>Plateforme de formation pour les entretiens techniques.</p>
</div><div class="footer-links">
<div class="footer-col"><h4>Formations</h4><a href="../ai-engineering.html">Machine Learning</a><a href="../devops.html">DevOps</a><a href="../system-design.html">System Design</a></div>
<div class="footer-col"><h4>Ressources</h4><a href="../quizzes.html">Quiz</a><a href="../blog.html">Blog</a></div>
</div></div>
<div class="footer-bottom"><span>&copy; 2026 CortexLLMs.io</span><span>Fait avec passion.</span></div>
</div></footer></body></html>"""

def nav(prev_url, prev_title, next_url, next_title):
    prev_html = f'<a href="{prev_url}" class="nav-card prev"><div class="nav-card-label">&larr; Precedente</div><div class="nav-card-title">{prev_title}</div></a>' if prev_url else '<div class="nav-card empty"><div class="nav-card-label">&larr; Precedente</div><div class="nav-card-title">Debut du module</div></div>'
    next_html = f'<a href="{next_url}" class="nav-card next"><div class="nav-card-label">Suivante &rarr;</div><div class="nav-card-title">{next_title}</div></a>' if next_url else '<div class="nav-card empty next"><div class="nav-card-label">Suivante &rarr;</div><div class="nav-card-title">Fin du module</div></div>'
    return f'<div class="lesson-nav">{prev_html}{next_html}</div>'

print("Helper module loaded OK")
