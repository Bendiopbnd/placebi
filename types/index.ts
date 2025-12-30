// ====================================
// DATA MODELS - V1
// ====================================

export type PaymentMethod = 'wave' | 'orange_money' | 'cash';

export type RestaurantType = 'restaurant' | 'fast_food' | 'cafe' | 'bar' | 'other';

export type ExpenseCategory = 
  | 'rent' 
  | 'salaries' 
  | 'ingredients' 
  | 'utilities' 
  | 'transport' 
  | 'marketing' 
  | 'others';

export type TimeFilter = 'today' | 'this_week' | 'this_month' | 'custom';

// ====================================
// RESTAURANT
// ====================================

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  type: RestaurantType;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// ====================================
// REVENUE MODELS
// ====================================

export interface RevenuePaymentMethod {
  id: string;
  method: PaymentMethod;
  amount: number;
}

export interface DailyRevenue {
  id: string;
  restaurantId: string;
  date: Date;
  totalAmount: number;
  paymentMethods: RevenuePaymentMethod[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ====================================
// EXPENSE MODELS
// ====================================

export interface ExpenseLine {
  id: string;
  category: ExpenseCategory;
  amount: number;
}

export interface DailyExpense {
  id: string;
  restaurantId: string;
  date: Date;
  totalAmount: number;
  isDetailed: boolean;
  expenseLines?: ExpenseLine[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ====================================
// DASHBOARD & ANALYTICS
// ====================================

export interface FinancialKPIs {
  totalRevenue: number;
  totalExpenses: number;
  netMargin: number;
  netMarginPercentage: number;
}

export interface PaymentMethodBreakdown {
  method: PaymentMethod;
  amount: number;
  percentage: number;
}

export interface RevenueTimeSeries {
  date: string;
  revenue: number;
  expenses: number;
  netMargin: number;
}

export interface Prediction {
  type: 'week' | 'month';
  predictedRevenue: number;
  predictedExpenses: number;
  predictedNetMargin: number;
  predictedNetMarginPercentage: number;
  paymentMethodPredictions: {
    method: PaymentMethod;
    predictedAmount: number;
  }[];
}

// ====================================
// FORM TYPES
// ====================================

export interface RestaurantFormData {
  name: string;
  location: string;
  type: RestaurantType;
  currency: string;
}

export interface RevenueFormData {
  date: Date;
  totalAmount?: number;
  paymentMethods: {
    method: PaymentMethod;
    amount: number;
  }[];
  notes?: string;
  mode: 'global' | 'detailed';
}

export interface ExpenseFormData {
  date: Date;
  totalAmount?: number;
  isDetailed: boolean;
  expenseLines?: {
    category: ExpenseCategory;
    amount: number;
  }[];
  notes?: string;
}

