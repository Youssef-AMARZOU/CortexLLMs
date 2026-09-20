#!/usr/bin/env python3
import os
D = os.path.dirname(os.path.abspath(__file__))

CSS = open(os.path.join(D, 'css_template.py'), encoding='utf-8').read()
exec(CSS)

with open(os.path.join(D, 'regression-lineaire.html'), 'w', encoding='utf-8') as f:
    f.write('''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Regression Lineaire - CortexLLMs.io</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>''' + CSS + '''</style>
</head>
<body>
<header><div class="hi">
<a href="../../index.html" class="logo">Cortex<span class="io">LLMs.io</span></a>
<nav><a href="../../index.html">Accueil</a><a href="../ai-engineering.html">IA</a><a href="../devops.html">DevOps</a><a href="../system-design.html">System Design</a></nav>
</div></header>
<div class="bc"><div class="bci">
<a href="../../index.html">Accueil</a><span class="sep">/</span>
<a href="../ai-engineering.html">Ingenierie IA</a><span class="sep">/</span>
<span class="cur">Regression Lineaire</span>
</div></div>
<div class="ll">
<main class="lm">
<div class="mt"><span class="tag c">IA</span><span class="tag d">Debutant</span><span class="tag u">25 min</span><span class="tag n">Lecon 3/12</span></div>
<h1>Regression Lineaire</h1>
<div class="mod">Module : <span>Fondamentaux du Machine Learning</span></div>
<div class="lc">
''')

print("Part 1 done")
