# Javascript - Native code — Root-Me Web Client

**Points :** 25 | **Difficulté :** Moyen | **Catégorie :** Javascript/Obfuscation | **Date :** 2026-03-01

## Énoncé
Code obfusqué en JSFuck (caractères `[]()!+` uniquement).

## Analyse
Le code utilise des opérateurs JS purs pour construire du code :
```javascript
É=-~-~[],ó=-~É,Ë=É<<É,þ=Ë+~[];Ì=(ó-ó)[Û=...][Û];Ì(Ì(...))()
```

JSFuck encode `alert('...')` et autres fonctions avec uniquement `[]()!+`.

## Exploitation
**Méthode 1 : Exécuter dans un environnement Node**
```bash
node jsfuck.js 2>&1
# Erreur ReferenceError: prompt is not defined
# Mais affiche le code déobfusqué dans l'erreur :
# a=prompt('...');if(a=='toto123lol'){alert('bravo');}
```

**Méthode 2 : Console browser**
Copier tout le code dans la console → il s'exécute et affiche le prompt.

**Méthode 3 : Décodeur JSFuck en ligne**
- jsfuck.com ou fucked.js.org

## Flag
`toto123lol`

## Technique apprise
JSFuck = obfuscation extrême mais exécutable. Pour déobfusquer : exécuter dans un environnement safe (Node avec erreurs qui révèlent le code) ou utiliser un décodeur en ligne. L'exécution révèle toujours le code original.
