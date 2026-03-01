# Javascript - Authentification — Root-Me Web Client

**Points :** 10 | **Difficulté :** Facile | **Catégorie :** Javascript | **Date :** 2026-03-01

## Énoncé
Un formulaire de login avec une authentification JS côté client.

## Analyse
Le fichier `login.js` contient la logique d'authentification :

```javascript
function Login(){
    var pseudo = document.login.pseudo.value;
    var username = pseudo.toLowerCase();
    var password = document.login.password.value;
    password = password.toLowerCase();
    if (pseudo=="4dm1n" && password=="sh.org") {
        alert("Password accepté...");
    }
}
```

Les credentials sont hardcodés : `4dm1n` / `sh.org`.

## Exploitation
```bash
curl http://challenge01.root-me.org/web-client/ch9/login.js
```
Flag = password = `sh.org`

## Flag
`sh.org`

## Technique apprise
Toujours inspecter les fichiers JS externes (`login.js`, `auth.js`, etc.) — ils contiennent souvent la logique de validation.
