import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
