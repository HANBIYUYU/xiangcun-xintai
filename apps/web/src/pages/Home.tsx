import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';
import TransparentNav from '../components/TransparentNav';
import BackToTop from '../components/BackToTop';
import HeroSection from '../sections/HeroSection';
import EntrancesSection from '../sections/EntrancesSection';
import StatsSection from '../sections/StatsSection';
import FloatingNext from '../components/FloatingNext';
import Footer from '../components/Footer';
import { redPlaysAPI, newsAPI } from '../api';

interface Film {
  title: string;
  desc: string;
  gold?: boolean;
  cover_url?: string;
}
interface NewsItem {
  date: string;
  tag: string;
  title: string;
  summary: string;
}

const FALLBACK_FILMS: Film[] = [
  { title: '红色戏台 · 桂阳记忆', desc: '重走红色旧址戏台，聆听革命故事', gold: false },
  { title: '湘昆腔韵 · 戏台新生', desc: '国家级非遗湘昆在古戏台上的当代回响', gold: true },
  { title: '古建重生 · 数字建档', desc: '三维重建记录桂阳古戏台的每一处榫卯', gold: false },
];

const FALLBACK_NEWS: NewsItem[] = [
  { date: '2026-07-01', tag: '活动', title: '桂阳古戏台红色研学季启动', summary: '以戏台为课堂，重温红色记忆……' },
  { date: '2026-06-20', tag: '档案', title: '第三批古戏台数字档案上线', summary: '新增 12 座古戏台的建筑形制与口述史……' },
  { date: '2026-06-10', tag: '非遗', title: '湘昆进戏台公益演出预告', summary: '非遗湘昆剧团走进乡村古戏台……' },
];

/**
 * Home 页面（P4 起接入 API）：
 * Hero → 四大入口 → 数据看板（/api/stats）→ 专题短片（/api/red-plays）→ 新闻（/api/news）→ Footer
 */
export default function Home() {
  const { hash } = useLocation();
  const [films, setFilms] = useState<Film[] | null>(null);
  const [news, setNews] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    redPlaysAPI.list({ category: '演出视频', limit: 6 }).then((res: any) => {
      setFilms((res.list || []).map((p: any) => ({
        title: p.title,
        desc: '红色戏台演出影像，点击进入文化馆观看',
        cover_url: p.cover_url,
      })));
    }).catch(() => setFilms([]));

    newsAPI.list({ limit: 3 }).then((res: any) => {
      setNews((res.list || []).map((n: any) => ({
        date: n.date,
        tag: '动态',
        title: n.title,
        summary: n.content ? n.content.slice(0, 60) + '…' : '',
      })));
    }).catch(() => setNews([]));
  }, []);

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
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

  const filmList = films === null || films.length === 0 ? FALLBACK_FILMS : films;
  const newsList = news === null || news.length === 0 ? FALLBACK_NEWS : news;

  return (
    <div style={{ background: 'var(--color-surface)' }}>
      <TransparentNav />
      <HeroSection />
      <EntrancesSection />
      <StatsSection />

      {/* 专题短片区：优先展示 /api/red-plays 的演出视频 */}
      <section id="films" style={{ background: 'var(--color-red-soft)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">专题短片</h2>
            <span className="text-caption">红色戏台与湘昆非遗影像（P7 文化馆可在线播放）</span>
          </div>
          <div className="film-grid">
            {filmList.map((f, i) => (
              <div key={`${f.title}-${i}`} className="card-hover film-card">
                <div className={`video-cover${f.gold ? ' gold' : ''}`}>
                  {f.cover_url
                    ? <img src={f.cover_url} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <PlayCircleOutlined style={{ fontSize: 40 }} />}
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

      {/* 新闻区：优先展示 /api/news 的校地合作动态 */}
      <section id="news" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">最新动态</h2>
            <span className="text-caption">校地红旅合作与项目进展（来自数据后台）</span>
          </div>
          <div className="news-grid">
            {newsList.map((n, i) => (
              <div key={`${n.title}-${i}`} className="card-hover news-card">
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
