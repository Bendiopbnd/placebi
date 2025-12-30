'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import type { RevenueFormData, PaymentMethod } from '@/types';
import Container from '@/components/layout/Container';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { format } from 'date-fns';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'wave', label: 'Wave' },
  { value: 'orange_money', label: 'Orange Money' },
  { value: 'cash', label: 'Espèces' },
];

export default function RevenuePage() {
  const router = useRouter();
  const restaurant = useStore((state) => state.restaurant);
  const addRevenue = useStore((state) => state.addRevenue);
  
  const [mode, setMode] = useState<'global' | 'detailed'>('global');
  const [formData, setFormData] = useState<RevenueFormData>({
    date: new Date(),
    totalAmount: undefined,
    paymentMethods: [
      { method: 'wave', amount: 0 },
      { method: 'orange_money', amount: 0 },
      { method: 'cash', amount: 0 },
    ],
    notes: '',
    mode: 'global',
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

  const calculateTotalFromPaymentMethods = () => {
    return formData.paymentMethods.reduce((sum, pm) => sum + (pm.amount || 0), 0);
  };

  const handleModeChange = (newMode: 'global' | 'detailed') => {
    setMode(newMode);
    setFormData({
      ...formData,
      mode: newMode,
      totalAmount: newMode === 'global' ? calculateTotalFromPaymentMethods() : undefined,
    });
  };

  const handlePaymentMethodChange = (index: number, amount: number) => {
    const newPaymentMethods = [...formData.paymentMethods];
    newPaymentMethods[index] = { ...newPaymentMethods[index], amount };
    
    setFormData({
      ...formData,
      paymentMethods: newPaymentMethods,
      totalAmount: mode === 'global' ? calculateTotalFromPaymentMethods() : formData.totalAmount,
    });
  };

  const handleAddDetailedLine = () => {
    setFormData({
      ...formData,
      paymentMethods: [
        ...formData.paymentMethods,
        { method: 'cash', amount: 0 },
      ],
    });
  };

  const handleRemoveDetailedLine = (index: number) => {
    if (formData.paymentMethods.length <= 1) return;
    const newPaymentMethods = formData.paymentMethods.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      paymentMethods: newPaymentMethods,
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'global') {
      const totalFromMethods = calculateTotalFromPaymentMethods();
      if (totalFromMethods <= 0) {
        newErrors.paymentMethods = 'Le total des méthodes de paiement doit être supérieur à 0';
      }
    } else {
      if (!formData.totalAmount || formData.totalAmount <= 0) {
        newErrors.totalAmount = 'Le montant total est requis';
      }
      const hasValidLine = formData.paymentMethods.some((pm) => pm.amount > 0);
      if (!hasValidLine) {
        newErrors.paymentMethods = 'Au moins une ligne avec un montant est requise';
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
      const totalAmount = mode === 'global' 
        ? calculateTotalFromPaymentMethods()
        : formData.totalAmount!;

      // Filter out zero amounts in detailed mode
      const paymentMethods = mode === 'global'
        ? formData.paymentMethods.filter((pm) => pm.amount > 0)
        : formData.paymentMethods.filter((pm) => pm.amount > 0);

      const revenue = {
        id: `rev_${Date.now()}`,
        restaurantId: restaurant.id,
        date: formData.date,
        totalAmount,
        paymentMethods: paymentMethods.map((pm, index) => ({
          id: `pm_${Date.now()}_${index}`,
          method: pm.method,
          amount: pm.amount,
        })),
        notes: formData.notes || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addRevenue(revenue);

      // Reset form
      setFormData({
        date: new Date(),
        totalAmount: undefined,
        paymentMethods: [
          { method: 'wave', amount: 0 },
          { method: 'orange_money', amount: 0 },
          { method: 'cash', amount: 0 },
        ],
        notes: '',
        mode: 'global',
      });
      setMode('global');
      setErrors({});

      // Show success message (you could add a toast here)
      alert('Revenu enregistré avec succès!');
    } catch (error) {
      console.error('Error adding revenue:', error);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enregistrer un revenu</h1>
          <p className="text-gray-600">
            Saisissez les revenus quotidiens de votre restaurant
          </p>
        </div>

        <Card padding="lg">
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Mode de saisie
            </label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={mode === 'global' ? 'primary' : 'outline'}
                onClick={() => handleModeChange('global')}
                className="flex-1"
              >
                Mode Global
              </Button>
              <Button
                type="button"
                variant={mode === 'detailed' ? 'primary' : 'outline'}
                onClick={() => handleModeChange('detailed')}
                className="flex-1"
              >
                Mode Détaillé
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {mode === 'global'
                ? 'Saisissez le total et répartissez par méthode de paiement'
                : 'Ajoutez plusieurs lignes de revenus avec leurs méthodes de paiement'}
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

            {mode === 'global' ? (
              <>
                {/* Global Mode: Payment Methods */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Répartition par méthode de paiement
                  </label>
                  <div className="space-y-3">
                    {formData.paymentMethods.map((pm, index) => {
                      const methodLabel = PAYMENT_METHODS.find((m) => m.value === pm.method)?.label || pm.method;
                      return (
                        <div key={index}>
                          <Input
                            type="number"
                            label={methodLabel}
                            placeholder="0"
                            min="0"
                            step="0.01"
                            value={pm.amount || ''}
                            onChange={(e) => handlePaymentMethodChange(index, parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {errors.paymentMethods && (
                    <p className="mt-2 text-sm text-red-600">{errors.paymentMethods}</p>
                  )}
                </div>

                {/* Total (auto-calculated) */}
                <div className="rounded-lg bg-primary-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="text-xl font-bold text-primary-700">
                      {formatCurrency(calculateTotalFromPaymentMethods())}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Detailed Mode: Total Amount */}
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

                {/* Detailed Lines */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Lignes de revenus
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddDetailedLine}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.paymentMethods.map((pm, index) => (
                      <div key={index} className="flex items-end space-x-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            label="Montant"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            value={pm.amount || ''}
                            onChange={(e) => handlePaymentMethodChange(index, parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex-1">
                          <select
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={pm.method}
                            onChange={(e) => {
                              const newPaymentMethods = [...formData.paymentMethods];
                              newPaymentMethods[index] = { ...newPaymentMethods[index], method: e.target.value as PaymentMethod };
                              setFormData({ ...formData, paymentMethods: newPaymentMethods });
                            }}
                          >
                            {PAYMENT_METHODS.map((method) => (
                              <option key={method.value} value={method.value}>
                                {method.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {formData.paymentMethods.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDetailedLine(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.paymentMethods && (
                    <p className="mt-2 text-sm text-red-600">{errors.paymentMethods}</p>
                  )}
                </div>

                {/* Auto-sum */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total calculé</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(calculateTotalFromPaymentMethods())}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            <Textarea
              label="Notes (optionnel)"
              placeholder="Ajoutez des notes sur ce revenu..."
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
                <TrendingUp className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer le revenu'}
              </Button>
            </div>
          </form>
        </Card>
      </Container>
    </div>
  );
}

