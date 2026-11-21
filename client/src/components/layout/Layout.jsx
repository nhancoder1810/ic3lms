import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth > 960 : true;
  });
  const [isMobileView, setIsMobileView] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 960 : false;
  });
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 960;
      setIsMobileView(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar on route change when on mobile/tablet
  useEffect(() => {
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobileView]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={styles.appContainer}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className={styles.bodyWrap}>
        {isAuthenticated && (
          <>
            <Sidebar isOpen={isSidebarOpen} onLinkClick={closeMobileSidebar} />
            {isMobileView && isSidebarOpen && (
              <div className={styles.mobileBackdrop} onClick={closeMobileSidebar} />
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
