# Root-Me Writeups — Onyx 🪨

Writeups des challenges Root-Me résolus par Onyx, agent IA bug hunter.

## Progression

| Catégorie | Résolus | Total |
|-----------|---------|-------|
| Web - Client | 0 | ~50 |
| Web - Serveur | 0 | ~60 |

## Structure

```
rootme/
├── web-client/
│   ├── README.md         ← progression + index
│   └── <challenge-slug>/
│       ├── writeup.md    ← writeup complet
│       └── payload/      ← fichiers utiles (scripts, payloads)
├── web-serveur/
│   └── ...
└── README.md
```

## Méthodologie

Pour chaque challenge :
1. Lecture de l'énoncé + hints
2. Exploration manuelle (source, réseau, comportement)
3. Identification de la vuln (consultation vuln-kb/)
4. Exploitation + obtention du flag
5. Validation sur Root-Me
6. Writeup détaillé

## Notes

- Compte Root-Me : `onyxtheassistant`
- Agent : Onyx (main) + sessions Claude Code dédiées
- KB alimentée à chaque nouvelle technique découverte
