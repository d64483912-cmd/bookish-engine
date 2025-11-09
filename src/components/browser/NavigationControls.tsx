import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  ArrowLeftFromLine,
} from 'lucide-react';
import { useBrowserStore } from '@/stores';
import { Button, Tooltip } from '@/components/ui';
import clsx from 'clsx';

export const NavigationControls: React.FC = () => {
  const {
    getActiveTab,
    goBack,
    goForward,
    refreshTab,
    stopLoading,
  } = useBrowserStore();

  const activeTab = getActiveTab();

  const canGoBack = activeTab?.canGoBack || false;
  const canGoForward = activeTab?.canGoForward || false;
  const isLoading = activeTab?.loading || false;

  const handleBack = () => {
    if (canGoBack && activeTab) {
      goBack(activeTab.id);
    }
  };

  const handleForward = () => {
    if (canGoForward && activeTab) {
      goForward(activeTab.id);
    }
  };

  const handleRefresh = () => {
    if (activeTab) {
      if (isLoading) {
        stopLoading(activeTab.id);
      } else {
        refreshTab(activeTab.id);
      }
    }
  };

  const handleHome = () => {
    // Navigate to home page
    if (activeTab) {
      goForward('https://www.google.com');
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center bg-surface-medium rounded-lg p-1 gap-1">
        {/* Back button */}
        <Tooltip content="Go back (Alt + Left Arrow)" position="top">
          <Button
            variant="ghost"
            size="small"
            onClick={handleBack}
            disabled={!canGoBack}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Tooltip>

        {/* Forward button */}
        <Tooltip content="Go forward (Alt + Right Arrow)" position="top">
          <Button
            variant="ghost"
            size="small"
            onClick={handleForward}
            disabled={!canGoForward}
            className="p-2"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Tooltip>

        {/* Separator */}
        <div className="w-px h-6 bg-surface-light" />

        {/* Refresh/Stop button */}
        <Tooltip content={isLoading ? "Stop loading" : "Refresh (F5)"} position="top">
          <Button
            variant="ghost"
            size="small"
            onClick={handleRefresh}
            className={clsx(
              'p-2',
              isLoading && 'text-error'
            )}
          >
            <motion.div
              animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                duration: 1,
                repeat: isLoading ? Infinity : 0,
                ease: 'linear',
              }}
            >
              {isLoading ? (
                <ArrowLeftFromLine className="w-4 h-4" />
              ) : (
                <RotateCw className="w-4 h-4" />
              )}
            </motion.div>
          </Button>
        </Tooltip>

        {/* Home button */}
        <Tooltip content="Home page" position="top">
          <Button
            variant="ghost"
            size="small"
            onClick={handleHome}
            className="p-2"
          >
            <Home className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};