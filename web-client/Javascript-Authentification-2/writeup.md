# Javascript - Authentification 2 — Root-Me Web Client

**Points :** 15 | **Difficulté :** Facile | **Catégorie :** Javascript | **Date :** 2026-03-01

## Énoncé
Authentification JS — trouver le mot de passe.

## Analyse
`login.js` contient une liste d'utilisateurs :

```javascript
var TheLists = ["GOD:HIDDEN"];
for (i = 0; i < TheLists.length; i++) {
    if (TheLists[i].indexOf(username) == 0) {
        var TheSplit = TheLists[i].split(":");
        var TheUsername = TheSplit[0]; // "GOD"
        var ThePassword = TheSplit[1]; // "HIDDEN"
        if (username == TheUsername && password == ThePassword) {
            alert("... (en majuscules)");
        }
    }
}
```

Le mot de passe est `HIDDEN` (la note dit "en majuscules").

## Exploitation
```bash
curl http://challenge01.root-me.org/web-client/ch11/login.js
```

## Flag
`HIDDEN`

## Technique apprise
Patterns `["USER:PASS"]` dans les listes JS — split sur `:` pour extraire les credentials. Attention aux indications "en majuscules".
