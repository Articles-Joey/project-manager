import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get, store) => ({

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },

      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      sensitiveMode: false,
      toggleSensitiveMode: () => set({ sensitiveMode: !get().sensitiveMode }),

      infoModal: false,
      setInfoModal: (value) => set({ infoModal: value }),
      toggleInfoModal: () => set({ infoModal: !get().infoModal }),

      loginInfoModal: false,
      setLoginInfoModal: (value) => set({ loginInfoModal: value }),
      toggleLoginInfoModal: () => set({ loginInfoModal: !get().loginInfoModal }),

      showSettingsModal: false,
      setShowSettingsModal: (value) => set({ showSettingsModal: value }),
      toggleSettingsModal: () => set({ showSettingsModal: !get().showSettingsModal }),

      settingsTab: 'UI',
      setSettingsTab: (value) => set({ settingsTab: value }),

      showCreditsModal: false,
      setShowCreditsModal: (value) => set({ showCreditsModal: value }),
      toggleCreditsModal: () => set({ showCreditsModal: !get().showCreditsModal }),

      devDebug: false,
      setDevDebug: (value) => set({ devDebug: value }),
      toggleDevDebug: () => set({ devDebug: !get().devDebug }),

      sidebar: true,
      setSidebar: (value) => set({ sidebar: value }),
      toggleSidebar: () => set({ sidebar: !get().sidebar }),

      metadataKey: null,
      setMetadataKey: (value) => set({ metadataKey: value }),

      additionalFolderLocations: [],
      setAdditionalFolderLocations: (value) => set({ additionalFolderLocations: value }),

      activeProject: null,
      setActiveProject: (value) => set({ activeProject: value }),

    }),
    {
      name: 'project-manager-storage', // name of the item in the storage (must be unique)
      version: 3,
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
      partialize: (state) => ({
        // only persist these parts of the state
        darkMode: state.darkMode,
        sensitiveMode: state.sensitiveMode,
        additionalFolderLocations: state.additionalFolderLocations,
        metadataKey: state.metadataKey,
        settingsTab: state.settingsTab,
        sidebar: state.sidebar,
      }),
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)