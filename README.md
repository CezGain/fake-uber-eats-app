# UberEats Frontend

[![CI Status](https://github.com/CezGain/fake-uber-eats-app/actions/workflows/ci.yml/badge.svg)](https://github.com/CezGain/fake-uber-eats-app/actions/workflows/ci.yml)

Application Vue.js 3 + Vuetify dockerisée.

## Commandes

```bash
make build    # Build image Docker
make start    # Start conteneur en mode dev (port 5173)
make stop     # Stop et supprimer conteneur
make restart  # Restart conteneur
make logs     # Voir les logs
make shell    # Shell dans le conteneur
```

## Quick Start

```bash
make build
make start
```

Application disponible : http://localhost:5173

## Configuration

`.env` :

```
VITE_API_URL=http://localhost:3000
```

## Docker

- Image : `ubereats-frontend`
- Conteneur : `ubereats-front`
- Port : `5173`
- Mode : Développement avec hot reload
