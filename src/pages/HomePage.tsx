import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Search,
  Globe,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Download,
  BookOpen,
  Cpu,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useBrowserStore } from '@/stores';
import { buildSearchUrl } from '@/utils/helpers';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { createTab, updateSettings } = useBrowserStore();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      createTab(buildSearchUrl(query.trim()));
    }
  };

  const handleQuickAction = (url: string) => {
    createTab(url);
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Browsing',
      description: 'Smart assistants that research, shop, book, and automate tasks for you.',
      color: 'from-cyan-400 to-blue-500',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Advanced Navigation',
      description: 'Multi-tab browsing with intelligent organization and seamless switching.',
      color: 'from-primary-500 to-accent-500',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy First',
      description: 'Built-in tracking protection, secure connections, and local data storage.',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Optimized performance with instant loading and smooth animations.',
      color: 'from-yellow-400 to-orange-500',
    },
  ];

  const quickActions = [
    {
      icon: <Search className="w-5 h-5" />,
      title: 'Search the Web',
      description: 'Find anything, instantly',
      action: () => handleSearch(''),
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: 'AI Assistant',
      description: 'Get help with any task',
      action: () => {
        createTab('about:blank');
      },
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Popular Sites',
      description: 'Trending destinations',
      action: () => handleQuickAction('https://www.reddit.com'),
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Learn More',
      description: 'Discover new topics',
      action: () => handleQuickAction('https://en.wikipedia.org'),
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Logo and title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glass"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          <h1 className="text-5xl font-bold gradient-text mb-4">
            Comet AI Browser
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            The next-generation browser that combines traditional web navigation with powerful AI automation.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-2xl mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={() => handleSearch(searchQuery)}
              placeholder="Search the web or ask AI anything..."
              className="pl-12 pr-16 h-14 text-lg bg-surface-medium backdrop-blur-lg border-surface-light"
            />
            <Button
              onClick={() => handleSearch(searchQuery)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4"
              disabled={!searchQuery.trim()}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Search suggestions */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {['Climate change research', 'Best laptops 2024', 'Python tutorials', 'Travel planning'].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(suggestion)}
                className="px-3 py-1 text-sm glass-card text-text-secondary hover:text-text-primary transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 w-full max-w-4xl"
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className="glass-card p-4 text-left hover:bg-surface-light transition-all duration-200 group"
            >
              <div className="text-primary-400 mb-2 group-hover:text-primary-300 transition-colors">
                {action.icon}
              </div>
              <h3 className="text-text-primary font-medium mb-1">{action.title}</h3>
              <p className="text-xs text-text-muted">{action.description}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="relative z-10 p-6 text-center border-t border-surface-light"
      >
        <div className="flex items-center justify-center gap-6 text-sm text-text-muted">
          <Button
            variant="ghost"
            size="small"
            onClick={() => createTab('about:blank')}
          >
            <Cpu className="w-4 h-4 mr-2" />
            New Tab
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => createTab('https://github.com')}
          >
            <Download className="w-4 h-4 mr-2" />
            Open Source
          </Button>
          <span>•</span>
          <span>Version 1.0.0</span>
        </div>
      </motion.div>
    </div>
  );
};