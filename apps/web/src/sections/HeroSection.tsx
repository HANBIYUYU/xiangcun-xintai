import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 轮播：5 张桂阳古戏台影像（素材未整理 → public/assets/hero/hero-1~5.jpg，1440×630）
 * 未放图时自动回退到 CSS 渐变面板；标题/文案可在下方 slides 数组中修改
 */
const slides = [
  {
    key: 'slide-1',
    title: '桂阳古戏台',
    caption: '影像 1 / 5',
    gradient: 'linear-gradient(135deg, #7A141B 0%, #A3232B 60%, #C0392B 100%)',
    bg: '/assets/hero/hero-1.jpg',
    tag: '戏台掠影',
  },
  {
    key: 'slide-2',
    title: '桂阳古戏台',
    caption: '影像 2 / 5',
    gradient: 'linear-gradient(135deg, #8A1B22 0%, #C0392B 45%, #D4A017 100%)',
    bg: '/assets/hero/hero-2.jpg',
    tag: '戏台掠影',
  },
  {
    key: 'slide-3',
    title: '桂阳古戏台',
    caption: '影像 3 / 5',
    gradient: 'linear-gradient(135deg, #7A141B 0%, #8E2B22 50%, #D4A017 100%)',
    bg: '/assets/hero/hero-3.jpg',
    tag: '戏台掠影',
  },
  {
    key: 'slide-4',
    title: '桂阳古戏台',
    caption: '影像 4 / 5',
    gradient: 'linear-gradient(135deg, #6B141B 0%, #A3232B 55%, #C9A227 100%)',
    bg: '/assets/hero/hero-4.jpg',
    tag: '戏台掠影',
  },
  {
    key: 'slide-5',
    title: '桂阳古戏台',
    caption: '影像 5 / 5',
    gradient: 'linear-gradient(135deg, #7A141B 0%, #B03A2B 50%, #D4A017 100%)',
    bg: '/assets/hero/hero-5.jpg',
    tag: '戏台掠影',
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
        padding: 'clamp(64px, 9vh, 120px) 24px clamp(48px, 6vh, 80px)',
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

        {/* 轮播：5 张戏台影像（有图用图，无图回退渐变） */}
        <div className="hero-carousel">
          {slides.map((s, i) => (
            <div
              key={s.key}
              className={`hero-slide${i === active ? ' active' : ''}`}
              style={{
                background: `linear-gradient(to top, rgba(15, 10, 8, 0.62) 0%, rgba(15, 10, 8, 0.18) 45%, rgba(15, 10, 8, 0) 72%), url(${s.bg}) center / cover no-repeat, ${s.gradient}`,
              }}
            >
              <div className="hero-slide-meta">
                <span className="hero-slide-tag">{s.tag}</span>
                <span className="hero-slide-title">{s.title}</span>
                <span className="hero-slide-caption">{s.caption}</span>
              </div>
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
    </section>
  );
}
