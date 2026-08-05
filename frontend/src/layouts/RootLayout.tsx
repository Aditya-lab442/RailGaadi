import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Header } from '../components/navigation/Header';
import { BottomNavigation } from '../components/navigation/BottomNavigation';

export const RootLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : 'var(--sidebar-width)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: isMobile ? '100%' : 'calc(100% - var(--sidebar-width))',
        }}
      >
        {/* Mobile Header */}
        {isMobile && <Header />}

        {/* Content Outlet */}
        <main style={{ flex: 1, paddingBottom: isMobile ? '72px' : '32px' }}>
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && <BottomNavigation />}
      </div>
    </div>
  );
};
