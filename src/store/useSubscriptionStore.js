import { create } from 'zustand';

const useSubscriptionStore = create((set) => ({
  subscriptions: [],
  isLoading: false,
  error: null,
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  addSubscription: (subscription) => set((state) => ({
    subscriptions: [...state.subscriptions, subscription]
  })),
  removeSubscription: (id) => set((state) => ({
    subscriptions: state.subscriptions.filter(s => s._id !== id)
  })),
  updateSubscription: (id, updated) => set((state) => ({
    subscriptions: state.subscriptions.map(s => s._id === id ? updated : s)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useSubscriptionStore;
