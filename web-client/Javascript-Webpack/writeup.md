# Javascript - Webpack — Root-Me Web Client

**Points :** 35 | **Difficulté :** Moyen | **Catégorie :** Javascript/Source Maps | **Date :** 2026-03-01

## Énoncé
Application Vue.js buildée avec Webpack. Analyser le code source.

**URL :** http://challenge01.root-me.org/web-client/ch27/

## Analyse
L'application est une SPA (Single Page Application) Vue.js avec routing :
- `/` - Home
- `/duck` - Page canard normal
- `/duck-mandarin` - Page canard mandarin

Le HTML contient 3 fichiers JS minifiés :
```html
<script src="./static/js/manifest.2ae2e69a05c33dfc65f8.js"></script>
<script src="./static/js/vendor.458c9f5863b8f28e5570.js"></script>
<script src="./static/js/app.a92c5074dafac0cb6365.js"></script>
```

## Exploitation
### Source Maps
Le fichier principal `app.a92c5074dafac0cb6365.js` contient une référence à une **source map** :
```javascript
//# sourceMappingURL=app.a92c5074dafac0cb6365.js.map
```

Récupérons-la :
```bash
curl 'http://challenge01.root-me.org/web-client/ch27/static/js/app.a92c5074dafac0cb6365.js.map' | jq .
```

### Code source déminifié
La source map révèle les fichiers sources Vue.js originaux :
```json
{
  "sources": [
    "webpack:///src/App.vue",
    "webpack:///src/components/Home.vue",
    "webpack:///src/components/Duck.vue",
    "webpack:///src/components/DuckMandarin.vue",
    "webpack:///src/components/YouWillNotFindThisRouteBecauseItIsHidden.vue",
    "webpack:///src/router/index.js",
    "webpack:///src/main.js"
  ]
}
```

### Route cachée
Un composant suspect : **`YouWillNotFindThisRouteBecauseItIsHidden.vue`**

Son code source complet est dans `sourcesContent[14]` :
```vue
<script>
export default {
  name: 'Duck',
  data () {
    return {
        // Did you know that comment are readable by the end user ?
        // Well, this because I build the application with the source maps enabled !!!

        // So please, disable source map when you build for production

        // Here is your flag : BecauseSourceMapsAreGreatForDebuggingButNotForProduction

        'msg': 'Quack quack !! :).'
    }
  }
}
</script>
```

### Leçon de sécurité
Le développeur a laissé le flag en commentaire dans le code source. Les **source maps** permettent de reconstruire complètement le code original (commentaires inclus) depuis le JS minifié.

## Flag
`BecauseSourceMapsAreGreatForDebuggingButNotForProduction`

## Technique apprise
- **Source maps** : fichiers `.map` qui permettent de déboguer du JS minifié en mappant vers le code source original
- Inspecter les source maps pour trouver :
  - Routes cachées (non référencées dans le router actif)
  - Commentaires de développement
  - Code mort (dead code) non accessible via l'UI
- En production, **toujours désactiver les source maps** ou les restreindre (servir uniquement en interne)
- Commande utile : `curl <url>.js.map | jq '.sourcesContent[]' -r` pour extraire tous les fichiers sources
