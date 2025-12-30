# Architecture & Information Architecture - Placebi

## 📐 Architecture d'Information

### Navigation Principale

```
Placebi
├── Dashboard (Page d'accueil)
│   ├── KPIs (Revenus, Dépenses, Marge nette)
│   ├── Graphiques (Évolution temporelle, Répartition paiements)
│   ├── Prédictions (Semaine, Mois)
│   └── Filtres temporels
│
├── Revenus
│   ├── Mode Global
│   │   ├── Date
│   │   ├── Répartition par méthode de paiement
│   │   └── Total auto-calculé
│   └── Mode Détaillé
│       ├── Date
│       ├── Montant total
│       ├── Lignes multiples (montant + méthode)
│       └── Total auto-calculé
│
├── Dépenses
│   ├── Mode Global
│   │   ├── Date
│   │   └── Montant total
│   └── Mode Détaillé
│       ├── Date
│       ├── Lignes multiples (montant + catégorie)
│       └── Total auto-calculé
│
└── Paramètres
    ├── Informations restaurant
    └── Zone de danger (réinitialisation)
```

## 🏗️ Architecture Technique

### Stack Frontend

```
┌─────────────────────────────────────┐
│         Next.js 14 (App Router)      │
│  ┌─────────────────────────────────┐ │
│  │      React 18 + TypeScript      │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
           │
           ├─── Pages (app/)
           │    ├── dashboard/
           │    ├── revenue/
           │    ├── expense/
           │    ├── settings/
           │    └── setup/
           │
           ├─── Components
           │    ├── ui/ (Button, Input, Card, etc.)
           │    └── layout/ (Navbar, Container)
           │
           ├─── State Management
           │    └── Zustand Store (lib/store.ts)
           │        ├── Restaurant
           │        ├── Revenues
           │        └── Expenses
           │
           └─── Business Logic
                └── Utils (lib/utils.ts)
                    ├── Financial Calculations
                    ├── Date Utilities
                    └── Predictive Analytics
```

### Modèles de Données

#### Restaurant
```typescript
{
  id: string
  name: string
  location: string
  type: 'restaurant' | 'fast_food' | 'cafe' | 'bar' | 'other'
  currency: string
  createdAt: Date
  updatedAt: Date
}
```

#### DailyRevenue
```typescript
{
  id: string
  restaurantId: string
  date: Date
  totalAmount: number
  paymentMethods: RevenuePaymentMethod[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

#### RevenuePaymentMethod
```typescript
{
  id: string
  method: 'wave' | 'orange_money' | 'cash'
  amount: number
}
```

#### DailyExpense
```typescript
{
  id: string
  restaurantId: string
  date: Date
  totalAmount: number
  isDetailed: boolean
  expenseLines?: ExpenseLine[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

#### ExpenseLine
```typescript
{
  id: string
  category: 'rent' | 'salaries' | 'ingredients' | 'utilities' | 'transport' | 'marketing' | 'others'
  amount: number
}
```

## 🔄 Flux de Données

### Saisie d'un Revenu

```
User Input
    │
    ├── Mode Global
    │   ├── Saisie montants par méthode
    │   ├── Calcul auto du total
    │   └── Validation (total > 0)
    │
    └── Mode Détaillé
        ├── Saisie montant total
        ├── Ajout lignes (montant + méthode)
        └── Validation (au moins 1 ligne valide)
    │
    ▼
Validation
    │
    ▼
Create DailyRevenue Object
    │
    ▼
Store.addRevenue()
    │
    ▼
localStorage (Zustand persist)
    │
    ▼
Dashboard Update (automatic)
```

### Calcul des KPIs

```
Filtered Revenues & Expenses
    │
    ├── Total Revenue = sum(revenues.totalAmount)
    ├── Total Expenses = sum(expenses.totalAmount)
    ├── Net Margin = Total Revenue - Total Expenses
    └── Net Margin % = (Net Margin / Total Revenue) * 100
```

### Prédictions

```
Historical Data (last 7/30 days)
    │
    ├── Calculate Daily Averages
    │   ├── Avg Daily Revenue
    │   └── Avg Daily Expenses
    │
    ├── Calculate Remaining Days
    │   ├── Days in Week
    │   └── Days in Month
    │
    └── Predictions
        ├── Predicted Revenue = Avg Daily Revenue × Remaining Days
        ├── Predicted Expenses = Avg Daily Expenses × Remaining Days
        └── Predicted Net Margin = Predicted Revenue - Predicted Expenses
```

## 🎨 Design System

### Couleurs

- **Primary** : Blue (#0ea5e9) - Actions principales, liens
- **Success** : Green (#10b981) - Marges positives, confirmations
- **Error** : Red (#ef4444) - Erreurs, marges négatives
- **Neutral** : Gray scale - Textes, bordures, backgrounds

### Typographie

- **Font Family** : Inter (Google Fonts)
- **Headings** : Bold, 24-32px
- **Body** : Regular, 14-16px
- **Labels** : Medium, 14px

### Composants UI

- **Button** : 4 variants (primary, secondary, outline, ghost)
- **Input** : Avec label et gestion d'erreurs
- **Card** : Container avec padding configurable
- **Select** : Dropdown avec label
- **Textarea** : Zone de texte multi-lignes

## 🔮 Scalabilité V2

### Préparations pour V2

1. **Multi-restaurant**
   - `restaurantId` déjà présent dans tous les modèles
   - Store peut être étendu avec `restaurants: Restaurant[]`
   - Navigation avec sélecteur de restaurant

2. **Stock Management**
   - Nouveau modèle `StockItem`
   - Relation avec `ExpenseLine` (catégorie 'ingredients')
   - Alertes basées sur seuils

3. **Advanced Analytics**
   - Extension de `lib/utils.ts` avec fonctions ML
   - Nouvelles pages d'analytics dédiées
   - Export de données (CSV, PDF)

4. **Backend Integration**
   - API routes Next.js prêtes
   - Types partagés entre frontend/backend
   - Migration progressive depuis localStorage

## 📊 Performance

### Optimisations Actuelles

- **Client-side rendering** : Pas de SSR nécessaire pour MVP
- **LocalStorage** : Persistance rapide, pas de latence réseau
- **Zustand** : State management léger et performant
- **Recharts** : Graphiques optimisés pour React

### Optimisations Futures

- **Lazy loading** : Composants graphiques chargés à la demande
- **Memoization** : Calculs coûteux mis en cache
- **Virtual scrolling** : Pour listes longues de revenus/dépenses
- **Service Worker** : Offline-first pour V2

## 🔒 Sécurité (V1)

- **Données locales** : Stockage dans localStorage (pas de backend)
- **Validation** : Côté client uniquement
- **Pas d'authentification** : Single-user par navigateur

### Sécurité V2 (Backend)

- Authentification JWT
- Validation côté serveur
- Chiffrement des données sensibles
- Rate limiting sur API

## 📱 Responsive Design

- **Mobile First** : Design optimisé pour mobile
- **Breakpoints** : sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation** : Menu adaptatif sur mobile
- **Formulaires** : Optimisés pour saisie tactile

---

**Note** : Cette architecture est conçue pour évoluer progressivement vers V2 tout en restant simple et maintenable pour V1.

