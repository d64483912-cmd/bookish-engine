import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { useBrowserStore } from '@/stores';

function App() {
  const { tabs } = useBrowserStore();

  return (
    <BrowserRouter>
      <div className="h-screen w-full overflow-hidden bg-dark-primary">
        <AnimatePresence mode="wait">
          {tabs.length === 0 ? (
            <HomePage key="home" />
          ) : (
            <AppLayout key="browser" />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;