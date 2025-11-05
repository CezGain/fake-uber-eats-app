# Guide de Déploiement - Fake Uber Eats App

## Processus de Déploiement Automatisé

### Vue d'ensemble

Le système de déploiement automatisé repose sur GitHub Actions avec deux environnements distincts :

- **Staging** : Déploiement automatique sur chaque push vers `develop`
- **Production** : Déploiement automatique sur chaque push vers `main`

### Architecture CI/CD

```
Code Push → Lint Check → Tests → Build → Deploy (selon branche)
```

**Workflows configurés :**

- `ci.yml` : Intégration continue (lint, tests, build, audit sécurité)
- `deploy.yml` : Déploiement en production
- `staging.yml` : Déploiement en staging (optionnel)
- `docker-build.yml` : Construction et publication d'images Docker (optionnel)

---

## Secrets Requis

### Configuration des Secrets GitHub

Pour configurer les secrets, allez dans : `Settings → Secrets and variables → Actions → New repository secret`

#### Secrets Obligatoires

| Nom du Secret         | Description                | Exemple de valeur                                     |
| --------------------- | -------------------------- | ----------------------------------------------------- |
| `PROD_API_URL`        | URL de l'API en production | `https://api.production.com`                          |
| `STAGING_API_URL`     | URL de l'API en staging    | `https://api.staging.com`                             |
| `JWT_SECRET_PROD`     | Secret JWT pour production | Chaîne aléatoire sécurisée                            |
| `JWT_SECRET_STAGING`  | Secret JWT pour staging    | Chaîne aléatoire sécurisée                            |
| `MONGODB_URI_PROD`    | URI MongoDB production     | `mongodb+srv://user:pass@cluster.mongodb.net/prod`    |
| `MONGODB_URI_STAGING` | URI MongoDB staging        | `mongodb+srv://user:pass@cluster.mongodb.net/staging` |

#### Secrets de Déploiement (selon plateforme)

**Pour Heroku :**

- `HEROKU_API_KEY` : Clé API Heroku (récupérable depuis Account Settings)
- `HEROKU_APP_NAME_PROD` : Nom de l'app Heroku production
- `HEROKU_APP_NAME_STAGING` : Nom de l'app Heroku staging

**Pour Railway :**

- `RAILWAY_TOKEN` : Token d'authentification Railway
- `RAILWAY_PROJECT_ID_PROD` : ID du projet production
- `RAILWAY_PROJECT_ID_STAGING` : ID du projet staging

**Pour serveur VPS/SSH :**

- `SSH_HOST` : Adresse IP ou domaine du serveur
- `SSH_USERNAME` : Nom d'utilisateur SSH
- `SSH_PRIVATE_KEY` : Clé privée SSH (format PEM)
- `DEPLOY_PATH` : Chemin du répertoire de déploiement

#### Secrets Optionnels

| Nom du Secret       | Description                  | Usage                        |
| ------------------- | ---------------------------- | ---------------------------- |
| `SLACK_WEBHOOK_URL` | URL webhook Slack            | Notifications de déploiement |
| `DOCKER_USERNAME`   | Nom d'utilisateur Docker Hub | Publication d'images Docker  |
| `DOCKER_PASSWORD`   | Mot de passe Docker Hub      | Publication d'images Docker  |

---

## Procédure de Déploiement

### Déploiement Automatique

#### En Production

1. Fusionner les modifications vers `main`
2. Le workflow `deploy.yml` se déclenche automatiquement
3. Vérifications pré-déploiement :
   - Lint validé
   - Tests réussis
   - Build frontend fonctionnel
4. Exécution des migrations MongoDB
5. Déploiement de l'application
6. Tests de santé post-déploiement
7. Notification du résultat

#### En Staging

1. Pusher vers `develop`
2. Le workflow `staging.yml` se déclenche
3. Même processus que production avec environnement staging

### Déploiement Manuel

#### Via l'interface GitHub

1. Aller dans l'onglet **Actions**
2. Sélectionner le workflow `Deploy to Production`
3. Cliquer sur **Run workflow**
4. Choisir la branche à déployer
5. (Optionnel) Sélectionner la version/tag
6. Confirmer l'exécution

#### Via GitHub CLI

```bash
# Déployer la branche main en production
gh workflow run deploy.yml --ref main

# Déployer une version spécifique
gh workflow run deploy.yml --ref v1.2.0

# Déployer en staging
gh workflow run staging.yml --ref develop
```

---

## Étapes Manuelles

### Configuration Initiale

#### 1. Préparer les Environnements

**GitHub Repository Settings → Environments**

Créer deux environnements :

- `production` : Protection requise, reviewers obligatoires
- `staging` : Déploiement libre

**Configuration de l'environnement production :**

- Activer "Required reviewers" (1 reviewer minimum)
- Activer "Wait timer" (5 minutes de délai)
- Restreindre aux branches : `main` uniquement

#### 2. Configurer la Plateforme de Déploiement

**Pour Heroku :**

```bash
# Installer Heroku CLI
brew install heroku

# Se connecter
heroku login

# Créer les applications
heroku create fake-uber-eats-prod
heroku create fake-uber-eats-staging

# Récupérer l'API Key
heroku auth:token
```

**Pour Railway :**

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Créer les projets
railway init
railway link
```

#### 3. Configuration des Variables d'Environnement

Sur votre plateforme de déploiement, configurer :

- `NODE_ENV=production`
- `PORT=8080`
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`

#### 4. Migrations MongoDB

Si nécessaire, exécuter manuellement les migrations initiales :

```bash
# En production
npm run migrate:prod

# En staging
npm run migrate:staging
```

---

## Procédure de Rollback

### Rollback Automatique

Le workflow de déploiement inclut un mécanisme de rollback automatique si :

- Les tests post-déploiement échouent
- Le health check API ne répond pas
- Timeout de déploiement (> 10 minutes)

### Rollback Manuel

#### Méthode 1 : Via GitHub Actions

1. Aller dans **Actions → Deploy to Production**
2. Trouver le dernier déploiement réussi
3. Cliquer sur **Re-run jobs**
4. Le système redéploiera automatiquement la version précédente

#### Méthode 2 : Via Git

```bash
# Identifier le dernier commit stable
git log --oneline

# Créer une branche de rollback
git checkout -b rollback/to-<commit-hash> <commit-hash>

# Pousser vers main (déclenche le déploiement)
git push origin rollback/to-<commit-hash>:main --force
```

#### Méthode 3 : Via la Plateforme

**Heroku :**

```bash
# Lister les releases
heroku releases --app fake-uber-eats-prod

# Rollback vers une version précédente
heroku rollback v42 --app fake-uber-eats-prod
```

**Railway :**

```bash
# Rollback via l'interface web
# Projects → Deployments → Sélectionner version précédente → Redeploy
```

#### Méthode 4 : Rollback d'urgence

En cas d'incident critique :

```bash
# 1. Annuler les commits problématiques
git revert HEAD~3..HEAD

# 2. Pousser immédiatement
git push origin main

# 3. Vérifier le déploiement
curl https://api.production.com/health

# 4. Notifier l'équipe
# (automatique via Slack webhook si configuré)
```

---

## Monitoring Post-Déploiement

### Tests de Santé Automatiques

Le workflow exécute automatiquement :

- Health check de l'API (`GET /health`)
- Vérification des endpoints critiques
- Test de connexion MongoDB
- Validation des variables d'environnement

### Monitoring Manuel

```bash
# Vérifier le statut de l'API
curl https://api.production.com/health

# Consulter les logs (Heroku)
heroku logs --tail --app fake-uber-eats-prod

# Consulter les logs (Railway)
railway logs

# Vérifier les métriques
# Accéder au dashboard de la plateforme
```

### Points de Vérification

Après chaque déploiement, vérifier :

- [ ] API répond avec code 200
- [ ] Authentification fonctionne
- [ ] Connexion MongoDB active
- [ ] Frontend accessible
- [ ] CORS configuré correctement
- [ ] Temps de réponse < 500ms

---

## Troubleshooting

### Problèmes Courants

#### Le déploiement échoue lors de la vérification pré-déploiement

**Cause :** Tests ou lint ont échoué sur une branche précédente

**Solution :**

```bash
# Vérifier localement
npm run lint
npm test
npm run build

# Corriger et repousser
git add .
git commit -m "fix: resolve CI issues"
git push
```

#### Les migrations MongoDB échouent

**Cause :** Connexion MongoDB ou schéma incompatible

**Solution :**

1. Vérifier `MONGODB_URI_PROD` dans les secrets
2. Tester la connexion manuellement
3. Rollback si nécessaire
4. Corriger les migrations et redéployer

#### Le health check post-déploiement échoue

**Cause :** Application ne démarre pas ou timeout

**Solution :**

```bash
# Consulter les logs de déploiement
gh run view --log

# Vérifier les logs de l'application
heroku logs --tail --app fake-uber-eats-prod

# Vérifier les variables d'environnement
heroku config --app fake-uber-eats-prod
```

#### Les artefacts de build ne sont pas trouvés

**Cause :** Job de build a échoué ou cache corrompu

**Solution :**

1. Re-run le workflow avec cache nettoyé
2. Vérifier `vite.config.mts` pour la configuration de build
3. S'assurer que `dist/` est généré correctement

---

## Maintenance

### Mise à Jour des Secrets

```bash
# Rotation des secrets JWT (à faire tous les 6 mois)
# 1. Générer nouveau secret
openssl rand -base64 64

# 2. Mettre à jour dans GitHub Secrets
# 3. Déployer (l'ancienne version reste valide pendant 24h)

# 4. Après 24h, supprimer l'ancien secret
```

### Nettoyage des Artefacts

Les artefacts sont automatiquement supprimés après 30 jours. Pour nettoyer manuellement :

```bash
# Via GitHub CLI
gh api repos/{owner}/{repo}/actions/artifacts | jq '.artifacts[] | .id' | xargs -I {} gh api -X DELETE repos/{owner}/{repo}/actions/artifacts/{}
```

### Mise à Jour des Dépendances

Avant chaque déploiement majeur :

```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour les dépendances
npm update

# Audit de sécurité
npm audit fix

# Tester localement
npm test

# Commit et push
git add package*.json
git commit -m "chore: update dependencies"
git push
```

---

## Contacts et Support

- **Responsable Déploiement :** [Nom] - [email]
- **Équipe DevOps :** [email équipe]
- **Documentation Plateforme :** [lien]
- **Incidents :** Créer une issue GitHub avec le label `deployment`

---

**Dernière mise à jour :** 5 novembre 2025
