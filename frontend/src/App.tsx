import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { TrainPage } from './pages/TrainPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { MapPage } from './pages/MapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="train/:number" element={<TrainPage />} />
            <Route path="train/:number/analytics" element={<AnalyticsPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          {/* Fullscreen Map Route without shell layout */}
          <Route path="train/:number/map" element={<MapPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
