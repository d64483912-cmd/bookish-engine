import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences } from '@/types';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  language: 'en',
  fontSize: 'medium',
  animations: true,
  sounds: false,
  notifications: true,
  shortcuts: [
    {
      key: 't',
      ctrlKey: true,
      action: 'newTab',
      description: 'Open new tab',
    },
    {
      key: 'w',
      ctrlKey: true,
      action: 'closeTab',
      description: 'Close current tab',
    },
    {
      key: 'l',
      ctrlKey: true,
      action: 'focusUrlBar',
      description: 'Focus URL bar',
    },
    {
      key: '/',
      action: 'toggleSearch',
      description: 'Toggle search',
    },
    {
      key: 'Escape',
      action: 'toggleAIChat',
      description: 'Toggle AI chat panel',
    },
  ],
};

interface SettingsState {
  preferences: UserPreferences;
  sidebarWidth: number;
  rightPanelWidth: number;
  showDeveloperTools: boolean;
  experimentalFeatures: {
    webviewMode: boolean;
    advancedAI: boolean;
    customAgents: boolean;
  };
}

interface SettingsActions {
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  setSidebarWidth: (width: number) => void;
  setRightPanelWidth: (width: number) => void;
  toggleDeveloperTools: () => void;
  updateExperimentalFeatures: (features: Partial<SettingsState['experimentalFeatures']>) => void;
  addShortcut: (shortcut: UserPreferences['shortcuts'][0]) => void;
  removeShortcut: (action: string) => void;
  updateShortcut: (action: string, shortcut: Partial<UserPreferences['shortcuts'][0]>) => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      // Initial State
      preferences: DEFAULT_PREFERENCES,
      sidebarWidth: 280,
      rightPanelWidth: 400,
      showDeveloperTools: false,
      experimentalFeatures: {
        webviewMode: false,
        advancedAI: false,
        customAgents: false,
      },

      // Actions
      updatePreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        }));
      },

      resetPreferences: () => {
        set({ preferences: DEFAULT_PREFERENCES });
      },

      setSidebarWidth: (width: number) => {
        set({ sidebarWidth: Math.max(200, Math.min(500, width)) });
      },

      setRightPanelWidth: (width: number) => {
        set({ rightPanelWidth: Math.max(300, Math.min(800, width)) });
      },

      toggleDeveloperTools: () => {
        set((state) => ({
          showDeveloperTools: !state.showDeveloperTools,
        }));
      },

      updateExperimentalFeatures: (features) => {
        set((state) => ({
          experimentalFeatures: { ...state.experimentalFeatures, ...features },
        }));
      },

      addShortcut: (shortcut) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            shortcuts: [...state.preferences.shortcuts, shortcut],
          },
        }));
      },

      removeShortcut: (action: string) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            shortcuts: state.preferences.shortcuts.filter(s => s.action !== action),
          },
        }));
      },

      updateShortcut: (action: string, shortcutUpdate) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            shortcuts: state.preferences.shortcuts.map(s =>
              s.action === action
                ? { ...s, ...shortcutUpdate }
                : s
            ),
          },
        }));
      },
    }),
    {
      name: 'comet-settings-storage',
    }
  )
);