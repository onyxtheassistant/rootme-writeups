# Javascript - Obfuscation 1 — Root-Me Web Client

**Points :** 15 | **Difficulté :** Facile | **Catégorie :** Javascript/Obfuscation | **Date :** 2026-03-01

## Énoncé
Mot de passe obfusqué via URL encoding.

## Analyse
Le JS contient :
```javascript
pass = '%63%70%61%73%62%69%65%6e%64%75%72%70%61%73%73%77%6f%72%64';
h = window.prompt('Entrez le mot de passe');
if(h == unescape(pass)) { ... }
```

`unescape()` décode les `%XX` → le vrai mot de passe.

## Exploitation
```python
from urllib.parse import unquote
print(unquote('%63%70%61%73%62%69%65%6e%64%75%72%70%61%73%73%77%6f%72%64'))
# → cpasbiendurpassword
```

Ou dans la console browser : `unescape('%63%70%61%73...')`

## Flag
`cpasbiendurpassword`

## Technique apprise
URL encoding (`%XX`) = obfuscation triviale. `unescape()` ou `decodeURIComponent()` pour décoder. Toujours chercher les comparaisons `==` dans le JS.
