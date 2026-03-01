# Javascript - Source — Root-Me Web Client

**Points :** 10 | **Difficulté :** Facile | **Catégorie :** Javascript | **Date :** 2026-03-01

## Énoncé
Retrouver le mot de passe dans le code source JavaScript.

## Analyse
La page du challenge exécute un script JS inline qui affiche un `prompt()`. Le mot de passe est hardcodé en clair dans le JS :

```javascript
function login(){
    pass=prompt("Entrez le mot de passe / Enter password");
    if ( pass == "123456azerty" ) {
        alert("Mot de passe accepté...");
    }
}
```

## Exploitation
Lire le source HTML (Ctrl+U ou `curl`) → trouver la comparaison `== "123456azerty"`.

## Flag
`123456azerty`

## Technique apprise
Ne jamais stocker de secrets en clair dans le JS côté client. Le source est toujours accessible.
