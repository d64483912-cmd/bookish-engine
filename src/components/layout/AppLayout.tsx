import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Bookmark, History, Download } from 'lucide-react';

import { useBrowserStore, useAIStore } from '@/stores';
import { Button } from '@/components/ui';
import { TabBar } from '@/components/browser/TabBar';
import { NavigationControls } from '@/components/browser/NavigationControls';
import { UrlBar } from '@/components/browser/UrlBar';
import { BrowserViewport } from '@/components/browser/BrowserViewport';
import { ChatPanel } from '@/components/ai/ChatPanel';
import { StatusBar } from '@/components/browser/StatusBar';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const {
    sidebarCollapsed,
    rightPanelOpen,
    toggleSidebar,
    toggleRightPanel,
    getActiveTab,
  } = useBrowserStore();

  const {
    chatPanelOpen,
    toggleChatPanel,
    isStreaming,
  } = useAIStore();

  const activeTab = getActiveTab();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B for sidebar toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }

      // Escape for AI chat toggle
      if (e.key === 'Escape' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        toggleChatPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, toggleChatPanel]);

  return (
    <div className="h-full w-full flex flex-col bg-dark-primary">
      {/* Top Navigation Area */}
      <div className="flex flex-col border-b border-surface-light">
        {/* Tab Bar */}
        <TabBar />

        {/* Navigation Controls + URL Bar */}
        <div className="flex items-center gap-3 px-4 py-2">
          {/* Navigation Controls */}
          <NavigationControls />

          {/* URL Bar */}
          <div className="flex-1 min-w-0">
            <UrlBar />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="small"
              onClick={toggleChatPanel}
              className={chatPanelOpen ? 'text-primary-500' : ''}
              disabled={isStreaming}
            >
              <Sparkles className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="small"
              onClick={toggleSidebar}
              className={sidebarCollapsed ? '' : 'text-primary-500'}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-70 border-r border-surface-light bg-dark-secondary"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Browser Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <BrowserViewport />
        </div>

        {/* Right AI Panel */}
        <AnimatePresence>
          {chatPanelOpen && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-100 border-l border-surface-light"
            >
              <ChatPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </div>
  );
};