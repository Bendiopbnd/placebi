import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Restaurant,
  DailyRevenue,
  DailyExpense,
  RevenueFormData,
  ExpenseFormData,
  RestaurantFormData,
  PaymentMethod,
} from '@/types';

interface AppState {
  // Restaurant
  restaurant: Restaurant | null;
  setRestaurant: (restaurant: Restaurant) => void;
  
  // Revenues
  revenues: DailyRevenue[];
  addRevenue: (revenue: DailyRevenue) => void;
  updateRevenue: (id: string, revenue: Partial<DailyRevenue>) => void;
  deleteRevenue: (id: string) => void;
  getRevenuesByDateRange: (startDate: Date, endDate: Date) => DailyRevenue[];
  
  // Expenses
  expenses: DailyExpense[];
  addExpense: (expense: DailyExpense) => void;
  updateExpense: (id: string, expense: Partial<DailyExpense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByDateRange: (startDate: Date, endDate: Date) => DailyExpense[];
  
  // Reset
  resetStore: () => void;
}

const initialState = {
  restaurant: null,
  revenues: [],
  expenses: [],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setRestaurant: (restaurant) => set({ restaurant }),
      
      addRevenue: (revenue) =>
        set((state) => ({
          revenues: [...state.revenues, revenue].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        })),
      
      updateRevenue: (id, updates) =>
        set((state) => ({
          revenues: state.revenues.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
          ),
        })),
      
      deleteRevenue: (id) =>
        set((state) => ({
          revenues: state.revenues.filter((r) => r.id !== id),
        })),
      
      getRevenuesByDateRange: (startDate, endDate) => {
        const { revenues } = get();
        return revenues.filter((r) => {
          const date = new Date(r.date);
          return date >= startDate && date <= endDate;
        });
      },
      
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, expense].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        })),
      
      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date() } : e
          ),
        })),
      
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      
      getExpensesByDateRange: (startDate, endDate) => {
        const { expenses } = get();
        return expenses.filter((e) => {
          const date = new Date(e.date);
          return date >= startDate && date <= endDate;
        });
      },
      
      resetStore: () => set(initialState),
    }),
    {
      name: 'placebi-storage',
      partialize: (state) => ({
        restaurant: state.restaurant,
        revenues: state.revenues.map((r) => ({
          ...r,
          date: r.date instanceof Date ? r.date.toISOString() : r.date,
          createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
          updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : r.updatedAt,
        })),
        expenses: state.expenses.map((e) => ({
          ...e,
          date: e.date instanceof Date ? e.date.toISOString() : e.date,
          createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
          updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert date strings back to Date objects
          state.revenues = state.revenues.map((r: any) => ({
            ...r,
            date: new Date(r.date),
            createdAt: new Date(r.createdAt),
            updatedAt: new Date(r.updatedAt),
          }));
          state.expenses = state.expenses.map((e: any) => ({
            ...e,
            date: new Date(e.date),
            createdAt: new Date(e.createdAt),
            updatedAt: new Date(e.updatedAt),
          }));
          if (state.restaurant) {
            state.restaurant = {
              ...state.restaurant,
              createdAt: new Date(state.restaurant.createdAt),
              updatedAt: new Date(state.restaurant.updatedAt),
            };
          }
        }
      },
    }
  )
);

