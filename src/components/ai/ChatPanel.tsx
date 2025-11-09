import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bot,
  Settings,
  Sparkles,
  Brain,
  Search,
  ShoppingCart,
  Calendar,
  FileText,
  Play,
} from 'lucide-react';
import { useAIStore } from '@/stores';
import { Button, Tooltip } from '@/components/ui';
import { ChatInterface } from './ChatInterface';
import { AgentType } from '@/types';

export const ChatPanel: React.FC = () => {
  const [activeView, setActiveView] = useState<'chat' | 'agents'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isStreaming,
    toggleChatPanel,
    activeAgents,
    createAgent,
    executeAgent,
    settings,
  } = useAIStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAgentIcon = (type: AgentType) => {
    switch (type) {
      case 'research':
        return <Search className="w-4 h-4" />;
      case 'shopping':
        return <ShoppingCart className="w-4 h-4" />;
      case 'booking':
        return <Calendar className="w-4 h-4" />;
      case 'data_extraction':
        return <FileText className="w-4 h-4" />;
      case 'automation':
        return <Play className="w-4 h-4" />;
      case 'summarization':
        return <Brain className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getAgentName = (type: AgentType) => {
    switch (type) {
      case 'research':
        return 'Research Agent';
      case 'shopping':
        return 'Shopping Agent';
      case 'booking':
        return 'Booking Agent';
      case 'data_extraction':
        return 'Data Extraction';
      case 'automation':
        return 'Automation';
      case 'summarization':
        return 'Summarization';
      default:
        return 'Assistant';
    }
  };

  const handleQuickAgent = (type: AgentType, task: string) => {
    createAgent(type, task);
    setActiveView('agents');
  };

  return (
    <div className="h-full flex flex-col bg-surface-medium">
      {/* Header */}
      <div className="glass-surface border-b border-surface-light p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                AI Assistant
              </h2>
              <p className="text-xs text-text-muted">
                Model: {settings.selectedModel.split('/')[1]?.split(':')[0] || 'AI Model'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip content="Settings" position="bottom">
              <Button
                variant="ghost"
                size="small"
                onClick={() => {/* Open settings */}}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </Tooltip>

            <Button
              variant="ghost"
              size="small"
              onClick={toggleChatPanel}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={activeView === 'chat' ? 'primary' : 'ghost'}
            size="small"
            onClick={() => setActiveView('chat')}
            className="flex-1"
          >
            Chat
          </Button>
          <Button
            variant={activeView === 'agents' ? 'primary' : 'ghost'}
            size="small"
            onClick={() => setActiveView('agents')}
            className="flex-1"
          >
            Agents ({activeAgents.length})
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <ChatInterface />
            </motion.div>
          ) : (
            <motion.div
              key="agents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Agents View */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text-secondary mb-3">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleQuickAgent('research', 'Research this topic')}
                      className="flex items-center gap-2 h-auto p-3 text-left"
                    >
                      <Search className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="text-sm font-medium">Research</div>
                        <div className="text-xs text-text-muted">Study a topic</div>
                      </div>
                    </Button>

                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleQuickAgent('shopping', 'Find best prices')}
                      className="flex items-center gap-2 h-auto p-3 text-left"
                    >
                      <ShoppingCart className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-sm font-medium">Shopping</div>
                        <div className="text-xs text-text-muted">Compare products</div>
                      </div>
                    </Button>

                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleQuickAgent('summarization', 'Summarize this page')}
                      className="flex items-center gap-2 h-auto p-3 text-left"
                    >
                      <FileText className="w-4 h-4 text-green-400" />
                      <div>
                        <div className="text-sm font-medium">Summarize</div>
                        <div className="text-xs text-text-muted">Get key points</div>
                      </div>
                    </Button>

                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleQuickAgent('automation', 'Fill forms automatically')}
                      className="flex items-center gap-2 h-auto p-3 text-left"
                    >
                      <Play className="w-4 h-4 text-warning" />
                      <div>
                        <div className="text-sm font-medium">Automation</div>
                        <div className="text-xs text-text-muted">Auto-complete</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Active Agents */}
                {activeAgents.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-text-secondary mb-3">
                      Active Agents
                    </h3>
                    <div className="space-y-3">
                      {activeAgents.map((agent) => (
                        <motion.div
                          key={agent.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass-card p-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-surface-dark">
                              {getAgentIcon(agent.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-text-primary">
                                  {getAgentName(agent.type)}
                                </span>
                                <span className={cn(
                                  'text-xs px-2 py-0.5 rounded-full',
                                  agent.status === 'executing' ? 'bg-primary-500/20 text-primary-400' :
                                  agent.status === 'completed' ? 'bg-success/20 text-success' :
                                  agent.status === 'error' ? 'bg-error/20 text-error' :
                                  'bg-surface-medium text-text-muted'
                                )}>
                                  {agent.status}
                                </span>
                              </div>

                              <p className="text-sm text-text-secondary mb-2">
                                {agent.task}
                              </p>

                              {/* Progress bar for executing agents */}
                              {agent.status === 'executing' && (
                                <div className="w-full bg-surface-medium rounded-full h-1.5">
                                  <motion.div
                                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${agent.progress}%` }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </div>
                              )}

                              {/* Results for completed agents */}
                              {agent.status === 'completed' && agent.results.length > 0 && (
                                <div className="mt-2 text-xs text-text-muted">
                                  ✓ Task completed successfully
                                </div>
                              )}
                            </div>

                            {/* Agent controls */}
                            <div className="flex items-center gap-1">
                              {agent.status === 'idle' && (
                                <Button
                                  variant="ghost"
                                  size="small"
                                  onClick={() => executeAgent(agent.id)}
                                >
                                  <Play className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeAgents.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      No Active Agents
                    </h3>
                    <p className="text-sm text-text-muted">
                      Start a task above or chat with the AI assistant
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Connection Status */}
      <div className="p-3 border-t border-surface-light">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <div className={cn(
            'w-2 h-2 rounded-full',
            isStreaming ? 'bg-success animate-pulse' : 'bg-text-muted'
          )} />
          <span>
            {isStreaming ? 'AI is thinking...' : 'Ready to help'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper function for className concatenation
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};