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
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '1px solid rgba(43, 29, 26, 0.10)',
        background: '#FAF7F2',
        color: '#2B1D1A',
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.10)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = visible ? 'translateY(-4px)' : 'translateY(16px)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.16)';
        (e.currentTarget as HTMLButtonElement).style.color = '#A3232B';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = visible ? 'translateY(0)' : 'translateY(16px)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.10)';
        (e.currentTarget as HTMLButtonElement).style.color = '#2B1D1A';
      }}
    >
      <UpOutlined />
    </button>
  );
}
