import { create } from 'zustand';

const useTransactionStore = create((set) => ({
  transactions: [],
  isLoading: false,
  error: null,
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
  removeTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t._id !== id)
  })),
  updateTransaction: (id, updated) => set((state) => ({
    transactions: state.transactions.map(t => t._id === id ? updated : t)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useTransactionStore;
