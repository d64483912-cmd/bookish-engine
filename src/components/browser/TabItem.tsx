import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Pin, Loader2, Globe } from 'lucide-react';
import { Tab } from '@/types';
import { Button } from '@/components/ui';
import { cn } from '@/utils/helpers';

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onClose: (tabId: string) => void;
  onSwitch: (tabId: string) => void;
  onPin: (tabId: string) => void;
  onUnpin: (tabId: string) => void;
  showCloseButton?: boolean;
}

export const TabItem: React.FC<TabItemProps> = ({
  tab,
  isActive,
  onClose,
  onSwitch,
  onPin,
  onUnpin,
  showCloseButton = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.tab-content')) {
      onSwitch(tab.id);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(tab.id);
  };

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tab.isPinned) {
      onUnpin(tab.id);
    } else {
      onPin(tab.id);
    }
  };

  const getFavicon = () => {
    if (tab.favicon) {
      return (
        <img
          src={tab.favicon}
          alt=""
          className="w-4 h-4 flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      );
    }
    return <Globe className="w-4 h-4 flex-shrink-0 text-text-muted" />;
  };

  return (
    <motion.div
      className={cn(
        // Base styles
        'group relative flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-surface-light',
        'min-w-0 max-w-240 transition-all duration-200',

        // Active state
        isActive
          ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-b-2 border-b-primary-500'
          : 'bg-surface-medium hover:bg-surface-light border-b-2 border-b-transparent',

        // Pinned state
        tab.isPinned && 'opacity-90'
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Loading indicator */}
      {tab.loading && (
        <motion.div
          className="absolute left-1 top-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-3 h-3 text-primary-500" />
        </motion.div>
      )}

      {/* Favicon */}
      <div className="tab-content flex items-center gap-2 min-w-0 flex-1">
        {getFavicon()}

        {/* Tab title */}
        <div className="min-w-0 flex-1">
          <p className="text-sm truncate font-medium text-text-primary">
            {tab.title}
          </p>
        </div>
      </div>

      {/* Pin button (shown on hover or if pinned) */}
      {(isHovered || tab.isPinned) && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handlePinToggle}
          className={cn(
            'p-1 rounded hover:bg-surface-dark transition-colors',
            tab.isPinned ? 'text-primary-500' : 'text-text-muted hover:text-text-primary'
          )}
        >
          <Pin className="w-3 h-3" />
        </motion.button>
      )}

      {/* Close button (shown on hover, not for pinned tabs) */}
      {showCloseButton && !tab.isPinned && isHovered && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClose}
          className="p-1 rounded hover:bg-surface-dark text-text-muted hover:text-error transition-colors"
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}

      {/* Active tab gradient overlay */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};