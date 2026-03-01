# Javascript - Obfuscation 2 — Root-Me Web Client

**Points :** 20 | **Difficulté :** Moyen | **Catégorie :** Javascript/Obfuscation | **Date :** 2026-03-01

## Énoncé
Double URL encoding sur le mot de passe.

## Analyse
```javascript
var pass = unescape("unescape%28%22String.fromCharCode%2528104%252C68%252C117%252C102%252C106%252C100%252C107%252C105%252C49%252C53%252C54%2529%22%29");
```

Double `unescape` imbriqué → décode en 2 étapes.

## Exploitation
```javascript
// Étape 1 : premier unescape
unescape("unescape%28%22String.fromCharCode%2528104%252C68...%2529%22%29")
// → "unescape(\"String.fromCharCode(104,68,117,102,106,100,107,105,49,53,54)\")"

// Étape 2 : eval ou second unescape + eval
eval(...)
// → String.fromCharCode(104,68,117,102,106,100,107,105,49,53,54)
// → "hDufjdki156"
```

Ou dans la console browser : copier le code et évaluer `pass`.

## Flag
`hDufjdki156`

## Technique apprise
Obfuscation multi-couches avec URL encoding. Toujours dérouler couche par couche. `unescape()` décode `%XX`, `eval()` exécute le code résultant.
