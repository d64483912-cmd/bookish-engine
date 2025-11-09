import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi,
  WifiOff,
  Shield,
  Globe,
  Lock,
  Unlock,
  Activity,
  Download,
} from 'lucide-react';
import { useBrowserStore, useAIStore } from '@/stores';
import { Tooltip } from '@/components/ui';

export const StatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');

  const {
    getActiveTab,
    downloads,
    urlLoading,
  } = useBrowserStore();

  const {
    connectionStatus: aiConnectionStatus,
    activeAgents,
  } = useAIStore();

  const activeTab = getActiveTab();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setConnectionStatus(navigator.onLine ? 'online' : 'offline');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getSecurityStatus = () => {
    if (!activeTab || !activeTab.url) {
      return { icon: <Globe className="w-3 h-3" />, color: 'text-text-muted', text: 'Unknown' };
    }

    try {
      const url = new URL(activeTab.url);
      if (url.protocol === 'https:') {
        return { icon: <Lock className="w-3 h-3" />, color: 'text-success', text: 'Secure' };
      } else {
        return { icon: <Unlock className="w-3 h-3" />, color: 'text-warning', text: 'Not secure' };
      }
    } catch {
      return { icon: <Globe className="w-3 h-3" />, color: 'text-text-muted', text: 'Local file' };
    }
  };

  const securityStatus = getSecurityStatus();

  const activeDownloads = downloads.filter(d => d.status === 'downloading');
  const hasActiveAgents = activeAgents.some(a => a.status === 'executing');

  return (
    <div className="glass-surface border-t border-surface-light px-4 py-1">
      <div className="flex items-center justify-between text-xs text-text-muted">
        {/* Left side - Page status and connection */}
        <div className="flex items-center gap-4">
          {/* Connection status */}
          <Tooltip
            content={connectionStatus === 'online' ? 'Connected to internet' : 'Offline'}
            position="top"
          >
            <div className="flex items-center gap-1">
              {connectionStatus === 'online' ? (
                <Wifi className="w-3 h-3 text-success" />
              ) : (
                <WifiOff className="w-3 h-3 text-error" />
              )}
              <span>{connectionStatus === 'online' ? 'Online' : 'Offline'}</span>
            </div>
          </Tooltip>

          {/* Security status */}
          <Tooltip content={`Connection: ${securityStatus.text}`} position="top">
            <div className={`flex items-center gap-1 ${securityStatus.color}`}>
              {securityStatus.icon}
              <span>{securityStatus.text}</span>
            </div>
          </Tooltip>

          {/* Page loading */}
          <AnimatePresence>
            {urlLoading && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-1"
              >
                <Activity className="w-3 h-3 text-primary-500 animate-pulse" />
                <span>Loading...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page title or URL */}
          {activeTab && activeTab.url !== 'about:blank' && (
            <div className="flex items-center gap-1 max-w-xs truncate">
              <Globe className="w-3 h-3" />
              <span className="truncate">
                {activeTab.title || activeTab.url}
              </span>
            </div>
          )}
        </div>

        {/* Center - AI and Download status */}
        <div className="flex items-center gap-4">
          {/* AI Status */}
          <Tooltip
            content={
              aiConnectionStatus === 'connected'
                ? 'AI assistant connected'
                : aiConnectionStatus === 'connecting'
                ? 'Connecting to AI...'
                : 'AI assistant disconnected'
            }
            position="top"
          >
            <div className={`flex items-center gap-1 ${
              aiConnectionStatus === 'connected' ? 'text-success' :
              aiConnectionStatus === 'connecting' ? 'text-warning animate-pulse' :
              'text-text-muted'
            }`}>
              <Shield className="w-3 h-3" />
              <span>
                AI {aiConnectionStatus === 'connected' ? 'Ready' : 'Offline'}
              </span>
              {hasActiveAgents && (
                <span className="text-primary-400">
                  ({activeAgents.filter(a => a.status === 'executing').length} agents)
                </span>
              )}
            </div>
          </Tooltip>

          {/* Downloads */}
          <AnimatePresence>
            {activeDownloads.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Tooltip
                  content={`${activeDownloads.length} download${activeDownloads.length > 1 ? 's' : ''} in progress`}
                  position="top"
                >
                  <div className="flex items-center gap-1 text-primary-400">
                    <Download className="w-3 h-3" />
                    <span>{activeDownloads.length}</span>
                  </div>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side - Time and system info */}
        <div className="flex items-center gap-4">
          {/* Memory usage (placeholder) */}
          <Tooltip content="Memory usage: 245 MB" position="top">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>245 MB</span>
            </div>
          </Tooltip>

          {/* Current time */}
          <Tooltip content="Current time" position="top">
            <div className="flex items-center gap-1">
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Download progress bar */}
      <AnimatePresence>
        {activeDownloads.length > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '2px' }}
            exit={{ height: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-surface-dark overflow-hidden"
          >
            <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500">
              <motion.div
                className="h-full bg-white/20"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};