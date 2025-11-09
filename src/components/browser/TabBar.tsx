import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useBrowserStore } from '@/stores';
import { TabItem } from './TabItem';
import { Button } from '@/components/ui';
import { cn } from '@/utils/helpers';

export const TabBar: React.FC = () => {
  const {
    tabs,
    activeTabId,
    createTab,
    closeTab,
    switchTab,
    pinTab,
    unpinTab,
  } = useBrowserStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active tab
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeTab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      const scrollLeft = container.scrollLeft;
      const tabLeft = tabRect.left - containerRect.left + scrollLeft;
      const tabRight = tabLeft + tabRect.width;

      // Scroll into view if needed
      if (tabLeft < scrollLeft || tabRight > scrollLeft + containerRect.width) {
        activeTab.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [activeTabId]);

  const handleNewTab = () => {
    createTab();
  };

  const handleTabClose = (tabId: string) => {
    // Don't close if it's the last tab
    if (tabs.length > 1) {
      closeTab(tabId);
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  };

  // Separate pinned and regular tabs
  const pinnedTabs = tabs.filter(tab => tab.isPinned);
  const regularTabs = tabs.filter(tab => !tab.isPinned);
  const allTabs = [...pinnedTabs, ...regularTabs];

  return (
    <div className="relative bg-surface-medium border-b border-surface-light">
      {/* Tab container with scroll */}
      <div className="relative flex items-center">
        {/* Left scroll button */}
        {allTabs.length > 5 && (
          <Button
            variant="ghost"
            size="small"
            onClick={handleScrollLeft}
            className="absolute left-0 z-10 glass-button rounded-r-none border-r-0"
          >
            <ArrowLeft className="w-3 h-3" />
          </Button>
        )}

        {/* Tabs container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <AnimatePresence mode="popLayout">
            {allTabs.map((tab, index) => (
              <motion.div
                key={tab.id}
                ref={tab.id === activeTabId ? activeTabRef : null}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  delay: index * 0.03,
                }}
                layout
                className="flex-shrink-0"
              >
                <TabItem
                  tab={tab}
                  isActive={tab.id === activeTabId}
                  onClose={handleTabClose}
                  onSwitch={switchTab}
                  onPin={pinTab}
                  onUnpin={unpinTab}
                  showCloseButton={!tab.isPinned}
                />
              </motion.div>
            ))}

            {/* New tab button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: allTabs.length * 0.03 }}
              className="flex-shrink-0"
            >
              <Button
                variant="ghost"
                size="small"
                onClick={handleNewTab}
                className="glass-button rounded-l-none border-l-0 min-w-32 justify-start gap-2"
              >
                <Plus className="w-3 h-3" />
                <span className="text-sm">New Tab</span>
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right scroll button */}
        {allTabs.length > 5 && (
          <Button
            variant="ghost"
            size="small"
            onClick={handleScrollRight}
            className="absolute right-0 z-10 glass-button rounded-l-none border-l-0"
          >
            <ArrowRight className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Tab overflow indicator */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};