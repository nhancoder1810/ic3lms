import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.appContainer}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className={styles.bodyWrap}>
        {isAuthenticated && <Sidebar isOpen={isSidebarOpen} />}
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
