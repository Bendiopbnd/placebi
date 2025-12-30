'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Container from '@/components/layout/Container';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Settings as SettingsIcon, Trash2, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const restaurant = useStore((state) => state.restaurant);
  const resetStore = useStore((state) => state.resetStore);

  useEffect(() => {
    if (!restaurant) {
      router.push('/setup');
    }
  }, [restaurant, router]);

  if (!restaurant) {
    return null;
  }

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
      resetStore();
      router.push('/setup');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
          <p className="text-gray-600">
            Gérez les paramètres de votre restaurant
          </p>
        </div>

        <div className="space-y-6">
          {/* Restaurant Info */}
          <Card padding="lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="rounded-full bg-primary-100 p-2">
                <SettingsIcon className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Informations du restaurant</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <p className="text-base text-gray-900">{restaurant.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                <p className="text-base text-gray-900">{restaurant.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <p className="text-base text-gray-900 capitalize">{restaurant.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                <p className="text-base text-gray-900">{restaurant.currency}</p>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card padding="lg" className="border-red-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Zone de danger</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  Réinitialiser toutes les données
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Cette action supprimera toutes les données de revenus, dépenses et le profil du restaurant.
                  Cette action est irréversible.
                </p>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Réinitialiser toutes les données
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}

