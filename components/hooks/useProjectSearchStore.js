import { create } from 'zustand';

const useProjectSearchStore = create((set, get) => ({

  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  packageSearchTerm: '',
  setPackageSearchTerm: (term) => set({ packageSearchTerm: term }),

  // null || false || true
  visibilityFilter: null,
  setVisibilityFilter: (filter) => set({ visibilityFilter: filter }),

  // null || false || true
  auditFilter: null,
  setAuditFilter: (filter) => set({ auditFilter: filter }),

  // null | 'none' | 'any' | 'low' | 'moderate' | 'high' | 'critical'
  vulnerabilityFilter: null,
  setVulnerabilityFilter: (filter) => set({ vulnerabilityFilter: filter }),

  // null | '1week' | '1month' | '1year'
  lastAuditFilter: null,
  setLastAuditFilter: (filter) => set({ lastAuditFilter: filter }),

  selectedPackages: [],
  toggleSelectedPackage: (pkgName) => set((state) => {
    const exists = state.selectedPackages.includes(pkgName);
    if (exists) {
      return { selectedPackages: state.selectedPackages.filter(p => p !== pkgName) };
    } else {
      return { selectedPackages: [...state.selectedPackages, pkgName] };
    }
  }),
  clearSelectedPackages: () => set({ selectedPackages: [] }),

  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),

  // // You can add more state properties and actions here
  // message: "Hello from Zustand!",
  // setMessage: (newMessage) => set({ message: newMessage }),

}));

export default useProjectSearchStore;