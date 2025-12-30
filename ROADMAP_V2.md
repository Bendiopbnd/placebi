# Roadmap V2 - Placebi

Ce document détaille les fonctionnalités prévues pour la version 2 de Placebi, conçues pour enrichir la plateforme avec des analyses approfondies et une gestion complète des opérations restaurant.

## 🎯 Objectifs V2

- **Analyse approfondie** : Comprendre les sources de revenus et les coûts en détail
- **Gestion opérationnelle** : Intégrer la gestion des stocks
- **Intelligence prédictive** : Analytics avancées avec suggestions d'optimisation
- **Multi-restaurant** : Support de plusieurs restaurants par compte
- **Backend robuste** : Migration vers une architecture full-stack

---

## 1️⃣ Analyse Détaillée des Revenus

### 1.1 Répartition par Produit

**Objectif** : Permettre aux restaurateurs de savoir quels produits génèrent le plus de revenus.

**Fonctionnalités** :
- Saisie des revenus par produit/service
- Catalogue de produits configurable
- Analyse des produits les plus rentables
- Graphiques de performance par produit
- Tendances de vente par produit

**Modèles de données** :
```typescript
interface Product {
  id: string;
  restaurantId: string;
  name: string;
  category: string;
  price: number;
  createdAt: Date;
}

interface RevenueLine {
  id: string;
  revenueId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}
```

**UI/UX** :
- Page dédiée "Produits" dans la navigation
- Formulaire de saisie avec autocomplétion
- Dashboard produits avec top performers
- Graphiques de tendances par produit

### 1.2 Répartition par Catégorie

**Objectif** : Analyser les revenus par catégorie de produits (entrées, plats, desserts, boissons, etc.).

**Fonctionnalités** :
- Catégories configurables
- Analyse des revenus par catégorie
- Comparaison de performance entre catégories
- Graphiques en secteurs et barres empilées

### 1.3 Répartition par Canal

**Objectif** : Distinguer les revenus selon le canal de vente (sur place, livraison, à emporter).

**Fonctionnalités** :
- Saisie du canal lors de l'enregistrement des revenus
- Analyse comparative des canaux
- Identification du canal le plus rentable
- Optimisation des stratégies par canal

**Modèles de données** :
```typescript
type SalesChannel = 'dine_in' | 'delivery' | 'takeaway';

interface DailyRevenue {
  // ... existing fields
  channel?: SalesChannel;
  channelBreakdown?: {
    channel: SalesChannel;
    amount: number;
  }[];
}
```

---

## 2️⃣ Analyse Approfondie des Dépenses

### 2.1 Tendances d'Évolution des Coûts

**Objectif** : Visualiser l'évolution des coûts dans le temps et identifier les tendances.

**Fonctionnalités** :
- Graphiques d'évolution par catégorie
- Détection de pics anormaux
- Comparaison période sur période
- Alertes sur augmentations significatives

**UI/UX** :
- Page "Analyse des Coûts"
- Graphiques interactifs avec zoom
- Filtres par catégorie et période
- Export de rapports

### 2.2 Ratios Coûts vs Revenus

**Objectif** : Calculer et visualiser les ratios clés pour optimiser la rentabilité.

**Métriques** :
- Ratio coûts/revenus par catégorie
- Ratio coûts fixes/coûts variables
- Ratio coûts opérationnels/revenus
- Coût par client moyen

**Fonctionnalités** :
- Dashboard de ratios
- Benchmarks par type de restaurant
- Alertes sur ratios anormaux
- Suggestions d'optimisation

---

## 3️⃣ Gestion des Stocks

### 3.1 Entrées/Sorties de Stock

**Objectif** : Suivre les mouvements de stock pour optimiser les achats et réduire le gaspillage.

**Fonctionnalités** :
- Enregistrement des entrées de stock (achats)
- Enregistrement des sorties de stock (consommation)
- Historique des mouvements
- Valorisation du stock

**Modèles de données** :
```typescript
interface StockItem {
  id: string;
  restaurantId: string;
  name: string;
  unit: string; // kg, L, unité, etc.
  currentQuantity: number;
  minQuantity: number; // Seuil d'alerte
  unitPrice: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

interface StockMovement {
  id: string;
  stockItemId: string;
  type: 'in' | 'out';
  quantity: number;
  unitPrice: number;
  date: Date;
  reason?: string;
  linkedExpenseId?: string; // Lien avec dépense
}
```

**UI/UX** :
- Page "Stocks" avec liste des articles
- Formulaire d'entrée/sortie rapide
- Historique des mouvements
- Graphiques d'évolution des stocks

### 3.2 Alertes de Stock Faible

**Objectif** : Prévenir les ruptures de stock et optimiser les commandes.

**Fonctionnalités** :
- Alertes automatiques quand stock < seuil
- Notifications en temps réel
- Suggestions de réapprovisionnement
- Calcul des quantités optimales à commander

**UI/UX** :
- Badge d'alerte dans la navigation
- Page dédiée aux alertes
- Actions rapides (commander, ignorer)

### 3.3 Lien Ingredient-Consommation-Dépense

**Objectif** : Relier automatiquement la consommation d'ingrédients aux dépenses.

**Fonctionnalités** :
- Association automatique sortie stock → dépense
- Traçabilité complète des coûts
- Analyse du coût réel par plat
- Optimisation des recettes

---

## 4️⃣ Analytics Prédictives Avancées

### 4.1 Suggestions d'Optimisation de Marge

**Objectif** : Proposer des actions concrètes pour améliorer la rentabilité.

**Fonctionnalités** :
- Analyse des marges par produit/catégorie
- Suggestions de prix optimaux
- Identification des produits à promouvoir
- Recommandations de réduction de coûts

**Algorithme** :
- Analyse des données historiques
- Calcul des marges par produit
- Identification des opportunités
- Scoring des suggestions par impact potentiel

### 4.2 Détection d'Anomalies de Dépenses

**Objectif** : Détecter automatiquement les dépenses anormales.

**Fonctionnalités** :
- Machine Learning pour détecter les anomalies
- Alertes sur dépenses inhabituelles
- Comparaison avec les moyennes historiques
- Classification des anomalies (erreur, fraude, événement spécial)

**UI/UX** :
- Page "Anomalies" avec liste des alertes
- Détails de chaque anomalie
- Actions (valider, corriger, ignorer)

### 4.3 Simulations de Scénarios

**Objectif** : Permettre aux restaurateurs de simuler l'impact de décisions.

**Scénarios** :
- Augmentation/réduction de prix
- Changement de mix produits
- Réduction de coûts
- Changement d'horaires
- Impact d'une promotion

**Fonctionnalités** :
- Interface de simulation interactive
- Graphiques comparatifs (avant/après)
- Export de scénarios
- Sauvegarde de scénarios favoris

---

## 5️⃣ Multi-Restaurant

### 5.1 Gestion Multi-Restaurant

**Objectif** : Permettre à un utilisateur de gérer plusieurs restaurants.

**Fonctionnalités** :
- Création de plusieurs restaurants
- Sélecteur de restaurant dans la navigation
- Tableau de bord consolidé (tous restaurants)
- Tableaux de bord individuels
- Comparaison entre restaurants

**Modèles de données** :
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  restaurantIds: string[];
  createdAt: Date;
}

// Tous les modèles existants restent identiques
// restaurantId permet déjà la séparation
```

**UI/UX** :
- Sélecteur de restaurant en haut de la navbar
- Page "Mes Restaurants"
- Vue consolidée optionnelle
- Filtres par restaurant dans les analyses

---

## 6️⃣ Backend & Infrastructure

### 6.1 API Backend

**Objectif** : Migrer vers une architecture full-stack avec backend dédié.

**Stack proposé** :
- **Backend** : Node.js + Express ou Next.js API Routes
- **Base de données** : PostgreSQL ou MongoDB
- **Authentification** : JWT + OAuth
- **API** : RESTful ou GraphQL

**Endpoints principaux** :
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/restaurants
POST   /api/restaurants
GET    /api/revenues
POST   /api/revenues
GET    /api/expenses
POST   /api/expenses
GET    /api/analytics/kpis
GET    /api/analytics/predictions
```

### 6.2 Authentification & Sécurité

**Fonctionnalités** :
- Inscription/Connexion utilisateurs
- Gestion de sessions
- Rôles et permissions (owner, manager, staff)
- Chiffrement des données sensibles
- Rate limiting

### 6.3 Synchronisation & Offline

**Fonctionnalités** :
- Synchronisation automatique avec le backend
- Mode offline avec queue de synchronisation
- Résolution de conflits
- Service Worker pour PWA

---

## 7️⃣ Améliorations UX/UI

### 7.1 Mobile App (PWA)

**Objectif** : Application mobile native-like via PWA.

**Fonctionnalités** :
- Installation sur mobile
- Notifications push
- Mode offline complet
- Optimisations tactiles

### 7.2 Rapports & Exports

**Fonctionnalités** :
- Génération de rapports PDF
- Export CSV/Excel
- Rapports personnalisables
- Envoi par email automatique

### 7.3 Notifications & Alertes

**Fonctionnalités** :
- Notifications en temps réel
- Alertes configurables
- Rappels de saisie
- Résumés quotidiens/hebdomadaires

---

## 📅 Planning Estimé

### Phase 1 (3-4 mois)
- Analyse détaillée des revenus (produits, catégories, canaux)
- Analyse approfondie des dépenses
- Multi-restaurant

### Phase 2 (2-3 mois)
- Gestion des stocks (entrées/sorties, alertes)
- Lien stock-dépenses

### Phase 3 (3-4 mois)
- Analytics prédictives avancées
- Détection d'anomalies
- Simulations de scénarios

### Phase 4 (2-3 mois)
- Backend & API
- Authentification
- Synchronisation

### Phase 5 (1-2 mois)
- PWA & Mobile
- Rapports & Exports
- Notifications

**Total estimé** : 11-16 mois de développement

---

## 🎯 Critères de Succès V2

- ✅ Analyse complète des sources de revenus
- ✅ Gestion opérationnelle intégrée (stocks)
- ✅ Prédictions avec suggestions d'actions
- ✅ Support multi-restaurant
- ✅ Architecture scalable et maintenable
- ✅ Expérience utilisateur premium
- ✅ Performance optimale (mobile & desktop)

---

**Note** : Cette roadmap est évolutive et peut être ajustée selon les retours utilisateurs et les priorités business.

