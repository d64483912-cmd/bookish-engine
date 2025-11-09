import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Copy, RefreshCw } from 'lucide-react';
import { useAIStore } from '@/stores';
import { Button, Input } from '@/components/ui';
import { formatRelativeTime, copyToClipboard } from '@/utils/helpers';

export const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    clearMessages,
  } = useAIStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  const renderMessage = (message: any, index: number) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    if (isSystem) return null;

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          'flex gap-3 p-4',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        {/* Avatar */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-gradient-to-br from-primary-500 to-accent-500'
            : 'bg-gradient-to-br from-cyan-400 to-blue-500'
        )}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={cn(
          'flex-1 max-w-[80%]',
          isUser ? 'text-right' : 'text-left'
        )}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-text-muted">
              {isUser ? 'You' : 'AI Assistant'}
            </span>
            <span className="text-xs text-text-muted">
              {formatRelativeTime(message.timestamp)}
            </span>
          </div>

          <div className={cn(
            'inline-block p-3 rounded-lg',
            isUser
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-br-none'
              : 'glass-surface text-text-primary rounded-bl-none'
          )}>
            {/* Markdown-like rendering */}
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {renderMarkdown(message.content)}
            </div>

            {/* Streaming indicator */}
            {message.isStreaming && (
              <motion.div
                className="flex gap-1 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </motion.div>
            )}
          </div>

          {/* Message Actions */}
          {!isUser && !message.isStreaming && (
            <motion.div
              initial={{ opacity: 0, x: isUser ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'flex gap-2 mt-2',
                isUser ? 'justify-end' : 'justify-start'
              )}
            >
              <Button
                variant="ghost"
                size="small"
                onClick={() => handleCopyMessage(message.id, message.content)}
                className="opacity-0 hover:opacity-100 transition-opacity"
              >
                {copiedMessageId === message.id ? (
                  <span className="text-xs text-success">Copied!</span>
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="small"
                onClick={() => {/* Regenerate response */}}
                className="opacity-0 hover:opacity-100 transition-opacity"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </motion.div>
          )}

          {/* Error state */}
          {message.error && (
            <div className="mt-2 text-xs text-error">
              Error: {message.error}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Basic markdown-like rendering
  const renderMarkdown = (text: string) => {
    // Simple code block detection
    if (text.includes('```')) {
      const parts = text.split(/```(\w+)?/);
      return parts.map((part, index) => {
        if (index % 3 === 1) {
          // Language identifier
          return null;
        } else if (index % 3 === 2) {
          // Code block
          return (
            <pre key={index} className="bg-surface-dark rounded p-2 mt-2 mb-2 overflow-x-auto">
              <code className="text-xs font-mono">{part}</code>
            </pre>
          );
        } else {
          // Regular text
          return part.split('\n').map((line, lineIndex) => (
            <div key={lineIndex}>
              {line}
              {lineIndex < part.split('\n').length - 1 && <br />}
            </div>
          ));
        }
      });
    }

    // Handle line breaks
    return text.split('\n').map((line, index) => (
      <div key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  AI Assistant
                </h3>
                <p className="text-text-secondary max-w-xs">
                  Ask me anything! I can help you research, browse, automate tasks, and more.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-text-muted mb-2">Try asking:</div>
                <div className="space-y-1">
                  {[
                    "Research climate change solutions",
                    "Find the best price for a new laptop",
                    "Summarize the current page",
                    "Help me book a flight to New York",
                  ].map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setInputValue(suggestion)}
                      className="block w-full text-left p-3 rounded-lg glass-card text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            messages.map(renderMessage)
          )}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 p-4"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="glass-surface p-3 rounded-lg rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-surface-light p-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={setInputValue}
              onKeyDown={handleKeyDown}
              placeholder={
                isLoading
                  ? "AI is thinking..."
                  : "Ask me anything..."
              }
              disabled={isLoading}
              className="bg-surface-light"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            loading={isLoading}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Clear conversation button */}
        {messages.length > 0 && (
          <div className="mt-2 text-center">
            <Button
              variant="ghost"
              size="small"
              onClick={clearMessages}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Clear conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for className concatenation
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};