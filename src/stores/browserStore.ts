import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BrowserState, Tab, Bookmark, HistoryItem, Download, BrowserSettings } from '@/types';

const DEFAULT_SETTINGS: BrowserSettings = {
  defaultSearchEngine: 'google',
  homepage: 'https://www.google.com',
  theme: 'dark',
  language: 'en',
  cookieSettings: 'block_third_party',
  trackingProtection: true,
  autocompleteEnabled: true,
  downloadsPath: '~/Downloads',
};

interface BrowserActions {
  // Tab Management
  createTab: (url?: string) => void;
  closeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<Tab>) => void;
  pinTab: (tabId: string) => void;
  unpinTab: (tabId: string) => void;

  // Navigation
  navigateTo: (url: string, tabId?: string) => void;
  goBack: (tabId?: string) => void;
  goForward: (tabId?: string) => void;
  refreshTab: (tabId?: string) => void;
  stopLoading: (tabId?: string) => void;

  // Bookmarks
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (bookmarkId: string) => void;
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => void;

  // History
  addHistoryEntry: (entry: Omit<HistoryItem, 'id' | 'visitCount' | 'lastVisited'>) => void;
  clearHistory: () => void;
  removeHistoryEntry: (historyId: string) => void;

  // Downloads
  addDownload: (download: Omit<Download, 'id' | 'progress' | 'status' | 'startTime'>) => void;
  updateDownload: (downloadId: string, updates: Partial<Download>) => void;
  removeDownload: (downloadId: string) => void;
  clearDownloads: () => void;

  // UI State
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
  toggleBookmarks: () => void;
  toggleHistory: () => void;
  toggleDownloads: () => void;

  // Settings
  updateSettings: (settings: Partial<BrowserSettings>) => void;
  resetSettings: () => void;

  // Utility
  getActiveTab: () => Tab | undefined;
  getTabById: (tabId: string) => Tab | undefined;
  getActiveTabId: () => string;
}

const createNewTab = (url?: string): Tab => {
  const id = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return {
    id,
    url: url || 'about:blank',
    title: url ? 'New Tab' : 'Blank Page',
    favicon: '',
    loading: false,
    canGoBack: false,
    canGoForward: false,
    isPinned: false,
    lastAccessed: Date.now(),
  };
};

export const useBrowserStore = create<BrowserState & BrowserActions>()(
  persist(
    (set, get) => ({
      // Initial State
      tabs: [createNewTab()],
      activeTabId: '',
      navigationHistory: [],
      bookmarks: [],
      history: [],
      downloads: [],
      sidebarCollapsed: false,
      rightPanelOpen: false,
      bookmarksExpanded: true,
      historyExpanded: false,
      downloadsExpanded: false,
      settings: DEFAULT_SETTINGS,
      loading: false,
      urlLoading: false,
      downloadsLoading: false,

      // Tab Management
      createTab: (url?: string) => {
        const newTab = createNewTab(url);
        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id,
        }));
      },

      closeTab: (tabId: string) => {
        set((state) => {
          const newTabs = state.tabs.filter(tab => tab.id !== tabId);
          const newActiveTabId = state.activeTabId === tabId
            ? (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : '')
            : state.activeTabId;

          return {
            tabs: newTabs,
            activeTabId: newActiveTabId,
          };
        });
      },

      switchTab: (tabId: string) => {
        set((state) => ({
          activeTabId: tabId,
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? { ...tab, lastAccessed: Date.now() }
              : tab
          ),
        }));
      },

      updateTab: (tabId: string, updates: Partial<Tab>) => {
        set((state) => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? { ...tab, ...updates }
              : tab
          ),
        }));
      },

      pinTab: (tabId: string) => {
        set((state) => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? { ...tab, isPinned: true }
              : tab
          ),
        }));
      },

      unpinTab: (tabId: string) => {
        set((state) => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? { ...tab, isPinned: false }
              : tab
          ),
        }));
      },

      // Navigation
      navigateTo: (url: string, tabId?: string) => {
        const targetTabId = tabId || get().activeTabId;
        if (!targetTabId) return;

        set((state) => ({
          tabs: state.tabs.map(tab =>
            tab.id === targetTabId
              ? { ...tab, url, loading: true, title: 'Loading...' }
              : tab
          ),
          urlLoading: true,
        }));

        // Simulate page loading completion
        setTimeout(() => {
          const state = get();
          const tab = state.tabs.find(t => t.id === targetTabId);
          if (tab) {
            set((prevState) => ({
              tabs: prevState.tabs.map(t =>
                t.id === targetTabId
                  ? {
                      ...t,
                      loading: false,
                      title: getDomainFromUrl(url) || 'New Tab',
                      favicon: `https://www.google.com/s2/favicons?domain=${getDomainFromUrl(url)}`,
                      canGoBack: true,
                    }
                  : t
              ),
              urlLoading: false,
            }));
          }
        }, 1000);
      },

      goBack: (tabId?: string) => {
        const targetTabId = tabId || get().activeTabId;
        // Implementation would need actual navigation history
        console.log('Going back in tab:', targetTabId);
      },

      goForward: (tabId?: string) => {
        const targetTabId = tabId || get().activeTabId;
        console.log('Going forward in tab:', targetTabId);
      },

      refreshTab: (tabId?: string) => {
        const targetTabId = tabId || get().activeTabId;
        if (!targetTabId) return;

        set((state) => {
          const tab = state.tabs.find(t => t.id === targetTabId);
          if (!tab) return state;

          return {
            tabs: state.tabs.map(t =>
              t.id === targetTabId
                ? { ...t, loading: true }
                : t
            ),
          };
        });

        // Simulate refresh completion
        setTimeout(() => {
          set((state) => ({
            tabs: state.tabs.map(t =>
              t.id === targetTabId
                ? { ...t, loading: false }
                : t
            ),
          }));
        }, 1000);
      },

      stopLoading: (tabId?: string) => {
        const targetTabId = tabId || get().activeTabId;
        if (!targetTabId) return;

        set((state) => ({
          tabs: state.tabs.map(tab =>
            tab.id === targetTabId
              ? { ...tab, loading: false }
              : tab
          ),
          urlLoading: false,
        }));
      },

      // Bookmarks
      addBookmark: (bookmark) => {
        const newBookmark: Bookmark = {
          ...bookmark,
          id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
        };
        set((state) => ({
          bookmarks: [...state.bookmarks, newBookmark],
        }));
      },

      removeBookmark: (bookmarkId: string) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter(b => b.id !== bookmarkId),
        }));
      },

      updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => {
        set((state) => ({
          bookmarks: state.bookmarks.map(bookmark =>
            bookmark.id === bookmarkId
              ? { ...bookmark, ...updates }
              : bookmark
          ),
        }));
      },

      // History
      addHistoryEntry: (entry) => {
        const newHistoryEntry: HistoryItem = {
          ...entry,
          id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          visitCount: 1,
          lastVisited: Date.now(),
        };
        set((state) => {
          const existingEntry = state.history.find(h => h.url === entry.url);
          if (existingEntry) {
            return {
              history: state.history.map(h =>
                h.url === entry.url
                  ? {
                      ...h,
                      visitCount: h.visitCount + 1,
                      lastVisited: Date.now(),
                    }
                  : h
              ),
            };
          }
          return {
            history: [newHistoryEntry, ...state.history].slice(0, 1000), // Keep last 1000 entries
          };
        });
      },

      clearHistory: () => {
        set({ history: [] });
      },

      removeHistoryEntry: (historyId: string) => {
        set((state) => ({
          history: state.history.filter(h => h.id !== historyId),
        }));
      },

      // Downloads
      addDownload: (download) => {
        const newDownload: Download = {
          ...download,
          id: `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          progress: 0,
          status: 'pending',
          startTime: Date.now(),
        };
        set((state) => ({
          downloads: [newDownload, ...state.downloads],
        }));
      },

      updateDownload: (downloadId: string, updates: Partial<Download>) => {
        set((state) => ({
          downloads: state.downloads.map(download =>
            download.id === downloadId
              ? { ...download, ...updates }
              : download
          ),
        }));
      },

      removeDownload: (downloadId: string) => {
        set((state) => ({
          downloads: state.downloads.filter(d => d.id !== downloadId),
        }));
      },

      clearDownloads: () => {
        set({ downloads: [] });
      },

      // UI State
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      toggleRightPanel: () => {
        set((state) => ({ rightPanelOpen: !state.rightPanelOpen }));
      },

      setRightPanelOpen: (open: boolean) => {
        set({ rightPanelOpen: open });
      },

      toggleBookmarks: () => {
        set((state) => ({ bookmarksExpanded: !state.bookmarksExpanded }));
      },

      toggleHistory: () => {
        set((state) => ({ historyExpanded: !state.historyExpanded }));
      },

      toggleDownloads: () => {
        set((state) => ({ downloadsExpanded: !state.downloadsExpanded }));
      },

      // Settings
      updateSettings: (settings: Partial<BrowserSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
      },

      // Utility
      getActiveTab: () => {
        const state = get();
        return state.tabs.find(tab => tab.id === state.activeTabId);
      },

      getTabById: (tabId: string) => {
        return get().tabs.find(tab => tab.id === tabId);
      },

      getActiveTabId: () => {
        return get().activeTabId;
      },
    }),
    {
      name: 'comet-browser-storage',
      partialize: (state) => ({
        settings: state.settings,
        bookmarks: state.bookmarks,
        history: state.history,
        activeTabId: state.activeTabId,
        tabs: state.tabs.slice(0, 10), // Only persist first 10 tabs
      }),
    }
  )
);

// Utility function
const getDomainFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
};