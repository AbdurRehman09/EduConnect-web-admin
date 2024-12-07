'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/components/AntdProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // Create spans for background effect
    const section = document.querySelector(`.${styles.section}`);
    if (section) {
      for (let i = 1; i <= 100; i++) {
        const span = document.createElement('span');
        section.appendChild(span);
      }
    }
  }, []);

  useEffect(() => {
    if (emailError) setEmailError('');
  }, [email]);

  useEffect(() => {
    if (passwordError) setPasswordError('');
  }, [password]);

  const checkEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const checkPassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = checkEmail();
    const isPasswordValid = checkPassword();
    
    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      try {
        if (email === 'admin@educonnect.com' && password === 'admin123') {
          document.cookie = 'auth=true; path=/';
          login();
          router.push('/dashboard');
        } else {
          setPasswordError('Invalid credentials');
        }
      } catch {
        setPasswordError('Login failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.body}>
      <section className={styles.section}></section>
      <div className={styles.container}>
        <header>LOGIN FORM</header>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <div className={styles.inputField}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={checkEmail}
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
                onBlur={checkPassword}
              />
            </div>
            {passwordError && <div className={styles.error}>{passwordError}</div>}
          </div>
          {/* <div className={styles.links}>
            <p>Don&apos;t have an account?</p>
            <Link href="/signup">Signup</Link>
          </div> */}
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
