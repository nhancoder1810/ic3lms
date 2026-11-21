import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import styles from './LoginPage.module.css';

const RegisterPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
