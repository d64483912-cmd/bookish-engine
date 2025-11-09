import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Lock,
  Globe,
  Star,
  Sparkles,
  Command,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useBrowserStore } from '@/stores';
import { Input, Tooltip } from '@/components/ui';
import { formatUrl, isValidUrl, buildSearchUrl, getDomainFromUrl } from '@/utils/helpers';

export const UrlBar: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const {
    getActiveTab,
    navigateTo,
    updateSettings,
    settings,
  } = useBrowserStore();

  const activeTab = getActiveTab();

  // Update input when active tab changes
  useEffect(() => {
    if (activeTab && !isFocused) {
      setInputValue(activeTab.url);
    }
  }, [activeTab?.url, isFocused]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + L to focus URL bar
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }

      // Escape to unfocus
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur();
        setIsFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  const handleSubmit = () => {
    const value = inputValue.trim();
    if (!value) return;

    let targetUrl: string;

    if (isValidUrl(value)) {
      // If it's a valid URL, use it as-is
      targetUrl = formatUrl(value);
    } else if (value.includes('.') && !value.includes(' ')) {
      // If it looks like a domain, add https://
      targetUrl = formatUrl(value);
    } else {
      // Otherwise, treat as search query
      targetUrl = buildSearchUrl(value, settings.defaultSearchEngine);
    }

    if (activeTab) {
      navigateTo(targetUrl, activeTab.id);
    }

    inputRef.current?.blur();
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowSuggestions(false), 200); // Delay to allow clicks on suggestions
  };

  const getSecurityIcon = () => {
    if (!activeTab || !isValidUrl(activeTab.url)) {
      return <Globe className="w-4 h-4 text-text-muted" />;
    }

    try {
      const url = new URL(activeTab.url);
      if (url.protocol === 'https:') {
        return <Lock className="w-4 h-4 text-success" />;
      } else {
        return <Shield className="w-4 h-4 text-warning" />;
      }
    } catch {
      return <Globe className="w-4 h-4 text-text-muted" />;
    }
  };

  const getDisplayUrl = () => {
    if (!activeTab) return '';
    try {
      const url = new URL(activeTab.url);
      return url.hostname + url.pathname;
    } catch {
      return activeTab.url;
    }
  };

  const isBookmarked = () => {
    // This would check if current URL is bookmarked
    // Implementation would depend on bookmarks state
    return false;
  };

  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="relative">
        {/* Security indicator */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          {getSecurityIcon()}
        </div>

        {/* URL Input */}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={setInputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          placeholder="Search or enter address..."
          className={cn(
            'pl-10 pr-32',
            isFocused && 'bg-surface-light'
          )}
        />

        {/* Action buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Bookmark indicator */}
          <AnimatePresence>
            {isBookmarked() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  variant="ghost"
                  size="small"
                  className="p-1.5 text-warning"
                  disabled
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Search toggle */}
          <Tooltip content="AI-powered search" position="top">
            <Button
              variant="ghost"
              size="small"
              className="p-1.5 text-primary-500 hover:text-primary-600"
              onClick={() => {
                // Toggle AI search mode
                console.log('Toggle AI search');
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </Button>
          </Tooltip>

          {/* Search/Navigation indicator */}
          <div className="p-1.5">
            {isValidUrl(inputValue) ? (
              <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
            ) : (
              <Search className="w-3.5 h-3.5 text-text-muted" />
            )}
          </div>
        </div>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && isFocused && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 z-50"
          >
            <div className="glass-surface border border-surface-light rounded-lg shadow-glass max-h-64 overflow-y-auto">
              {/* Search suggestions */}
              <div className="p-2">
                <div className="text-xs text-text-muted mb-2 px-2">
                  Search with {settings.defaultSearchEngine}
                </div>
                {inputValue && (
                  <button
                    className="w-full text-left px-3 py-2 rounded hover:bg-surface-light text-text-primary flex items-center gap-3"
                    onClick={() => {
                      const searchUrl = buildSearchUrl(inputValue, settings.defaultSearchEngine);
                      if (activeTab) {
                        navigateTo(searchUrl, activeTab.id);
                      }
                      setShowSuggestions(false);
                    }}
                  >
                    <Search className="w-4 h-4 text-text-muted" />
                    <span>Search for "{inputValue}"</span>
                  </button>
                )}
              </div>

              {/* Recent history */}
              <div className="border-t border-surface-light p-2">
                <div className="text-xs text-text-muted mb-2 px-2">
                  Recent History
                </div>
                {/* History items would go here */}
                <div className="text-sm text-text-muted px-3 py-2">
                  No recent history
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function for className concatenation
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};