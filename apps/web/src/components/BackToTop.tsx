import { useState, useEffect } from 'react';
import { UpOutlined } from '@ant-design/icons';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="返回顶部"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 99,
        width: 44,
        height: 44,
        borderRadius: 14,
        border: '1px solid rgba(163, 35, 43, 0.2)',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        color: '#A3232B',
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 16px rgba(163, 35, 43, 0.15)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.05)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(163, 35, 43, 0.25)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(1)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(163, 35, 43, 0.15)';
      }}
    >
      <UpOutlined />
    </button>
  );
}
