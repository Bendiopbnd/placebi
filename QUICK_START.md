# Guide de Démarrage Rapide - Placebi

## 🚀 Installation en 3 étapes

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

### 3. Ouvrir dans le navigateur

Rendez-vous sur [http://localhost:3000](http://localhost:3000)

---

## 📝 Première Utilisation

### Étape 1 : Configuration du Restaurant

1. À l'ouverture, vous serez redirigé vers la page de configuration
2. Remplissez les informations :
   - Nom du restaurant
   - Localisation
   - Type de restaurant
   - Devise (XOF par défaut pour l'Afrique de l'Ouest)

### Étape 2 : Enregistrer vos Premiers Revenus

1. Cliquez sur "Revenus" dans la navigation
2. Choisissez le mode :
   - **Mode Global** : Saisissez le total et répartissez par méthode de paiement
   - **Mode Détaillé** : Ajoutez plusieurs lignes de revenus
3. Sélectionnez la date (aujourd'hui par défaut)
4. Cliquez sur "Enregistrer le revenu"

### Étape 3 : Enregistrer vos Premières Dépenses

1. Cliquez sur "Dépenses" dans la navigation
2. Choisissez le mode :
   - **Dépense globale** : Saisissez simplement le montant total
   - **Répartition par catégorie** : Décomposez par catégorie (loyer, salaires, etc.)
3. Sélectionnez la date
4. Cliquez sur "Enregistrer la dépense"

### Étape 4 : Consulter le Dashboard

1. Retournez sur le Dashboard
2. Visualisez vos KPIs (Revenus, Dépenses, Marge nette)
3. Explorez les graphiques :
   - Évolution des revenus et dépenses
   - Répartition par méthode de paiement
4. Consultez les prédictions pour la fin de semaine et de mois

---

## 💡 Conseils d'Utilisation

### Saisie Rapide Quotidienne

- Utilisez le **Mode Global** pour les revenus si vous connaissez déjà le total
- Le total se calcule automatiquement à partir des méthodes de paiement
- Les notes sont optionnelles mais utiles pour le contexte

### Gestion des Dépenses

- Utilisez le **Mode Global** pour les dépenses simples (ex: loyer mensuel)
- Utilisez le **Mode Détaillé** pour les dépenses complexes (ex: courses avec plusieurs catégories)

### Analyse des Données

- Changez les filtres temporels (Aujourd'hui, Cette semaine, Ce mois) pour voir différentes périodes
- Les prédictions s'améliorent avec plus de données historiques
- Consultez régulièrement le dashboard pour suivre votre rentabilité

---

## 🔧 Dépannage

### Les données ne s'affichent pas

- Vérifiez que vous avez bien enregistré des revenus et/ou dépenses
- Assurez-vous que les dates correspondent aux filtres sélectionnés
- Rafraîchissez la page si nécessaire

### Erreur lors de l'enregistrement

- Vérifiez que tous les champs requis sont remplis
- Assurez-vous que les montants sont positifs
- En mode global (revenus), vérifiez que la somme des méthodes de paiement est > 0

### Réinitialiser les données

1. Allez dans "Paramètres"
2. Cliquez sur "Réinitialiser toutes les données"
3. Confirmez l'action

⚠️ **Attention** : Cette action est irréversible !

---

## 📱 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (dernières versions)
- **Mobile** : Responsive, optimisé pour mobile
- **Stockage** : Données stockées localement dans le navigateur (localStorage)

---

## 🆘 Support

Pour toute question ou problème :
1. Consultez la documentation complète dans `README.md`
2. Vérifiez l'architecture dans `ARCHITECTURE.md`
3. Consultez la roadmap V2 dans `ROADMAP_V2.md`

---

**Bon usage de Placebi ! 🎉**

