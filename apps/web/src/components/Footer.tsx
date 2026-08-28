import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#2B1D1A',
        padding: '40px 24px 32px',
      }}
    >
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* 站点简介 */}
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#FAF7F2',
              letterSpacing: '-0.02em',
              marginBottom: 8,
            }}
          >
            湘村新台
          </div>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: 8,
            }}
          >
            桂阳古戏台红色文旅数字官网
          </p>
          <p
            style={{
              fontSize: 13,
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: 20,
            }}
          >
            让百年戏台在数字时代重焕红色光芒
          </p>

          {/* 快捷链接（· 分隔） */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              marginBottom: 24,
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {[
              { label: '戏台档案', to: '/archive' },
              { label: '三维展厅', to: '/3d' },
              { label: '文化馆', to: '/culture' },
              { label: '乡土共创', to: '/community' },
              { label: '研学预约', to: '/study' },
              { label: '文创商城', to: '/mall' },
            ].map(
              ({ label, to }, i) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 24 }}>
                  {i > 0 && (
                    <span style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: 13 }}>·</span>
                  )}
                  <Link
                    to={to}
                    style={{
                      fontSize: 14,
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLAnchorElement).style.color = '#D4A017';
                      (e.target as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLAnchorElement).style.color = 'rgba(255, 255, 255, 0.7)';
                      (e.target as HTMLAnchorElement).style.transform = 'translateY(0)';
                    }}
                  >
                    {label}
                  </Link>
                </span>
              )
            )}
          </div>

          {/* 分割线 */}
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              height: 1,
              background: 'rgba(255, 255, 255, 0.2)',
              marginBottom: 24,
            }}
          />

          {/* 版权 + 管理入口 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              maxWidth: 900,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)' }}>
              © 2026 湘村新台 · 保留所有权利
            </div>
            <Link
              to="/admin/login"
              style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.4)',
                textDecoration: 'none',
                opacity: 0.4,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.opacity = '0.4';
              }}
            >
              管理入口 →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
