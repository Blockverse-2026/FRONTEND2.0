import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ANAAssistant from './ANAAssistant';

const Layout = () => {
  const location = useLocation();
  const showANA = location.pathname !== '/login' && location.pathname !== '/';
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="scanline-overlay" />
      <div className="fixed inset-0 bg-noise opacity-5 pointer-events-none" />
      {isLogin && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-gradient-to-b from-transparent via-neon-cyan to-transparent opacity-5 animate-scanline h-full" />
      )}
      
      <main className="relative z-10 min-h-screen flex flex-col">
        <Outlet />
      </main>

      {showANA && <ANAAssistant />}
    </div>
  );
};

export default Layout;
