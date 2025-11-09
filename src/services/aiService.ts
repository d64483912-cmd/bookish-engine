import { AIModel, ChatMessage } from '@/types';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: 'assistant';
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason?: string | null;
  }>;
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Comet AI Browser',
    };
  }

  async getAvailableModels(): Promise<AIModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();

      // Filter for free models and format them
      return data.data
        .filter((model: any) => model.id.includes(':free'))
        .map((model: any): AIModel => ({
          id: model.id,
          name: model.name || model.id.split('/')[1]?.split(':')[0] || 'Unknown Model',
          provider: model.id.split('/')[0] || 'Unknown',
          description: model.description || 'AI model for text generation',
          maxTokens: model.context_length || 4096,
          isFree: model.id.includes(':free'),
          capabilities: ['text'],
        }))
        .slice(0, 10); // Limit to 10 models
    } catch (error) {
      console.error('Error fetching models:', error);
      // Return fallback models if API fails
      return this.getFallbackModels();
    }
  }

  async sendMessage(
    messages: ChatMessage[],
    model: string,
    stream: boolean = false,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured. Please add your API key to the environment variables.');
    }

    const openRouterMessages: OpenRouterMessage[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const requestBody = {
      model,
      messages: openRouterMessages,
      stream,
      max_tokens: 2000,
      temperature: 0.7,
    };

    if (stream && onChunk) {
      return this.streamMessage(requestBody, onChunk);
    } else {
      return this.sendMessageOnce(requestBody);
    }
  }

  private async sendMessageOnce(requestBody: any): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI model');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  private async streamMessage(
    requestBody: any,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed: StreamChunk = JSON.parse(data);
              const delta = parsed.choices[0]?.delta;

              if (delta?.content) {
                fullContent += delta.content;
                onChunk(delta.content);
              }
            } catch (e) {
              // Ignore parsing errors for streaming chunks
            }
          }
        }
      }

      return fullContent;
    } catch (error) {
      console.error('Error streaming message:', error);
      throw error;
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  private getFallbackModels(): AIModel[] {
    return [
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
  }
}

// Create singleton instance
export const aiService = new AIService();