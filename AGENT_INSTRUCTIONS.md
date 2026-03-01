# Instructions Agent Root-Me

## Mission
Résoudre les challenges Root-Me catégories "Web - Client" et "Web - Serveur".
Pour chaque challenge : explorer, exploiter, valider le flag, écrire un writeup.

## Compte Root-Me
- URL : https://www.root-me.org
- Login : onyxtheassistant@gmail.com
- Password : Onyx@1234

## Repo writeups
- Path local : /home/onyx/projects/rootme/
- GitHub : https://github.com/onyxtheassistant/rootme-writeups

## Vuln KB disponible
- Path : /home/onyx/.openclaw/workspace/skills/vuln-kb/
- Pour chaque type de vuln, lire le SKILL.md correspondant avant d'attaquer

## Workflow par challenge

1. **Explore** : ouvrir le challenge, lire l'énoncé, voir la source, analyser le comportement
2. **Identifier** : quelle catégorie de vuln ? Lire le playbook dans vuln-kb/
3. **Rechercher** : si bloqué, web_search sur le nom exact du challenge + "root-me writeup"
4. **Exploiter** : appliquer la méthodologie, adapter les payloads
5. **Valider** : soumettre le flag sur Root-Me
6. **Documenter** : créer web-client/<slug>/writeup.md ou web-serveur/<slug>/writeup.md
7. **Mettre à jour** : web-client/README.md avec le statut ✅
8. **Push** : git add -A && git commit -m "solve: <challenge-name>" && git push

## Format writeup.md

```markdown
# [Nom du challenge] — Root-Me Web Client/Serveur

**Points :** X  
**Difficulté :** Facile/Moyen/Difficile  
**Catégorie :** [type de vuln]  
**Résolu le :** YYYY-MM-DD  

## Énoncé
[copier l'énoncé]

## Exploration
[ce qu'on a observé]

## Identification de la vulnérabilité
[quel type, pourquoi]

## Exploitation
[étapes détaillées, payloads utilisés, requêtes HTTP si pertinent]

## Flag
`[flag ici]`

## Leçons / Techniques apprises
[ce qu'on retient, à ajouter dans vuln-kb si nouveau]
```

## Ordre des challenges Web Client (commencer par les plus faciles)

Aller sur : https://www.root-me.org/fr/Challenges/Web-Client/
Commencer par les 1-10 points, puis monter en difficulté.

## Si bloqué sur un challenge

1. Lire les hints disponibles sur Root-Me
2. web_search("[nom exact challenge] root-me solution"  
3. Consulter le forum Root-Me du challenge
4. Passer au challenge suivant et revenir

## Mise à jour de la vuln-kb

Si tu découvres une technique nouvelle :
- Ouvrir le fichier skills/vuln-kb/<catégorie>/knowledge.md
- Ajouter la section "## Technique [nom] (Root-Me [challenge])"
- Documenter la technique avec l'exemple concret
