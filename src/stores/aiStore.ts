import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIState, ChatMessage, AIAgent, AIModel, AISettings, AgentType } from '@/types';

const DEFAULT_MODELS: AIModel[] = [
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B (Free)',
    provider: 'Meta',
    description: 'Lightweight, fast responses for general tasks',
    maxTokens: 4096,
    isFree: true,
    capabilities: ['text'],
  },
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Phi-3 Mini (Free)',
    provider: 'Microsoft',
    description: 'Good for general tasks with large context',
    maxTokens: 128000,
    isFree: true,
    capabilities: ['text'],
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B (Free)',
    provider: 'Google',
    description: 'Balanced performance for various tasks',
    maxTokens: 8192,
    isFree: true,
    capabilities: ['text'],
  },
  {
    id: 'qwen/qwen-2.5-7b-instruct:free',
    name: 'Qwen 2.5 7B (Free)',
    provider: 'Alibaba',
    description: 'Strong reasoning capabilities',
    maxTokens: 32768,
    isFree: true,
    capabilities: ['text'],
  },
];

const DEFAULT_SETTINGS: AISettings = {
  selectedModel: 'meta-llama/llama-3.2-3b-instruct:free',
  temperature: 0.7,
  maxTokens: 2000,
  systemPrompt: 'You are a helpful AI assistant integrated in the Comet AI browser. Help users with their browsing tasks, research, and navigation.',
  apiKey: '',
  baseUrl: 'https://openrouter.ai/api/v1',
  enableStream: true,
  autoExecute: false,
  confirmActions: true,
};

interface AIActions {
  // Chat Actions
  sendMessage: (message: string) => Promise<void>;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  deleteMessage: (messageId: string) => void;

  // Agent Actions
  createAgent: (type: AgentType, task: string) => void;
  executeAgent: (agentId: string) => Promise<void>;
  pauseAgent: (agentId: string) => void;
  resumeAgent: (agentId: string) => void;
  stopAgent: (agentId: string) => void;
  updateAgent: (agentId: string, updates: Partial<AIAgent>) => void;
  removeAgent: (agentId: string) => void;

  // Model Actions
  setModel: (modelId: string) => void;
  updateModels: (models: AIModel[]) => void;

  // UI Actions
  toggleChatPanel: () => void;
  setChatPanelOpen: (open: boolean) => void;
  toggleAgentDashboard: () => void;
  setAgentDashboardOpen: (open: boolean) => void;
  toggleSettings: () => void;
  setSettingsOpen: (open: boolean) => void;

  // Settings Actions
  updateSettings: (settings: Partial<AISettings>) => void;
  resetSettings: () => void;

  // Connection Actions
  setConnectionStatus: (status: AIState['connectionStatus']) => void;
  setError: (error: string | undefined) => void;
  clearError: () => void;
}

export const useAIStore = create<AIState & AIActions>()(
  persist(
    (set, get) => ({
      // Initial State
      messages: [],
      isLoading: false,
      isStreaming: false,
      activeAgents: [],
      agentHistory: [],
      availableModels: DEFAULT_MODELS,
      chatPanelOpen: false,
      agentDashboardOpen: false,
      settingsOpen: false,
      settings: DEFAULT_SETTINGS,
      lastError: undefined,
      connectionStatus: 'disconnected',

      // Chat Actions
      sendMessage: async (message: string) => {
        const state = get();
        if (!message.trim() || state.isLoading) return;

        // Add user message
        const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
          role: 'user',
          content: message.trim(),
        };

        set((state) => ({
          messages: [...state.messages, { ...userMessage, id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, timestamp: Date.now() }],
          isLoading: true,
          isStreaming: true,
        }));

        try {
          // Simulate API call - replace with actual OpenRouter integration
          const aiResponse = await simulateAICall(message, state.settings);

          // Add AI response
          const assistantMessage: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: aiResponse,
            timestamp: Date.now(),
            isStreaming: false,
            agentUsed: state.settings.selectedModel,
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isLoading: false,
            isStreaming: false,
          }));

        } catch (error) {
          console.error('Error sending message:', error);
          set(() => ({
            isLoading: false,
            isStreaming: false,
            lastError: error instanceof Error ? error.message : 'Unknown error occurred',
          }));
        }
      },

      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      updateMessage: (messageId: string, updates: Partial<ChatMessage>) => {
        set((state) => ({
          messages: state.messages.map(msg =>
            msg.id === messageId
              ? { ...msg, ...updates }
              : msg
          ),
        }));
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      deleteMessage: (messageId: string) => {
        set((state) => ({
          messages: state.messages.filter(msg => msg.id !== messageId),
        }));
      },

      // Agent Actions
      createAgent: (type: AgentType, task: string) => {
        const newAgent: AIAgent = {
          id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type,
          status: 'idle',
          task,
          steps: [],
          results: [],
          progress: 0,
          createdAt: Date.now(),
        };
        set((state) => ({
          activeAgents: [...state.activeAgents, newAgent],
        }));
      },

      executeAgent: async (agentId: string) => {
        set((state) => ({
          activeAgents: state.activeAgents.map(agent =>
            agent.id === agentId
              ? { ...agent, status: 'executing', progress: 0 }
              : agent
          ),
        }));

        // Simulate agent execution - replace with actual implementation
        const agent = get().activeAgents.find(a => a.id === agentId);
        if (!agent) return;

        try {
          for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 200));
            set((state) => ({
              activeAgents: state.activeAgents.map(a =>
                a.id === agentId
                  ? { ...a, progress: i }
                  : a
              ),
            }));
          }

          set((state) => ({
            activeAgents: state.activeAgents.map(a =>
              a.id === agentId
                ? {
                    ...a,
                    status: 'completed',
                    progress: 100,
                    completedAt: Date.now(),
                    results: [{ success: true, message: 'Task completed successfully' }],
                  }
                : a
            ),
          }));

        } catch (error) {
          set((state) => ({
            activeAgents: state.activeAgents.map(a =>
              a.id === agentId
                ? {
                    ...a,
                    status: 'error',
                    errorMessage: error instanceof Error ? error.message : 'Unknown error',
                  }
                : a
            ),
          }));
        }
      },

      pauseAgent: (agentId: string) => {
        set((state) => ({
          activeAgents: state.activeAgents.map(agent =>
            agent.id === agentId
              ? { ...agent, status: 'paused' }
              : agent
          ),
        }));
      },

      resumeAgent: (agentId: string) => {
        set((state) => ({
          activeAgents: state.activeAgents.map(agent =>
            agent.id === agentId && agent.status === 'paused'
              ? { ...agent, status: 'executing' }
              : agent
          ),
        }));
      },

      stopAgent: (agentId: string) => {
        set((state) => ({
          activeAgents: state.activeAgents.filter(agent => agent.id !== agentId),
        }));
      },

      updateAgent: (agentId: string, updates: Partial<AIAgent>) => {
        set((state) => ({
          activeAgents: state.activeAgents.map(agent =>
            agent.id === agentId
              ? { ...agent, ...updates }
              : agent
          ),
        }));
      },

      removeAgent: (agentId: string) => {
        set((state) => ({
          activeAgents: state.activeAgents.filter(agent => agent.id !== agentId),
        }));
      },

      // Model Actions
      setModel: (modelId: string) => {
        set((state) => ({
          settings: { ...state.settings, selectedModel: modelId },
        }));
      },

      updateModels: (models: AIModel[]) => {
        set({ availableModels: models });
      },

      // UI Actions
      toggleChatPanel: () => {
        set((state) => ({ chatPanelOpen: !state.chatPanelOpen }));
      },

      setChatPanelOpen: (open: boolean) => {
        set({ chatPanelOpen: open });
      },

      toggleAgentDashboard: () => {
        set((state) => ({ agentDashboardOpen: !state.agentDashboardOpen }));
      },

      setAgentDashboardOpen: (open: boolean) => {
        set({ agentDashboardOpen: open });
      },

      toggleSettings: () => {
        set((state) => ({ settingsOpen: !state.settingsOpen }));
      },

      setSettingsOpen: (open: boolean) => {
        set({ settingsOpen: open });
      },

      // Settings Actions
      updateSettings: (settings: Partial<AISettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
      },

      // Connection Actions
      setConnectionStatus: (status: AIState['connectionStatus']) => {
        set({ connectionStatus: status });
      },

      setError: (error: string | undefined) => {
        set({ lastError: error });
      },

      clearError: () => {
        set({ lastError: undefined });
      },
    }),
    {
      name: 'comet-ai-storage',
      partialize: (state) => ({
        settings: state.settings,
        messages: state.messages.slice(-50), // Only persist last 50 messages
        agentHistory: state.agentHistory,
      }),
    }
  )
);

// Simulated AI call - replace with actual OpenRouter integration
async function simulateAICall(_message: string, _settings: AISettings): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const responses = [
    "I understand your request. As an AI assistant in the Comet browser, I can help you with various tasks including research, navigation, and automation.",
    "That's an interesting question! I can assist you with browsing tasks, finding information, or navigating to specific websites.",
    "I'm here to help you make the most of your browsing experience. Would you like me to help you research something specific?",
    "I can help you with that! I have access to browsing capabilities and can assist with web research and navigation tasks.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}