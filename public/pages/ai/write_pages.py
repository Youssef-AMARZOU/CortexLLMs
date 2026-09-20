#!/usr/bin/env python3
import os
OUT = os.path.dirname(os.path.abspath(__file__))

def cb(lang, code):
    return '<div class="code-block"><div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><span class="code-lang">'+lang+'</span></div><pre><code>'+code+'</code></pre></div>'

def co(ctype, title, text):
    return '<div class="callout '+ctype+'"><div class="callout-title">'+title+'</div><p>'+text+'</p></div>'

print("Writing regression-lineaire.html...")
