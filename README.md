# دفتري — Daftari Web (Angular 19)

- **Étape 1** : landing page (thème « دفتري », RTL, arabe).
- **Étape 2** : inscription, connexion, vérification d'e-mail et espace connecté `/app` (Firebase Auth).
- **Étape 2 bis** : page `/auth/action` (liens des e-mails), politique de mot de passe avec liste de conditions en direct.

## Lancer le projet

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production -> dist/daftari-web/browser
```

Prérequis : Node 20.19+ ou 22, npm 10+.

> Les fichiers `src/environments/*.ts` contiennent des `REPLACE_ME` dans cette archive : si tu as déjà collé ta configuration Firebase dans ton projet, **ne les écrase pas**.

## Configurer Firebase (gratuit, sans carte bancaire)

1. https://console.firebase.google.com → **Ajouter un projet** (offre Spark, Google Analytics inutile).
2. **Build → Authentication → Commencer → Sign-in method** : activer **E-mail/Mot de passe** et **Google** (choisir une adresse d'assistance).
   Ne pas activer « Téléphone » (SMS payants).
3. **Paramètres du projet → Vos applications → Web (`</>`)** : copier `apiKey`, `authDomain`, `projectId`, `appId`
   dans `src/environments/environment.development.ts` (dev) **et** `src/environments/environment.ts` (prod).
   La clé `apiKey` d'une app web n'est pas un secret.
4. **Authentication → Paramètres → Domaines autorisés** : `localhost` est déjà présent ; ajouter plus tard le domaine Cloudflare Pages.
5. (Optionnel) **Authentication → Modèles** : personnaliser le nom de l'expéditeur et le texte des e-mails.
   Le code envoie déjà les e-mails en arabe (`languageCode = 'ar'`).

Tant que les `REPLACE_ME` sont en place, les pages s'affichent mais la connexion renvoie « إعداد Firebase غير مكتمل ».

## Routes

| URL | Accès | Rôle |
|---|---|---|
| `/` | public | landing page |
| `/login`, `/signup`, `/forgot-password` | visiteurs non connectés | connexion, inscription (e-mail ou Google), mot de passe oublié |
| `/verify-email` | connecté, e-mail non vérifié | renvoi du lien, détection automatique au retour de la boîte mail |
| `/auth/action` | public | page ouverte depuis les e-mails Firebase (vérification d'adresse, nouveau mot de passe) ; utilisée une fois l'URL d'action configurée dans la console |
| `/app` | connecté **et** e-mail vérifié | espace connecté (tableau de bord provisoire) |

Paramètre `?returnUrl=` géré avec contrôle anti-redirection ouverte (`core/auth/safe-redirect.ts`).

## Mot de passe
- Règle côté application (`core/auth/password-policy.ts`) : 8 caractères minimum, 1 majuscule (A-Z), 1 minuscule (a-z), 1 chiffre (0-9).
- La liste des conditions se coche en direct (`shared/password-checklist`).
- Pour l'imposer aussi côté serveur : console Firebase → Authentication → Settings → **Password policy** (mode « Require »), avec les mêmes règles.
  Si cet onglet exige une mise à niveau payante, la vérification reste côté application seulement.

## Structure

```
src/
  environments/         config par environnement (Firebase, URL de l'API)
  styles/               tokens, base, UI partagée, formulaires
  app/
    core/
      firebase/         instance Firebase Auth (créée à la demande)
      auth/             AuthService (signals), gardes, intercepteur HTTP, messages d'erreur arabes
      mastery.ts        logique de démo de la landing
    shared/rich-editor/ mini éditeur de texte
    pages/landing/      landing page et ses sections
    features/
      auth/             layout + pages login, signup, forgot-password, verify-email
      app/              cadre de l'espace connecté + tableau de bord
```

Le SDK Firebase n'est chargé que par les pages d'authentification et l'espace connecté (chunks à la demande) :
la landing page reste légère.

## Choix à connaître
- L'intercepteur `authInterceptor` ajoute `Authorization: Bearer <token Firebase>` aux appels vers `environment.apiUrl`, et seulement vers lui.
  Il est fourni au niveau de la route `/app` ; il servira quand le back Spring Boot existera.
- `AuthService` expose une copie immuable de l'utilisateur (`AuthUser`) dans un signal, car Firebase mute son objet `User`.
- Après vérification de l'e-mail, le token est renouvelé (`getIdToken(true)`) pour que l'API voie `email_verified = true`.
- « Utilisateur introuvable » et « mauvais mot de passe » donnent le même message (pas de fuite sur l'existence d'un compte).

## Déploiement (Cloudflare Pages)
- Commande de build : `npm ci && npm run build`
- Dossier de sortie : `dist/daftari-web/browser`
- `public/_redirects` renvoie toutes les routes vers `index.html`.
- Ajouter le domaine `*.pages.dev` aux domaines autorisés de Firebase.

## À faire avant diffusion publique
- Remplacer le témoignage fictif de `pitch.component.ts` par un vrai avis.
- Remplacer la note de confidentialité de `signup.page.html` par le texte légal validé.
- Renseigner l'URL de l'API de production dans `environment.ts`.
- Ajouter les tests (aucun test d'interface n'est écrit pour l'instant).
