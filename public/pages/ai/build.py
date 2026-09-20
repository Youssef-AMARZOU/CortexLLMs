#!/usr/bin/env python3
"""Build all 3 ML lesson HTML pages for CortexLLMs.io"""
import os, html as h
D = os.path.dirname(os.path.abspath(__file__))

def cb(lang, code):
    """Code block"""
    return '<div class="cb"><div class="cbh"><div class="cbd"><span></span><span></span><span></span></div><span class="cbl">'+lang+'</span></div><pre><code>'+code+'</code></pre></div>'

def co(ctype, title, text):
    """Callout box"""
    return '<div class="co '+ctype+'"><div class="cot">'+title+'</div><p>'+text+'</p></div>'

def qa_block(items):
    """Interview Q&A block"""
    s = '<div class="qa"><div class="qah"><h3>Questions d\'entretien</h3></div>'
    for q, a in items:
        s += '<div class="qai"><div class="qq">'+q+'</div><p>'+a+'</p></div>'
    s += '</div>'
    return s

# ============================================================
# SHARED CSS + HEADER + FOOTER TEMPLATES
# ============================================================

CSS = ""
with open(os.path.join(D, 'css_template.py'), encoding='utf-8') as f:
    exec(f.read())
CSS = CSS  # from exec

CSS_INLINE = open(os.path.join(D, 'style.txt'), encoding='utf-8').read() if os.path.exists(os.path.join(D, 'style.txt')) else ""

print("Generator loaded. CSS length:", len(CSS))
