import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 占位轮播两条主线：红色戏台 / 湘昆非遗
 * 占位图用纯 CSS 渐变面板代替（P1 起替换为真实图片）
 */
const slides = [
  {
    key: 'red-stage',
    title: '红色戏台',
    caption: '重温桂阳古戏台红色记忆，聆听革命故事的回响',
    gradient: 'linear-gradient(135deg, #7A141B 0%, #A3232B 60%, #C0392B 100%)',
    tag: '红色主线',
  },
  {
    key: 'kunqu',
    title: '湘昆非遗',
    caption: '走进国家级非遗湘昆，感受戏台之上的婉转腔韵',
    gradient: 'linear-gradient(135deg, #8A1B22 0%, #C0392B 45%, #D4A017 100%)',
    tag: '非遗主线',
  },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #A3232B 0%, #C0392B 45%, #D4A017 100%)',
        padding: 'clamp(80px, 12vh, 140px) 24px clamp(60px, 8vh, 100px)',
      }}
    >
      {/* 装饰光晕（呼吸动画） */}
      <div
        className="hero-orb"
        style={{
          position: 'absolute',
          top: '38%',
          right: '2%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.28) 0%, transparent 72%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="hero-orb"
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '4%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 160, 23, 0.35) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '22%',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          textAlign: 'center',
          maxWidth: 860,
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}
      >
        <span className="hero-badge">桂阳古戏台 · 红色文旅数字官网</span>

        <h1 className="hero-title">湘村新台</h1>

        <div className="hero-subtitle">让百年戏台在数字时代重焕红色光芒</div>

        <p className="hero-desc">
          以数字档案、三维重建、红色湘昆与乡土共创，讲好桂阳古戏台的红色故事，
          让乡村文旅在数字世界里持续生长。
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/archive')}>探索戏台档案</button>
          <button className="btn-secondary" onClick={() => navigate('/3d')}>进入三维展厅</button>
        </div>

        {/* 占位轮播：红色戏台 / 湘昆非遗 */}
        <div className="hero-carousel">
          {slides.map((s, i) => (
            <div
              key={s.key}
              className={`hero-slide${i === active ? ' active' : ''}`}
              style={{ background: s.gradient }}
            >
              <span className="hero-slide-tag">{s.tag}</span>
              <span className="hero-slide-title">{s.title}</span>
              <span className="hero-slide-caption">{s.caption}</span>
            </div>
          ))}
        </div>

        <div className="hero-dots">
          {slides.map((s, i) => (
            <button
              key={s.key}
              className={`hero-dot${i === active ? ' active' : ''}`}
              aria-label={`切换到${s.title}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>

      {/* 滚动提示 */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <div className="scroll-hint" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 17, color: 'rgba(255, 255, 255, 0.65)', letterSpacing: '0.1em' }}>向下滑动</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
