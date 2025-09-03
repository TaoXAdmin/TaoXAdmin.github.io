# Portfolio d'Alexis Fiska

Ce dépôt contient le code source d'un portfolio personnel statique réalisé avec [Astro](https://astro.build/), Tailwind CSS et de nombreux composants personnalisés.  Le site est multilingue (français, anglais, allemand et portugais) et est prêt à être déployé sur GitHub Pages.

## 📦 Installation

Installez les dépendances et lancez un serveur de développement :

```bash
npm install
npm run dev
```

Le site est alors accessible sur `http://localhost:4321`.  Utilisez `npm run build` pour construire la version de production et `npm run preview` pour la prévisualiser.  Le script `npm run format` formate tous les fichiers à l'aide de Prettier.

## 📁 Structure du projet

```
alexis-portfolio/
├── public/               # Fichiers publics servis tels quels (images, robots.txt)
│   ├── images/
│   │   ├── favicon.png    # Icône du site
│   │   ├── placeholder_light_gray_block.png  # Placeholder pour les images d'articles
│   │   └── profile.jpg    # Portrait de profil (à remplacer)
│   └── robots.txt         # Directive pour les moteurs de recherche
├── src/
│   ├── components/        # Composants Astro réutilisables (Header, Footer, etc.)
│   ├── layouts/           # Layouts principaux (BaseLayout)
│   ├── content/           # Collection de contenus Markdown pour le blog
│   └── pages/             # Pages par langue (/fr, /en, /de, /pt)
├── astro.config.mjs       # Configuration Astro (site, sitemap, intégrations)
├── tailwind.config.js     # Configuration Tailwind CSS
├── package.json           # Dépendances et scripts npm
└── README.md              # Ce fichier
```

Le dossier `src/pages` contient une arborescence par langue (`/fr`, `/en`, `/de`, `/pt`).  Chaque dossier comprend des pages comme `index.astro` (accueil), `about.astro`, `services.astro`, etc.  La racine `/` redirige vers `/fr` par défaut.

## 🌐 Internationalisation

Le site est disponible en quatre langues : français (`/fr`), anglais (`/en`), allemand (`/de`) et portugais (`/pt`).  Le composant `LangSwitcher` permet de basculer entre les langues tout en conservant la page courante lorsque c'est possible.  Les métadonnées SEO (titres, descriptions, JSON‑LD) sont également localisées.

## 👤 Remplacer le portrait

Une image de profil fictive se trouve dans `public/images/profile.jpg`.  Pour utiliser votre propre portrait :

1. Remplacez `public/images/profile.jpg` par votre fichier (gardez le même nom).  
2. Assurez‑vous que l'image est carrée pour un rendu optimal.

Le changement est automatiquement pris en compte lors du prochain build.

## ✉️ Formulaire de contact Formspree

Le formulaire de contact utilise [Formspree](https://formspree.io/) pour transmettre les messages.  Actuellement, le champ `action` des formulaires contient un identifiant de formulaire fictif :`https://formspree.io/f/your-form-id`.  

Pour recevoir les messages :

1. Créez un formulaire sur Formspree et copiez l'identifiant (par ex. `f/abcd1234`).
2. Modifiez l'attribut `action` des formulaires situés dans `src/pages/*/contact.astro` en remplaçant `your-form-id` par cet identifiant.

Assurez‑vous de conserver le champ caché `_language` qui permet de préciser la langue du message.

## 📈 Activation de Plausible Analytics

Le site intègre [Plausible Analytics](https://plausible.io/) pour mesurer anonymement l'audience.  Le script est initialisé dans le layout via :

```astro
<script defer data-domain="alexis-fiska.github.io" src="https://plausible.io/js/plausible.js"></script>
```

Pour utiliser votre propre instance ou domaine :

1. Créez un site dans votre tableau de bord Plausible et récupérez le nom de domaine configuré.
2. Modifiez l'attribut `data-domain` dans `src/layouts/BaseLayout.astro` en conséquence.

Une notice d'opt‑out est présente dans le pied de page pour plus de transparence.

## 🔍 SEO et accessibilité

Le layout génère automatiquement les balises meta (`title`, `description`), les balises Open Graph/Twitter et un balisage JSON‑LD décrivant les services proposés.  La configuration du sitemap et du fichier `robots.txt` permet une bonne indexation par les moteurs de recherche.  Des bonnes pratiques d’accessibilité sont appliquées : contraste élevé, skip-link, focus visibles et aria‑labels sur les éléments interactifs.

## 🛠 Déploiement sur GitHub Pages

Ce projet est prêt pour un déploiement continu sur GitHub Pages.  Le workflow se trouve dans `.github/workflows/astro.yml`.  À chaque push sur la branche `main`, GitHub Actions installe les dépendances, construit le site puis déploie le dossier `dist` sur la branche `gh-pages` du dépôt.

Pensez à mettre à jour la clé `site` dans `astro.config.mjs` si vous changez de domaine de déploiement.

## 🤝 Contribuer

Les contributions sont les bienvenues !  N'hésitez pas à ouvrir des issues ou des pull requests pour proposer des améliorations, corriger des coquilles ou ajouter de nouvelles traductions.