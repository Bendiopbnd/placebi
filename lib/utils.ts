import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';
import type {
  DailyRevenue,
  DailyExpense,
  PaymentMethod,
  FinancialKPIs,
  PaymentMethodBreakdown,
  RevenueTimeSeries,
  Prediction,
  TimeFilter,
} from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ====================================
// DATE UTILITIES
// ====================================

export function getDateRange(filter: TimeFilter): { start: Date; end: Date } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  switch (filter) {
    case 'today':
      return { start: today, end: today };
    case 'this_week':
      return {
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      };
    case 'this_month':
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };
    default:
      return { start: today, end: today };
  }
}

// ====================================
// FINANCIAL CALCULATIONS
// ====================================

export function calculateKPIs(
  revenues: DailyRevenue[],
  expenses: DailyExpense[]
): FinancialKPIs {
  const totalRevenue = revenues.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const netMargin = totalRevenue - totalExpenses;
  const netMarginPercentage = totalRevenue > 0 
    ? (netMargin / totalRevenue) * 100 
    : 0;
  
  return {
    totalRevenue,
    totalExpenses,
    netMargin,
    netMarginPercentage,
  };
}

export function calculatePaymentMethodBreakdown(
  revenues: DailyRevenue[]
): PaymentMethodBreakdown[] {
  const totals: Record<PaymentMethod, number> = {
    wave: 0,
    orange_money: 0,
    cash: 0,
  };
  
  revenues.forEach((revenue) => {
    revenue.paymentMethods.forEach((pm) => {
      totals[pm.method] += pm.amount;
    });
  });
  
  const total = Object.values(totals).reduce((sum, val) => sum + val, 0);
  
  return Object.entries(totals).map(([method, amount]) => ({
    method: method as PaymentMethod,
    amount,
    percentage: total > 0 ? (amount / total) * 100 : 0,
  }));
}

export function generateRevenueTimeSeries(
  revenues: DailyRevenue[],
  expenses: DailyExpense[],
  startDate: Date,
  endDate: Date
): RevenueTimeSeries[] {
  const series: Map<string, { revenue: number; expenses: number }> = new Map();
  
  // Initialize all dates in range
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const key = format(currentDate, 'yyyy-MM-dd');
    series.set(key, { revenue: 0, expenses: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Add revenues
  revenues.forEach((r) => {
    const key = format(new Date(r.date), 'yyyy-MM-dd');
    const existing = series.get(key);
    if (existing) {
      existing.revenue += r.totalAmount;
    }
  });
  
  // Add expenses
  expenses.forEach((e) => {
    const key = format(new Date(e.date), 'yyyy-MM-dd');
    const existing = series.get(key);
    if (existing) {
      existing.expenses += e.totalAmount;
    }
  });
  
  return Array.from(series.entries())
    .map(([date, data]) => ({
      date,
      revenue: data.revenue,
      expenses: data.expenses,
      netMargin: data.revenue - data.expenses,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ====================================
// PREDICTIVE ANALYTICS
// ====================================

export function predictWeekRevenue(
  revenues: DailyRevenue[],
  expenses: DailyExpense[]
): Prediction {
  // Simple moving average approach
  const last7Days = revenues
    .filter((r) => {
      const date = new Date(r.date);
      const weekAgo = subDays(new Date(), 7);
      return date >= weekAgo;
    })
    .slice(0, 7);
  
  const last7DaysExpenses = expenses
    .filter((e) => {
      const date = new Date(e.date);
      const weekAgo = subDays(new Date(), 7);
      return date >= weekAgo;
    })
    .slice(0, 7);
  
  const avgDailyRevenue = last7Days.length > 0
    ? last7Days.reduce((sum, r) => sum + r.totalAmount, 0) / last7Days.length
    : 0;
  
  const avgDailyExpenses = last7DaysExpenses.length > 0
    ? last7DaysExpenses.reduce((sum, e) => sum + e.totalAmount, 0) / last7DaysExpenses.length
    : 0;
  
  const daysRemainingInWeek = 7 - new Date().getDay();
  const predictedRevenue = avgDailyRevenue * daysRemainingInWeek;
  const predictedExpenses = avgDailyExpenses * daysRemainingInWeek;
  const predictedNetMargin = predictedRevenue - predictedExpenses;
  const predictedNetMarginPercentage = predictedRevenue > 0
    ? (predictedNetMargin / predictedRevenue) * 100
    : 0;
  
  // Payment method predictions
  const paymentMethodTotals: Record<PaymentMethod, number> = {
    wave: 0,
    orange_money: 0,
    cash: 0,
  };
  
  last7Days.forEach((r) => {
    r.paymentMethods.forEach((pm) => {
      paymentMethodTotals[pm.method] += pm.amount;
    });
  });
  
  const totalPaymentMethods = Object.values(paymentMethodTotals).reduce((s, v) => s + v, 0);
  const paymentMethodPredictions = Object.entries(paymentMethodTotals).map(([method, amount]) => {
    const percentage = totalPaymentMethods > 0 ? amount / totalPaymentMethods : 0;
    return {
      method: method as PaymentMethod,
      predictedAmount: predictedRevenue * percentage,
    };
  });
  
  return {
    type: 'week',
    predictedRevenue,
    predictedExpenses,
    predictedNetMargin,
    predictedNetMarginPercentage,
    paymentMethodPredictions,
  };
}

export function predictMonthRevenue(
  revenues: DailyRevenue[],
  expenses: DailyExpense[]
): Prediction {
  const last30Days = revenues
    .filter((r) => {
      const date = new Date(r.date);
      const monthAgo = subDays(new Date(), 30);
      return date >= monthAgo;
    })
    .slice(0, 30);
  
  const last30DaysExpenses = expenses
    .filter((e) => {
      const date = new Date(e.date);
      const monthAgo = subDays(new Date(), 30);
      return date >= monthAgo;
    })
    .slice(0, 30);
  
  const avgDailyRevenue = last30Days.length > 0
    ? last30Days.reduce((sum, r) => sum + r.totalAmount, 0) / last30Days.length
    : 0;
  
  const avgDailyExpenses = last30DaysExpenses.length > 0
    ? last30DaysExpenses.reduce((sum, e) => sum + e.totalAmount, 0) / last30DaysExpenses.length
    : 0;
  
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysRemainingInMonth = daysInMonth - today.getDate();
  
  const predictedRevenue = avgDailyRevenue * daysRemainingInMonth;
  const predictedExpenses = avgDailyExpenses * daysRemainingInMonth;
  const predictedNetMargin = predictedRevenue - predictedExpenses;
  const predictedNetMarginPercentage = predictedRevenue > 0
    ? (predictedNetMargin / predictedRevenue) * 100
    : 0;
  
  // Payment method predictions
  const paymentMethodTotals: Record<PaymentMethod, number> = {
    wave: 0,
    orange_money: 0,
    cash: 0,
  };
  
  last30Days.forEach((r) => {
    r.paymentMethods.forEach((pm) => {
      paymentMethodTotals[pm.method] += pm.amount;
    });
  });
  
  const totalPaymentMethods = Object.values(paymentMethodTotals).reduce((s, v) => s + v, 0);
  const paymentMethodPredictions = Object.entries(paymentMethodTotals).map(([method, amount]) => {
    const percentage = totalPaymentMethods > 0 ? amount / totalPaymentMethods : 0;
    return {
      method: method as PaymentMethod,
      predictedAmount: predictedRevenue * percentage,
    };
  });
  
  return {
    type: 'month',
    predictedRevenue,
    predictedExpenses,
    predictedNetMargin,
    predictedNetMarginPercentage,
    paymentMethodPredictions,
  };
}

