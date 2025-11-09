import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize,
  Minimize,
  Copy,
  ExternalLink,
  Settings,
  Eye,
  EyeOff,
  Play,
  Pause,
} from 'lucide-react';
import { useBrowserStore } from '@/stores';
import { Button, Tooltip } from '@/components/ui';
import { PageLoader, ProgressBar } from '@/components/ui/LoadingStates';

export const BrowserViewport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { getActiveTab, updateTab } = useBrowserStore();
  const activeTab = getActiveTab();

  // Loading simulation
  useEffect(() => {
    if (activeTab?.loading) {
      setIsLoading(true);
      setLoadingProgress(0);

      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsLoading(false);
              if (activeTab) {
                updateTab(activeTab.id, { loading: false });
              }
            }, 500);
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
      setLoadingProgress(100);
    }
  }, [activeTab?.loading, activeTab?.id, updateTab]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewportRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle mouse movement for showing/hiding controls
  useEffect(() => {
    let timeout: number;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const viewport = viewportRef.current;
    if (viewport && isFullscreen) {
      viewport.addEventListener('mousemove', handleMouseMove);
      return () => {
        viewport.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timeout);
      };
    }
  }, [isFullscreen]);

  const handleCopyUrl = async () => {
    if (activeTab?.url) {
      await navigator.clipboard.writeText(activeTab.url);
    }
  };

  const handleOpenInNewTab = () => {
    if (activeTab?.url) {
      window.open(activeTab.url, '_blank');
    }
  };

  const renderContent = () => {
    if (!activeTab) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Welcome to Comet AI Browser
            </h2>
            <p className="text-text-secondary mb-8">
              Open a new tab to start browsing
            </p>
            <Button onClick={() => window.open('about:blank', '_self')}>
              New Tab
            </Button>
          </div>
        </div>
      );
    }

    if (activeTab.url === 'about:blank') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-3xl font-bold gradient-text mb-4">
              New Tab
            </h2>
            <p className="text-text-secondary mb-8">
              Start browsing or ask the AI assistant for help
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Ask AI Assistant
              </Button>
              <Button variant="secondary">
                <Search className="w-4 h-4 mr-2" />
                Search Something
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // For demonstration, we'll use an iframe for actual web content
    // In a production environment, you'd want to use a more secure solution
    return (
      <iframe
        ref={iframeRef}
        src={activeTab.url}
        title={activeTab.title}
        className="w-full h-full border-0 bg-white"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        onLoad={() => {
          if (activeTab) {
            updateTab(activeTab.id, { loading: false });
          }
        }}
      />
    );
  };

  return (
    <div
      ref={viewportRef}
      className="relative flex-1 bg-white overflow-hidden"
      style={{ height: '100%' }}
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-dark-primary"
          >
            <PageLoader message={`Loading ${activeTab?.title || 'page'}...`} />
            <ProgressBar progress={loadingProgress} className="w-64 mt-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browser controls overlay */}
      <AnimatePresence>
        {showControls && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-10 p-4"
          >
            <div className="glass-surface rounded-lg p-3 flex items-center justify-between max-w-4xl mx-auto">
              {/* URL display */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-sm text-text-muted min-w-0">
                  <div className="truncate font-medium">
                    {activeTab?.title || 'No title'}
                  </div>
                  <div className="truncate text-xs">
                    {activeTab?.url || ''}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 ml-4">
                <Tooltip content="Copy URL" position="bottom">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleCopyUrl}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </Tooltip>

                <Tooltip content="Open in new tab" position="bottom">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleOpenInNewTab}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Tooltip>

                <Tooltip content={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} position="bottom">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </Button>
                </Tooltip>

                <Tooltip content="Page settings" position="bottom">
                  <Button
                    variant="ghost"
                    size="small"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="w-full h-full">
        {renderContent()}
      </div>

      {/* Error state */}
      {activeTab && activeTab.url !== 'about:blank' && (
        <div className="hidden" id="error-state">
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Unable to load page
              </h2>
              <p className="text-text-secondary mb-6">
                {activeTab.url} could not be loaded
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => {
                  if (activeTab) {
                    updateTab(activeTab.id, { loading: true });
                  }
                }}>
                  Try Again
                </Button>
                <Button variant="secondary">
                  Go to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Import required icon
import { Sparkles, Search } from 'lucide-react';