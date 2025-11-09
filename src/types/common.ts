// Common types used across the application

export type Theme = 'dark' | 'light' | 'auto';
export type ViewMode = 'browser' | 'ai' | 'split';
export type Device = 'mobile' | 'tablet' | 'desktop';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Position, Size {}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: string;
  description: string;
}

export interface UserPreferences {
  theme: Theme;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  sounds: boolean;
  notifications: boolean;
  shortcuts: KeyboardShortcut[];
}

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
}

export interface TooltipProps extends ComponentProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends ComponentProps {
  type?: 'text' | 'password' | 'email' | 'url' | 'search';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  icon?: React.ReactNode;
  onChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, public statusCode?: number) {
    super(message, 'NETWORK_ERROR', statusCode || 500);
    this.name = 'NetworkError';
  }
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event types
export interface BrowserEvent {
  type: string;
  timestamp: number;
  data?: any;
}

export interface TabEvent extends BrowserEvent {
  tabId: string;
}

export interface NavigationEvent extends TabEvent {
  url: string;
}

export interface AIEvent extends BrowserEvent {
  agentId?: string;
  messageId?: string;
}

// Storage keys
export const STORAGE_KEYS = {
  BROWSER_STATE: 'comet-browser-state',
  AI_SETTINGS: 'comet-ai-settings',
  USER_PREFERENCES: 'comet-user-preferences',
  BOOKMARKS: 'comet-bookmarks',
  HISTORY: 'comet-history',
  AGENT_HISTORY: 'comet-agent-history',
} as const;