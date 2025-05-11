# Spotify Clone

Un clone de Spotify construit avec Nuxt.js, Vue.js et l'API Spotify.

## Fonctionnalités

- Authentification Spotify
- Lecture de musique
- Gestion des playlists
- Recherche de musique
- Navigation entre les artistes et les albums
- Interface utilisateur moderne et responsive

## Prérequis

- Node.js (v16 ou supérieur)
- Compte Spotify Developer
- Identifiants Spotify (Client ID et Client Secret)

## Configuration

1. Clonez le dépôt :
```bash
git clone <repository-url>
cd spotify-clone
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :
```
SPOTIFY_CLIENT_ID=votre_client_id
SPOTIFY_CLIENT_SECRET=votre_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
```

4. Configurez votre application Spotify :
   - Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Créez une nouvelle application
   - Ajoutez `http://127.0.0.1:3000/callback` comme URI de redirection
   - Copiez le Client ID et le Client Secret dans votre fichier `.env`

## Démarrage

1. Démarrez le serveur de développement :
```bash
npm run dev
```

2. Ouvrez votre navigateur à l'adresse [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Technologies utilisées

- [Nuxt.js](https://nuxt.com/)
- [Vue.js](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Nuxt Icon](https://nuxt.com/modules/icon)

## Structure du projet

```
spotify-clone/
├── components/         # Composants Vue réutilisables
├── composables/        # Composables Vue (hooks)
├── layouts/           # Mises en page Nuxt
├── pages/             # Pages de l'application
├── plugins/           # Plugins Nuxt
├── public/            # Fichiers statiques
├── types/             # Types TypeScript
├── .env               # Variables d'environnement
├── nuxt.config.ts     # Configuration Nuxt
└── package.json       # Dépendances et scripts
```

## Licence

MIT
