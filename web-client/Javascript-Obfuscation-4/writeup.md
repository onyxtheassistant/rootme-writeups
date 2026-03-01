# Javascript - Obfuscation 4 — Root-Me Web Client

**Points :** 30 | **Difficulté :** Moyen | **Catégorie :** Javascript/Obfuscation | **Date :** 2026-03-01

## Énoncé
Challenge nécessitant patience et intuition pour déchiffrer du code JavaScript obfusqué.

**URL :** http://challenge01.root-me.org/web-client/ch17/ch17.html

## Analyse
Le code source contient une fonction de déchiffrement complexe avec :
- XOR (`_()`)
- Rotations de bits (`____()`, `_____()`)
- Une chaîne chiffrée `ð` (hex-encoded)
- Un checksum qui doit valoir **8932**

```javascript
var ð= "\x71\x11\x24\x59\x8d\x6d\x71\x11\x35\x16\x8c\x6d...";

function _______(_________,key){
  // Déchiffre la chaîne avec XOR + rotations alternées
  for(var i=0;i<_________.length;i++){
    if(i != 0){
      t = ________.charCodeAt(i-1)%2;
      switch(t){
        case 0: cr = _(c, key.charCodeAt(i % key.length)); break;  // XOR
        case 1: cr = ______(c, key.charCodeAt(i % key.length)); break;  // Rotation
      }
    }else{
      cr = _(c, key.charCodeAt(i % key.length));
    }
    ________ += String.fromCharCode(cr);
  }
  return ________;
}

function __________(þ){
  var ŋ=0;
  for(var i=0;i<þ.length;i++) ŋ+=þ["charCodeAt"](i);
  if(ŋ==8932) {
    // Success - ouvre une fenêtre avec le résultat
  }
}
```

## Exploitation
### Bruteforce de la clé
Le password doit produire un résultat déchiffré avec un checksum de **8932**.

Algorithme :
1. Tester des clés courtes (1-5 caractères)
2. Pour chaque clé, déchiffrer `ð`
3. Calculer `sum(charCodeAt(c) for c in result)`
4. Si sum == 8932 → clé valide

```javascript
function* genKeys(chars, len) {
  if (len === 0) { yield ''; return; }
  for (var c of chars) {
    for (var rest of genKeys(chars, len - 1)) {
      yield c + rest;
    }
  }
}

const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
for (var len = 1; len <= 5; len++) {
  for (var k of genKeys(charset, len)) {
    var r = _______(ð, k);
    var sum = r.split('').reduce((s,c)=>s+c.charCodeAt(0),0);
    if (sum === 8932) {
      console.log("KEY FOUND:", k);
      break;
    }
  }
}
```

### Résultat
Clé trouvée : **`k0`**
- Longueur : 2 caractères
- Checksum : 8932 ✓

## Flag
`k0`

## Technique apprise
- **Bruteforce de clés de déchiffrement** via contrainte de checksum
- Analyse de fonctions obfusquées (XOR + rotations de bits)
- Générateurs JavaScript pour parcourir efficacement l'espace des clés
- Les challenges d'obfuscation peuvent cacher le flag **dans le password lui-même** (pas dans le HTML déchiffré)
