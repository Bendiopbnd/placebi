'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Home, TrendingUp, DollarSign, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const restaurant = useStore((state) => state.restaurant);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/revenue', label: 'Revenus', icon: TrendingUp },
    { href: '/expense', label: 'Dépenses', icon: DollarSign },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ];

  if (!restaurant) {
    return null;
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary-600">Placebi</span>
            </Link>
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{restaurant.name}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

