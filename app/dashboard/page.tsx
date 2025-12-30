'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import {
  calculateKPIs,
  calculatePaymentMethodBreakdown,
  generateRevenueTimeSeries,
  getDateRange,
  predictWeekRevenue,
  predictMonthRevenue,
} from '@/lib/utils';
import type { TimeFilter } from '@/types';
import Container from '@/components/layout/Container';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

const PAYMENT_METHOD_COLORS = {
  wave: '#0ea5e9',
  orange_money: '#f97316',
  cash: '#10b981',
};

const PAYMENT_METHOD_LABELS = {
  wave: 'Wave',
  orange_money: 'Orange Money',
  cash: 'Espèces',
};

export default function DashboardPage() {
  const router = useRouter();
  const restaurant = useStore((state) => state.restaurant);
  const revenues = useStore((state) => state.revenues);
  const expenses = useStore((state) => state.expenses);
  const getRevenuesByDateRange = useStore((state) => state.getRevenuesByDateRange);
  const getExpensesByDateRange = useStore((state) => state.getExpensesByDateRange);
  
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this_month');

  useEffect(() => {
    if (!restaurant) {
      router.push('/setup');
    }
  }, [restaurant, router]);

  if (!restaurant) {
    return null;
  }

  const { start, end } = getDateRange(timeFilter);
  const filteredRevenues = getRevenuesByDateRange(start, end);
  const filteredExpenses = getExpensesByDateRange(start, end);
  
  const kpis = calculateKPIs(filteredRevenues, filteredExpenses);
  const paymentBreakdown = calculatePaymentMethodBreakdown(filteredRevenues);
  const timeSeries = generateRevenueTimeSeries(filteredRevenues, filteredExpenses, start, end);
  
  const weekPrediction = predictWeekRevenue(revenues, expenses);
  const monthPrediction = predictMonthRevenue(revenues, expenses);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: restaurant.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Vue d&apos;ensemble de vos finances
          </p>
        </div>

        {/* Time Filter */}
        <div className="mb-6 flex space-x-2">
          {(['today', 'this_week', 'this_month'] as TimeFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(filter)}
            >
              {filter === 'today' && "Aujourd&apos;hui"}
              {filter === 'this_week' && 'Cette semaine'}
              {filter === 'this_month' && 'Ce mois'}
            </Button>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenus totaux</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(kpis.totalRevenue)}
                </p>
              </div>
              <div className="rounded-full bg-primary-100 p-3">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dépenses totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(kpis.totalExpenses)}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Marge nette</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(kpis.netMargin)}
                </p>
              </div>
              <div className={`rounded-full p-3 ${kpis.netMargin >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`h-6 w-6 ${kpis.netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Marge nette (%)</p>
                <p className={`text-2xl font-bold ${kpis.netMarginPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {kpis.netMarginPercentage.toFixed(1)}%
                </p>
              </div>
              <div className={`rounded-full p-3 ${kpis.netMarginPercentage >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <CreditCard className={`h-6 w-6 ${kpis.netMarginPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Time Series */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Évolution des revenus et dépenses
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => format(new Date(label), 'dd MMMM yyyy')}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  name="Revenus"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Dépenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="netMargin" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Marge nette"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Payment Methods Breakdown */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Répartition par méthode de paiement
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {paymentBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PAYMENT_METHOD_COLORS[entry.method]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentBreakdown.map((item) => (
                <div key={item.method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: PAYMENT_METHOD_COLORS[item.method] }}
                    />
                    <span className="text-sm text-gray-700">
                      {PAYMENT_METHOD_LABELS[item.method]}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.amount)}
                    </p>
                    <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Prédiction - Fin de semaine
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Estimations basées sur les données historiques
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenus prévus</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(weekPrediction.predictedRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dépenses prévues</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(weekPrediction.predictedExpenses)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium text-gray-700">Marge nette prévue</span>
                <span className={`text-base font-bold ${weekPrediction.predictedNetMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(weekPrediction.predictedNetMargin)} ({weekPrediction.predictedNetMarginPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Prédiction - Fin de mois
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Estimations basées sur les données historiques
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenus prévus</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(monthPrediction.predictedRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dépenses prévues</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(monthPrediction.predictedExpenses)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium text-gray-700">Marge nette prévue</span>
                <span className={`text-base font-bold ${monthPrediction.predictedNetMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(monthPrediction.predictedNetMargin)} ({monthPrediction.predictedNetMarginPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}

