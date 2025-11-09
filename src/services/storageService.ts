import { BrowserState, AIState, UserPreferences, Bookmark, HistoryItem } from '@/types';

export class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Browser state storage
  async saveBrowserState(state: Partial<BrowserState>): Promise<void> {
    try {
      const dataToSave = {
        tabs: state.tabs?.slice(0, 10), // Limit to 10 tabs
        activeTabId: state.activeTabId,
        bookmarks: state.bookmarks,
        settings: state.settings,
        sidebarCollapsed: state.sidebarCollapsed,
        rightPanelOpen: state.rightPanelOpen,
      };

      localStorage.setItem('comet-browser-state', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save browser state:', error);
    }
  }

  async loadBrowserState(): Promise<Partial<BrowserState>> {
    try {
      const stored = localStorage.getItem('comet-browser-state');
      if (!stored) return {};

      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load browser state:', error);
      return {};
    }
  }

  // AI state storage
  async saveAIState(state: Partial<AIState>): Promise<void> {
    try {
      const dataToSave = {
        messages: state.messages?.slice(-50), // Keep only last 50 messages
        settings: state.settings,
        agentHistory: state.agentHistory,
      };

      localStorage.setItem('comet-ai-state', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save AI state:', error);
    }
  }

  async loadAIState(): Promise<Partial<AIState>> {
    try {
      const stored = localStorage.getItem('comet-ai-state');
      if (!stored) return {};

      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load AI state:', error);
      return {};
    }
  }

  // User preferences storage
  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      localStorage.setItem('comet-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  async loadPreferences(): Promise<UserPreferences | null> {
    try {
      const stored = localStorage.getItem('comet-preferences');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return null;
    }
  }

  // Bookmarks storage (separate from browser state for easier access)
  async saveBookmarks(bookmarks: Bookmark[]): Promise<void> {
    try {
      localStorage.setItem('comet-bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }

  async loadBookmarks(): Promise<Bookmark[]> {
    try {
      const stored = localStorage.getItem('comet-bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      return [];
    }
  }

  // History storage
  async saveHistory(history: HistoryItem[]): Promise<void> {
    try {
      // Keep only last 1000 history items
      const trimmedHistory = history.slice(0, 1000);
      localStorage.setItem('comet-history', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  async loadHistory(): Promise<HistoryItem[]> {
    try {
      const stored = localStorage.getItem('comet-history');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      const keys = [
        'comet-browser-state',
        'comet-ai-state',
        'comet-preferences',
        'comet-bookmarks',
        'comet-history',
        'comet-agent-history',
      ];

      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  // Export data
  async exportData(): Promise<string> {
    try {
      const data = {
        browserState: await this.loadBrowserState(),
        aiState: await this.loadAIState(),
        preferences: await this.loadPreferences(),
        bookmarks: await this.loadBookmarks(),
        history: await this.loadHistory(),
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  // Import data
  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);

      // Validate data structure
      if (!data.version) {
        throw new Error('Invalid export format');
      }

      // Import each data type
      if (data.browserState) {
        await this.saveBrowserState(data.browserState);
      }

      if (data.aiState) {
        await this.saveAIState(data.aiState);
      }

      if (data.preferences) {
        await this.savePreferences(data.preferences);
      }

      if (data.bookmarks) {
        await this.saveBookmarks(data.bookmarks);
      }

      if (data.history) {
        await this.saveHistory(data.history);
      }

    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  // Get storage usage
  async getStorageUsage(): Promise<{ used: number; available: number; percentage: number }> {
    try {
      let totalSize = 0;
      const keys = Object.keys(localStorage);

      for (const key of keys) {
        if (key.startsWith('comet-')) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += new Blob([value]).size;
          }
        }
      }

      // localStorage typically has ~5MB limit
      const available = 5 * 1024 * 1024; // 5MB in bytes
      const used = totalSize;
      const percentage = (used / available) * 100;

      return { used, available, percentage };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return { used: 0, available: 5 * 1024 * 1024, percentage: 0 };
    }
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();