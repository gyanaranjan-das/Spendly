import { create } from 'zustand';

const useBudgetStore = create((set) => ({
  budgets: [],
  isLoading: false,
  error: null,
  setBudgets: (budgets) => set({ budgets }),
  addBudget: (budget) => set((state) => ({ budgets: [...state.budgets, budget] })),
  removeBudget: (id) => set((state) => ({
    budgets: state.budgets.filter(b => b._id !== id)
  })),
  updateBudget: (id, updated) => set((state) => ({
    budgets: state.budgets.map(b => b._id === id ? updated : b)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useBudgetStore;
