'use client';
import { useEffect, useState } from 'react';

export const Alert = ({
  message,
  type = 'error',
  timestamp,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(false);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (!message) return;

    setRender(true);

    // small delay so transition can trigger
    setTimeout(() => setVisible(true), 10);

    const timer = setTimeout(() => {
      setVisible(false);
      setRender(false);

      // wait for exit animation before removing
      setTimeout(() => setRender(false), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [timestamp]);

  if (!render) return null;

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.toast,
          ...styles[type],
          transform: visible ? 'translateY(0)' : 'translateY(-20px)',
          opacity: visible ? 1 : 0,
        }}
      >
        {message}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
  },
  toast: {
    minWidth: '250px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
  error: {
    backgroundColor: '#e74c3c',
  },
  success: {
    backgroundColor: '#2ecc71',
  },
};
