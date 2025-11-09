export type AgentType = 'research' | 'shopping' | 'booking' | 'data_extraction' | 'automation' | 'summarization';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  agentUsed?: string;
  isStreaming?: boolean;
  error?: string;
}

export interface AIAgent {
  id: string;
  type: AgentType;
  status: 'idle' | 'planning' | 'executing' | 'completed' | 'error' | 'paused';
  task: string;
  steps: AgentStep[];
  results: any[];
  progress: number;
  currentStep?: number;
  errorMessage?: string;
  createdAt: number;
  completedAt?: number;
}

export interface AgentStep {
  id: string;
  type: 'navigate' | 'extract' | 'click' | 'input' | 'wait' | 'analyze';
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'error';
  data?: any;
  error?: string;
  duration?: number;
}

export interface AgentTask {
  id: string;
  agentId: string;
  task: string;
  type: AgentType;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startTime: number;
  endTime?: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  isFree: boolean;
  capabilities: ('text' | 'vision' | 'function_calling')[];
}

export interface AISettings {
  selectedModel: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  apiKey: string;
  baseUrl: string;
  enableStream: boolean;
  autoExecute: boolean;
  confirmActions: boolean;
}

export interface AIState {
  // Chat State
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;

  // Agent State
  activeAgents: AIAgent[];
  agentHistory: AgentTask[];
  availableModels: AIModel[];

  // UI State
  chatPanelOpen: boolean;
  agentDashboardOpen: boolean;
  settingsOpen: boolean;

  // Settings
  settings: AISettings;

  // Error handling
  lastError?: string;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
}

export interface WebPageContent {
  url: string;
  title: string;
  content: string;
  metadata: {
    description?: string;
    keywords?: string[];
    openGraph?: Record<string, any>;
  };
  extractedData?: Record<string, any>;
  links?: string[];
  images?: string[];
}

export interface SearchResult {
  url: string;
  title: string;
  description: string;
  favicon?: string;
  rank: number;
}