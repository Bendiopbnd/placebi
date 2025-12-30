'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import type { RestaurantFormData, RestaurantType } from '@/types';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Store } from 'lucide-react';

const RESTAURANT_TYPES: { value: RestaurantType; label: string }[] = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'fast_food', label: 'Fast Food' },
  { value: 'cafe', label: 'Café' },
  { value: 'bar', label: 'Bar' },
  { value: 'other', label: 'Autre' },
];

const CURRENCIES = [
  { value: 'XOF', label: 'Franc CFA (XOF)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar US (USD)' },
  { value: 'XAF', label: 'Franc CFA BEAC (XAF)' },
];

export default function SetupPage() {
  const router = useRouter();
  const setRestaurant = useStore((state) => state.setRestaurant);
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    location: '',
    type: 'restaurant',
    currency: 'XOF',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RestaurantFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RestaurantFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du restaurant est requis';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'La localisation est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const restaurant = {
      id: `rest_${Date.now()}`,
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRestaurant(restaurant);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <Container maxWidth="md">
        <Card padding="lg">
          <div className="flex items-center justify-center mb-8">
            <div className="rounded-full bg-primary-100 p-3">
              <Store className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Configuration de votre restaurant
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Commencez par créer le profil de votre restaurant
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nom du restaurant"
              placeholder="Ex: Le Bon Goût"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />

            <Input
              label="Localisation"
              placeholder="Ex: Dakar, Sénégal"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={errors.location}
              required
            />

            <Select
              label="Type de restaurant"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as RestaurantType })}
            >
              {RESTAURANT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>

            <Select
              label="Devise"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </Select>

            <Button type="submit" size="lg" className="w-full">
              Créer mon restaurant
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  );
}

