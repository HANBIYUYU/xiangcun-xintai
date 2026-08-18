import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

const navItems = [
  { path: '/', label: '首页' },
  { path: '/archive', label: '档案' },
  { path: '/3d', label: '三维展厅' },
  { path: '/culture', label: '文化馆' },
  { path: '/community', label: '共创' },
  { path: '/study', label: '研学' },
  { path: '/mall', label: '商城' },
  { path: '/ai', label: 'AI' },
];

export default function TransparentNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始计算
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = useCallback((path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const go = useCallback((path: string) => {
    setMobileOpen(false);
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  }, [location.pathname, navigate]);

  const linkColor = scrolled ? '#3B2A26' : '#fff';

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          maxWidth: 1100,
          width: 'calc(100% - 32px)',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: scrolled ? 20 : 16,
          background: scrolled ? 'rgba(250, 247, 242, 0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
          border: scrolled ? '1px solid rgba(163, 35, 43, 0.12)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => go('/')}
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: linkColor,
            letterSpacing: '-0.02em',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'color 0.3s ease',
            textShadow: scrolled ? 'none' : '0 2px 12px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ color: scrolled ? '#A3232B' : '#FFD97A' }}>台</span>
          <span>湘村新台</span>
        </div>

        {/* Desktop Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
          }}
          className="nav-desktop"
        >
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 14,
                whiteSpace: 'nowrap',
                fontWeight: 500,
                color: isActive(item.path) ? (scrolled ? '#A3232B' : '#FFD97A') : linkColor,
                cursor: 'pointer',
                padding: '4px 0',
                borderBottom: isActive(item.path) ? `2px solid ${scrolled ? '#A3232B' : '#FFD97A'}` : '2px solid transparent',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                textShadow: scrolled ? 'none' : '0 2px 12px rgba(0,0,0,0.2)',
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => go('/admin/dashboard')}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: scrolled ? '1px solid rgba(163, 35, 43, 0.3)' : '1px solid rgba(255,255,255,0.45)',
              background: scrolled ? 'transparent' : 'rgba(255,255,255,0.14)',
              color: scrolled ? '#A3232B' : '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
            }}
          >
            后台管理
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: 20,
            color: linkColor,
            cursor: 'pointer',
            textShadow: scrolled ? 'none' : '0 2px 12px rgba(0,0,0,0.2)',
          }}
          className="nav-mobile-btn"
        >
          {mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(250, 247, 242, 0.96)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 24,
                fontWeight: 600,
                color: isActive(item.path) ? '#A3232B' : '#3B2A26',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => go('/admin/dashboard')}
            style={{
              marginTop: 12,
              padding: '10px 28px',
              borderRadius: 24,
              border: '1px solid rgba(163, 35, 43, 0.3)',
              background: 'transparent',
              color: '#A3232B',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            后台管理
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
          nav { top: 8px !important; padding: 12px 20px !important; width: calc(100% - 16px) !important; }
        }
      `}</style>
    </>
  );
}
