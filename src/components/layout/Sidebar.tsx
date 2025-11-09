import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  History,
  Download,
  ChevronDown,
  ChevronRight,
  Plus,
  Star,
  Clock,
  Folder,
} from 'lucide-react';
import { useBrowserStore } from '@/stores';
import { Button } from '@/components/ui';
import { formatRelativeTime } from '@/utils/helpers';

export const Sidebar: React.FC = () => {
  const {
    bookmarks,
    history,
    downloads,
    bookmarksExpanded,
    historyExpanded,
    downloadsExpanded,
    toggleBookmarks,
    toggleHistory,
    toggleDownloads,
    addBookmark,
    getActiveTab,
  } = useBrowserStore();

  const activeTab = getActiveTab();

  const handleAddBookmark = () => {
    if (activeTab && activeTab.url !== 'about:blank') {
      addBookmark({
        url: activeTab.url,
        title: activeTab.title,
        favicon: activeTab.favicon,
      });
    }
  };

  const SidebarSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }> = ({ title, icon, expanded, onToggle, children }) => (
    <div className="border-b border-surface-light">
      <Button
        variant="ghost"
        size="small"
        onClick={onToggle}
        className="w-full justify-between px-4 py-3 text-text-secondary hover:text-text-primary"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </Button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-surface-medium">
      {/* Bookmarks Section */}
      <SidebarSection
        title="Bookmarks"
        icon={<Bookmark className="w-4 h-4" />}
        expanded={bookmarksExpanded}
        onToggle={toggleBookmarks}
      >
        {activeTab && activeTab.url !== 'about:blank' && (
          <div className="px-4 py-2 border-b border-surface-light">
            <Button
              variant="ghost"
              size="small"
              onClick={handleAddBookmark}
              className="w-full justify-start gap-2"
            >
              <Plus className="w-3 h-3" />
              Bookmark Current Page
            </Button>
          </div>
        )}

        <div className="py-2">
          {bookmarks.length === 0 ? (
            <p className="px-4 py-2 text-text-muted text-sm">
              No bookmarks yet
            </p>
          ) : (
            bookmarks.map((bookmark) => (
              <motion.a
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-surface-light text-text-secondary hover:text-text-primary transition-colors"
              >
                {bookmark.favicon ? (
                  <img
                    src={bookmark.favicon}
                    alt=""
                    className="w-4 h-4 flex-shrink-0"
                  />
                ) : (
                  <Star className="w-4 h-4 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{bookmark.title}</p>
                  <p className="text-xs text-text-muted truncate">
                    {bookmark.url}
                  </p>
                </div>
              </motion.a>
            ))
          )}
        </div>
      </SidebarSection>

      {/* History Section */}
      <SidebarSection
        title="History"
        icon={<History className="w-4 h-4" />}
        expanded={historyExpanded}
        onToggle={toggleHistory}
      >
        <div className="py-2">
          {history.length === 0 ? (
            <p className="px-4 py-2 text-text-muted text-sm">
              No history yet
            </p>
          ) : (
            history.slice(0, 20).map((item) => (
              <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-surface-light text-text-secondary hover:text-text-primary transition-colors"
              >
                <Clock className="w-4 h-4 flex-shrink-0 text-text-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.title}</p>
                  <p className="text-xs text-text-muted">
                    {formatRelativeTime(item.lastVisited)}
                  </p>
                </div>
              </motion.a>
            ))
          )}
        </div>
      </SidebarSection>

      {/* Downloads Section */}
      <SidebarSection
        title="Downloads"
        icon={<Download className="w-4 h-4" />}
        expanded={downloadsExpanded}
        onToggle={toggleDownloads}
      >
        <div className="py-2">
          {downloads.length === 0 ? (
            <p className="px-4 py-2 text-text-muted text-sm">
              No downloads yet
            </p>
          ) : (
            downloads.map((download) => (
              <motion.div
                key={download.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 py-2"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 flex-shrink-0 text-text-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{download.filename}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span>{download.status}</span>
                      {download.status === 'downloading' && (
                        <span>• {download.progress}%</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </SidebarSection>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-surface-light">
        <div className="text-xs text-text-muted">
          Comet AI Browser v1.0
        </div>
      </div>
    </div>
  );
};