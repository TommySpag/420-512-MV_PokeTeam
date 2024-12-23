# PokeTeam

## Description

Cette application mobile permet de **créer et noter des équipes de Pokémon** pour différents profils. Elle utilise l'API **PokéAPI** pour obtenir les données des Pokémon.

### Technologies

- **Front-end** : React Native avec **NativeWind** pour la gestion des styles.
- **Backend** : **Axios.js** pour effectuer les requêtes API.
- **Animations** : **React Native Reanimated** pour les animations fluides.
- **Caméra** : Accès à la caméra du téléphone pour la prise de photo de profile.

### Pages principales
- **Page d'accueil** 
- **Login et Signup** 
- **Profile** 
- **Prise de photo** 
- **Ratings**
- **Générations**
- **Pokémon par génération**
- **Description d'un Pokémon**

### Base de données

La base de données contient une **table unique** où chaque entrée correspond à un utilisateur et son équipe de Pokémon.

### Contexte

- **Thème Light/Dark** : L'application offre un thème clair et sombre, modifiable en fonction des préférences de l'utilisateur.
- **Thème dynamique** : Le thème de l'application change en fonction du type du **premier Pokémon** dans l'équipe de l'utilisateur.

## Instructions de démarrage

1. Clonez ce dépôt GitHub.
2. Installez les dépendances dans les répertoires **PokeTeam_FE** et **PokeTeam_BE** avec cette commande :
    ```bash
    npm install
    ```
3. Lancez les serveurs :
    - **PokeTeam_FE** : `npx expo start`
    - **PokeTeam_BE** : `npm run dev`

4. Vous serez dirigé vers la **page d'accueil**, où il vous sera demandé de vous inscrire ou vous authentifier. Une fois connecté, vous pourrez débuter à créer votre équipe en appuyant sur les cases avec des **+** pour ajouter des Pokémon.

---
