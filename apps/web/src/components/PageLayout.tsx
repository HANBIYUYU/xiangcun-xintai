import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

interface PageLayoutProps {
  title: string;
  background?: string;
  children: ReactNode;
  /** 返回时的目标路由，如 '/archive' */
  backTo?: string;
  /** 返回按钮文案，如 '返回档案馆' */
  backLabel?: string;
}

export default function PageLayout({ title, background = '#FAF7F2', children, backTo = '/', backLabel = '返回首页' }: PageLayoutProps) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <div style={{ background, minHeight: '100vh' }}>
      {/* 顶部简化导航（毛玻璃） */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(250, 247, 242, 0.88)',
          backdropFilter: 'blur(16px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
          borderBottom: '1px solid rgba(163, 35, 43, 0.12)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}
      >
        {/* Logo + 返回 */}
        <div
          onClick={() => navigate(backTo)}
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#3B2A26',
            letterSpacing: '-0.02em',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#A3232B' }}>台</span>
          <span>湘村新台</span>
        </div>

        {/* 当前页面标题 + 返回 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#A3232B' }}>{title}</span>
          <button
            onClick={() => navigate(backTo)}
            style={{
              padding: '8px 20px',
              fontSize: 13,
              borderRadius: 20,
              border: '1px solid rgba(163, 35, 43, 0.2)',
              background: 'transparent',
              color: '#7A5A52',
              cursor: 'pointer',
              fontWeight: 500,
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#A3232B';
              (e.currentTarget as HTMLButtonElement).style.color = '#A3232B';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(163, 35, 43, 0.2)';
              (e.currentTarget as HTMLButtonElement).style.color = '#7A5A52';
            }}
          >
            ← {backLabel}
          </button>
        </div>
      </nav>

      {/* 内容区 */}
      <main style={{ paddingTop: 100, paddingBottom: 80, minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
