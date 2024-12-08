'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/components/providers/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();
  const { login, error } = useAuth();

  useEffect(() => {
    // Create spans for background effect
    const section = document.querySelector(`.${styles.section}`);
    if (section) {
      for (let i = 0; i < 100; i++) {
        const span = document.createElement('span');
        section.appendChild(span);
      }
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await login(email, password);
      // Redirect will be handled by AuthProvider
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to login. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.body}>
      <div className={styles.section}></div>
      <div className={styles.container}>
        <header>EduConnect Admin</header>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <div className={styles.inputField}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {emailError && <div className={styles.error}>{emailError}</div>}
          </div>

          <div className={styles.field}>
            <div className={styles.inputField}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {passwordError && <div className={styles.error}>{passwordError}</div>}
          </div>

          {message.text && (
            <div className={`${styles.message} ${message.type === 'error' ? styles.error : styles.success}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
