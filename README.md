# Placebi - Restaurant Revenue Management Platform

Plateforme moderne de gestion des revenus et dépenses pour restaurants, conçue pour être intuitive, rapide et adaptée aux besoins des restaurateurs en Afrique et au-delà.

## 🎯 Vue d'ensemble

Placebi est une application web progressive qui permet aux propriétaires et gestionnaires de restaurants de :
- Suivre les revenus quotidiens
- Suivre les dépenses quotidiennes
- Analyser la rentabilité
- Prédire les performances futures (hebdomadaire & mensuelle)
- Prendre de meilleures décisions opérationnelles

## ✨ Fonctionnalités V1 (MVP)

### 1. Inscription Restaurant
- Création d'un profil restaurant (nom, localisation, type, devise)
- Support d'un restaurant par compte (multi-restaurant prévu en V2)

### 2. Suivi des Revenus Quotidiens
Deux modes de saisie :
- **Mode Global** : Saisie du total et répartition par méthode de paiement (Wave, Orange Money, Espèces)
- **Mode Détaillé** : Saisie de plusieurs lignes de revenus avec leurs méthodes de paiement

### 3. Suivi des Dépenses Quotidiennes
Deux modes de saisie :
- **Mode Global** : Saisie simple du montant total
- **Mode Détaillé** : Répartition par catégorie (loyer, salaires, ingrédients, services publics, transport, marketing, autres)

### 4. Dashboard Financier
- KPIs en temps réel (Revenus totaux, Dépenses totales, Marge nette, Marge nette %)
- Graphiques interactifs :
  - Évolution des revenus et dépenses dans le temps
  - Répartition par méthode de paiement (graphique en secteurs)
- Filtres temporels : Aujourd'hui / Cette semaine / Ce mois

### 5. Analytics Prédictives
- Prédictions de fin de semaine (revenus, dépenses, marge nette)
- Prédictions de fin de mois
- Prédictions par méthode de paiement
- Basées sur des moyennes mobiles et extrapolation de tendances

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **State Management** : Zustand (avec persistance locale)
- **Graphiques** : Recharts
- **Icons** : Lucide React
- **Date Management** : date-fns

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Démarrer le serveur de production
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Structure des dossiers

```
placebi/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Dashboard principal
│   ├── revenue/           # Page de saisie des revenus
│   ├── expense/           # Page de saisie des dépenses
│   ├── settings/          # Paramètres
│   └── setup/             # Configuration initiale
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   └── layout/           # Composants de layout
├── lib/                   # Utilitaires et logique métier
│   ├── store.ts          # Store Zustand
│   └── utils.ts          # Fonctions utilitaires
├── types/                 # Types TypeScript
└── public/               # Assets statiques
```

### Modèles de données

- **Restaurant** : Profil du restaurant
- **DailyRevenue** : Revenus quotidiens avec méthodes de paiement
- **DailyExpense** : Dépenses quotidiennes (globales ou détaillées)
- **RevenuePaymentMethod** : Méthode de paiement pour les revenus
- **ExpenseLine** : Ligne de dépense par catégorie

## 🎨 Design System

L'interface est inspirée des meilleures pratiques UX/UI modernes (Stripe, Linear, Notion) :
- Design minimaliste et épuré
- Palette de couleurs neutres avec accent primaire (bleu)
- Typographie claire (Inter)
- Responsive et optimisé mobile
- UX optimisée pour une saisie rapide quotidienne

## 🚀 Roadmap V2

Les fonctionnalités suivantes sont prévues pour la V2 :

1. **Analyse détaillée des revenus**
   - Par produit
   - Par catégorie
   - Par canal (sur place, livraison, à emporter)

2. **Analyse approfondie des dépenses**
   - Tendances d'évolution des coûts
   - Ratios coûts vs revenus

3. **Gestion des stocks**
   - Entrées/sorties de stock
   - Alertes de stock faible
   - Lien entre consommation d'ingrédients et dépenses

4. **Analytics prédictives avancées**
   - Suggestions d'optimisation de marge
   - Détection d'anomalies de dépenses
   - Simulations de scénarios

## 📝 Notes de développement

- Les données sont actuellement stockées localement dans le navigateur (localStorage via Zustand persist)
- Pour la production, il faudra intégrer une base de données backend
- L'architecture est conçue pour être scalable et modulaire
- API-first design pour faciliter l'intégration future d'un backend

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont les bienvenues !

## 📄 Licence

Propriétaire - Tous droits réservés

---

**Placebi** - Gestion intelligente des revenus pour restaurants modernes

