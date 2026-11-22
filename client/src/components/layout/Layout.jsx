import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  // Always keep sidebar hidden by default; only open when user explicitly clicks menu button
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Auto-close sidebar whenever route changes or right after user logs in/out
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname, isAuthenticated]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.appContainer}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className={styles.bodyWrap}>
        {isAuthenticated && (
          <>
            <Sidebar isOpen={isSidebarOpen} onLinkClick={closeSidebar} />
            {isSidebarOpen && (
              <div className={styles.mobileBackdrop} onClick={closeSidebar} />
            )}
          </>
        )}
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
