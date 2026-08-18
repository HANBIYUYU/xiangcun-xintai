import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';
import TransparentNav from '../components/TransparentNav';
import BackToTop from '../components/BackToTop';
import HeroSection from '../sections/HeroSection';
import EntrancesSection from '../sections/EntrancesSection';
import StatsSection from '../sections/StatsSection';
import FloatingNext from '../components/FloatingNext';
import Footer from '../components/Footer';

/**
 * Home 页面
 * 长滚动单页：Hero → 四大入口 → 数据看板 → 专题短片占位 → 新闻占位 → Footer
 */
export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      // 延迟一帧等 DOM 渲染完再滚动
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [hash]);

  return (
    <div style={{ background: 'var(--color-surface)' }}>
      <TransparentNav />
      <HeroSection />
      <EntrancesSection />
      <StatsSection />

      {/* 专题短片占位区 */}
      <section id="films" style={{ background: 'var(--color-red-soft)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">专题短片</h2>
            <span className="text-caption">红色戏台与湘昆非遗影像（P2 接入视频）</span>
          </div>
          <div className="film-grid">
            {[
              { title: '红色戏台 · 桂阳记忆', desc: '重走红色旧址戏台，聆听革命故事', gold: false },
              { title: '湘昆腔韵 · 戏台新生', desc: '国家级非遗湘昆在古戏台上的当代回响', gold: true },
              { title: '古建重生 · 数字建档', desc: '三维重建记录桂阳古戏台的每一处榫卯', gold: false },
            ].map((f) => (
              <div key={f.title} className="card-hover film-card">
                <div className={`video-cover${f.gold ? ' gold' : ''}`}>
                  <PlayCircleOutlined style={{ fontSize: 40 }} />
                </div>
                <div className="film-body">
                  <div className="film-title">{f.title}</div>
                  <div className="film-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 新闻占位区 */}
      <section id="news" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">最新动态</h2>
            <span className="text-caption">文旅活动与项目进展（P2 接入 API）</span>
          </div>
          <div className="news-grid">
            {[
              { date: '2026-07-01', tag: '活动', title: '桂阳古戏台红色研学季启动', summary: '以戏台为课堂，重温红色记忆……' },
              { date: '2026-06-20', tag: '档案', title: '第三批古戏台数字档案上线', summary: '新增 12 座古戏台的建筑形制与口述史……' },
              { date: '2026-06-10', tag: '非遗', title: '湘昆进戏台公益演出预告', summary: '非遗湘昆剧团走进乡村古戏台……' },
            ].map((n) => (
              <div key={n.title} className="card-hover news-card">
                <div className="news-body">
                  <div className="news-meta">
                    <span>{n.date}</span>
                    <span>{n.tag}</span>
                  </div>
                  <div className="news-title">{n.title}</div>
                  <div className="news-summary">{n.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FloatingNext />
      <Footer />
      <BackToTop />
    </div>
  );
}
