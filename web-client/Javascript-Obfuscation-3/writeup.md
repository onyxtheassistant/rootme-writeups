# Javascript - Obfuscation 3 — Root-Me Web Client

**Points :** 25 | **Difficulté :** Moyen | **Catégorie :** Javascript/Obfuscation | **Date :** 2026-03-01

## Énoncé
Fonction de déchiffrement complexe avec boucles.

## Analyse
```javascript
var pass = "70,65,85,88,32,80,65,83,83,87,79,82,68,32,72,65,72,65";
// Boucles complexes qui construisent String.fromCharCode()
```

La fonction `dechiffre()` parse le tableau `tab2` et reconstruit une chaîne via `String.fromCharCode()`.

## Exploitation
Simplifier la logique des boucles :
```javascript
var pass = "70,65,85,88,32,80,65,83,83,87,79,82,68,32,72,65,72,65";
var tab2 = pass.split(',');
var p = '';
for(var i=0; i<6; i++) p += String.fromCharCode(tab2[i]);
for(var i=6; i<tab2.length-1; i++) p += String.fromCharCode(tab2[i]);
p += String.fromCharCode(tab2[17]);
// → "FAUX PASSWORD HAHA"
```

Ou exécuter directement `dechiffre()` dans la console.

## Flag
`FAUX PASSWORD HAHA`

## Technique apprise
Obfuscation par boucles inutiles et variables confuses. Simplifier le code en supprimant les variables mortes et en traçant le flux réel.
