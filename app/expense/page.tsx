'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import type { ExpenseFormData, ExpenseCategory } from '@/types';
import Container from '@/components/layout/Container';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { format } from 'date-fns';
import { Plus, Trash2, DollarSign } from 'lucide-react';

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'rent', label: 'Loyer' },
  { value: 'salaries', label: 'Salaires' },
  { value: 'ingredients', label: 'Ingrédients' },
  { value: 'utilities', label: 'Services publics (eau, électricité)' },
  { value: 'transport', label: 'Transport' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'others', label: 'Autres' },
];

export default function ExpensePage() {
  const router = useRouter();
  const restaurant = useStore((state) => state.restaurant);
  const addExpense = useStore((state) => state.addExpense);
  
  const [isDetailed, setIsDetailed] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: new Date(),
    totalAmount: undefined,
    isDetailed: false,
    expenseLines: [{ category: 'ingredients', amount: 0 }],
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!restaurant) {
      router.push('/setup');
    }
  }, [restaurant, router]);

  if (!restaurant) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: restaurant.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalFromExpenseLines = () => {
    if (!formData.expenseLines) return 0;
    return formData.expenseLines.reduce((sum, line) => sum + (line.amount || 0), 0);
  };

  const handleModeChange = (detailed: boolean) => {
    setIsDetailed(detailed);
    setFormData({
      ...formData,
      isDetailed: detailed,
      totalAmount: detailed ? undefined : calculateTotalFromExpenseLines(),
    });
  };

  const handleExpenseLineChange = (index: number, field: 'category' | 'amount', value: ExpenseCategory | number) => {
    if (!formData.expenseLines) return;
    
    const newExpenseLines = [...formData.expenseLines];
    newExpenseLines[index] = {
      ...newExpenseLines[index],
      [field]: value,
    };
    
    setFormData({
      ...formData,
      expenseLines: newExpenseLines,
      totalAmount: !isDetailed ? calculateTotalFromExpenseLines() : formData.totalAmount,
    });
  };

  const handleAddExpenseLine = () => {
    setFormData({
      ...formData,
      expenseLines: [
        ...(formData.expenseLines || []),
        { category: 'ingredients', amount: 0 },
      ],
    });
  };

  const handleRemoveExpenseLine = (index: number) => {
    if (!formData.expenseLines || formData.expenseLines.length <= 1) return;
    const newExpenseLines = formData.expenseLines.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      expenseLines: newExpenseLines,
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isDetailed) {
      if (!formData.totalAmount || formData.totalAmount <= 0) {
        newErrors.totalAmount = 'Le montant total est requis';
      }
    } else {
      if (!formData.expenseLines || formData.expenseLines.length === 0) {
        newErrors.expenseLines = 'Au moins une ligne de dépense est requise';
      } else {
        const hasValidLine = formData.expenseLines.some((line) => line.amount > 0);
        if (!hasValidLine) {
          newErrors.expenseLines = 'Au moins une ligne avec un montant est requise';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const totalAmount = isDetailed
        ? calculateTotalFromExpenseLines()
        : formData.totalAmount!;

      // Filter out zero amounts in detailed mode
      const expenseLines = isDetailed && formData.expenseLines
        ? formData.expenseLines.filter((line) => line.amount > 0).map((line, index) => ({
            id: `exp_${Date.now()}_${index}`,
            category: line.category,
            amount: line.amount,
          }))
        : undefined;

      const expense = {
        id: `exp_${Date.now()}`,
        restaurantId: restaurant.id,
        date: formData.date,
        totalAmount,
        isDetailed,
        expenseLines,
        notes: formData.notes || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addExpense(expense);

      // Reset form
      setFormData({
        date: new Date(),
        totalAmount: undefined,
        isDetailed: false,
        expenseLines: [{ category: 'ingredients', amount: 0 }],
        notes: '',
      });
      setIsDetailed(false);
      setErrors({});

      // Show success message
      alert('Dépense enregistrée avec succès!');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enregistrer une dépense</h1>
          <p className="text-gray-600">
            Saisissez les dépenses quotidiennes de votre restaurant
          </p>
        </div>

        <Card padding="lg">
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Comment souhaitez-vous enregistrer cette dépense ?
            </label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={!isDetailed ? 'primary' : 'outline'}
                onClick={() => handleModeChange(false)}
                className="flex-1"
              >
                Dépense globale
              </Button>
              <Button
                type="button"
                variant={isDetailed ? 'primary' : 'outline'}
                onClick={() => handleModeChange(true)}
                className="flex-1"
              >
                Répartition par catégorie
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {!isDetailed
                ? 'Saisissez simplement le montant total de la dépense'
                : 'Décomposez la dépense par catégorie (loyer, salaires, ingrédients, etc.)'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <Input
              type="date"
              label="Date"
              value={format(formData.date, 'yyyy-MM-dd')}
              onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
              required
            />

            {!isDetailed ? (
              <>
                {/* Global Mode: Total Amount */}
                <Input
                  type="number"
                  label="Montant total"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={formData.totalAmount || ''}
                  onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || undefined })}
                  error={errors.totalAmount}
                  required
                />
              </>
            ) : (
              <>
                {/* Detailed Mode: Expense Lines */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Lignes de dépenses par catégorie
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddExpenseLine}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.expenseLines?.map((line, index) => (
                      <div key={index} className="flex items-end space-x-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            label="Montant"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            value={line.amount || ''}
                            onChange={(e) => handleExpenseLineChange(index, 'amount', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Catégorie
                          </label>
                          <select
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={line.category}
                            onChange={(e) => handleExpenseLineChange(index, 'category', e.target.value as ExpenseCategory)}
                          >
                            {EXPENSE_CATEGORIES.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {formData.expenseLines && formData.expenseLines.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveExpenseLine(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.expenseLines && (
                    <p className="mt-2 text-sm text-red-600">{errors.expenseLines}</p>
                  )}
                </div>

                {/* Auto-sum */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total calculé</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(calculateTotalFromExpenseLines())}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            <Textarea
              label="Notes (optionnel)"
              placeholder="Ajoutez des notes sur cette dépense..."
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />

            {/* Submit */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <DollarSign className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer la dépense'}
              </Button>
            </div>
          </form>
        </Card>
      </Container>
    </div>
  );
}

