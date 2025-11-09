export interface Tab {
  id: string;
  url: string;
  title: string;
  favicon: string;
  loading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isPinned: boolean;
  lastAccessed: number;
  groupId?: string;
}

export interface NavigationEntry {
  id: string;
  tabId: string;
  url: string;
  title: string;
  timestamp: number;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  favicon: string;
  folder?: string;
  createdAt: number;
  tags?: string[];
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  favicon: string;
  visitCount: number;
  lastVisited: number;
}

export interface Download {
  id: string;
  url: string;
  filename: string;
  size: number;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';
  startTime: number;
  endTime?: number;
  filePath?: string;
}

export interface BrowserSettings {
  defaultSearchEngine: 'google' | 'duckduckgo' | 'bing';
  homepage: string;
  theme: 'dark' | 'light';
  language: string;
  cookieSettings: 'allow_all' | 'block_third_party' | 'block_all';
  trackingProtection: boolean;
  autocompleteEnabled: boolean;
  downloadsPath: string;
}

export interface BrowserState {
  // Tab Management
  tabs: Tab[];
  activeTabId: string;

  // Navigation State
  navigationHistory: NavigationEntry[];
  bookmarks: Bookmark[];
  history: HistoryItem[];
  downloads: Download[];

  // UI State
  sidebarCollapsed: boolean;
  rightPanelOpen: boolean;
  bookmarksExpanded: boolean;
  historyExpanded: boolean;
  downloadsExpanded: boolean;

  // Settings
  settings: BrowserSettings;

  // Loading states
  loading: boolean;
  urlLoading: boolean;
  downloadsLoading: boolean;
}