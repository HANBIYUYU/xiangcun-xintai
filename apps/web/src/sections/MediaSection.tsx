import { useEffect, useState } from 'react';
import { PlayCircleFilled } from '@ant-design/icons';
import { redPlaysAPI, newsAPI } from '../api';

/**
 * 第 3 屏 · 影像与动态（redo 方案）：
 * 左侧专题短片（1 大 + 2 小，接 /api/red-plays）
 * 右侧最新动态新闻列表（接 /api/news）
 * 加载中显示骨架屏，接口失败回退内置示例
 */
interface Film {
  title: string;
  tag: string;
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
  { title: '红色戏台 · 桂阳记忆', tag: '纪录片' },
  { title: '湘昆腔韵 · 戏台新生', tag: '非遗影像', gold: true },
  { title: '古建重生 · 数字建档', tag: '技术记录' },
];

const FALLBACK_NEWS: NewsItem[] = [
  { date: '2025.03.15', tag: '研学', title: '桂阳古戏台红色研学季启动', summary: '上海大学与桂阳县文旅局联合推出研学线路，以戏台为课堂重温红色记忆。' },
  { date: '2025.02.28', tag: '档案', title: '第三批古戏台数字档案上线', summary: '新增多座戏台三维模型与口述史料，数字档案持续扩充。' },
  { date: '2025.01.20', tag: '合作', title: '湘昆非遗传承人入驻文化馆', summary: '首批湘昆唱段数字档案完成采集与整理，非遗影像持续更新。' },
];

function formatDate(d: string): string {
  const s = (d || '').replace(/[-/]/g, '.').slice(0, 10);
  return s || '—';
}

/** 标签着色：研学=戏台红（默认），档案=深褐，合作/共建=湘昆金 */
function tagClass(tag: string): string {
  if (/档案|建档|台账/.test(tag)) return 'news-tag dark';
  if (/合作|共建|入驻|签约/.test(tag)) return 'news-tag gold';
  return 'news-tag';
}

export default function MediaSection() {
  const [films, setFilms] = useState<Film[] | null>(null);
  const [news, setNews] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    redPlaysAPI.list({ category: '演出视频', limit: 3 })
      .then((res: any) => {
        const list: any[] = res.list || [];
        const fallbackTags = ['纪录片', '非遗影像', '技术记录'];
        setFilms(list.map((p, i) => ({
          title: p.title,
          tag: p.category || fallbackTags[i % fallbackTags.length],
          gold: i === 1,
          cover_url: p.cover_url,
        })));
      })
      .catch(() => setFilms([]));

    newsAPI.list({ limit: 3 })
      .then((res: any) => {
        const list: any[] = res.list || [];
        setNews(list.map((n) => ({
          date: formatDate(n.date),
          tag: n.category || '动态',
          title: n.title,
          summary: n.content ? n.content.slice(0, 60) + '…' : '',
        })));
      })
      .catch(() => setNews([]));
  }, []);

  const filmList = films === null || films.length === 0 ? FALLBACK_FILMS : films;
  const newsList = news === null || news.length === 0 ? FALLBACK_NEWS : news;
  const filmsLoading = films === null;
  const newsLoading = news === null;

  const [main, ...subs] = filmList.slice(0, 3);

  return (
    <section id="media" className="section-block" style={{ background: '#FAF7F2', borderTop: '1px solid rgba(163, 35, 43, 0.12)' }}>
      <div className="container">
        <div className="home-section-head">
          <h2 className="home-section-title">影像与动态</h2>
          <p className="home-section-sub">红色戏台与湘昆非遗影像，校地红旅合作最新进展</p>
        </div>

        <div className="media-section-grid">
          {/* 左：专题短片 */}
          <div>
            {filmsLoading ? (
              <>
                <div className="skeleton" style={{ aspectRatio: '16 / 9', width: '100%' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <div className="skeleton" style={{ aspectRatio: '16 / 9', width: '100%' }} />
                  <div className="skeleton" style={{ aspectRatio: '16 / 9', width: '100%' }} />
                </div>
              </>
            ) : (
              <>
                {/* 主视频卡片 */}
                <div className="film-main">
                  {main.cover_url ? (
                    <div className="film-main-cover" style={{ backgroundImage: `url(${main.cover_url})` }} />
                  ) : null}
                  <span className="film-tag-badge">{main.tag}</span>
                  <div className="film-play"><PlayCircleFilled /></div>
                  <div className="film-title-overlay">{main.title}</div>
                </div>
                {/* 次要视频卡片 */}
                <div className="film-subs">
                  {subs.map((f) => (
                    <div key={f.title} className={`film-sub${f.gold ? ' gold' : ''}`}>
                      {f.cover_url ? (
                        <div className="film-main-cover" style={{ backgroundImage: `url(${f.cover_url})` }} />
                      ) : null}
                      <span className="film-tag-badge">{f.tag}</span>
                      <div className="film-play"><PlayCircleFilled /></div>
                      <div className="film-sub-title">{f.title}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 右：最新动态 */}
          <div>
            {newsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="skeleton" style={{ height: 120, width: '100%', background: '#EAE0D6' }} />
                ))}
              </div>
            ) : (
              <div className="news-list">
                {newsList.map((n, i) => (
                  <div key={`${n.title}-${i}`} className="news-item">
                    <div className="news-item-top">
                      <span className="news-item-date">{n.date}</span>
                      <span className={tagClass(n.tag)}>{n.tag}</span>
                    </div>
                    <div className="news-item-title">{n.title}</div>
                    <div className="news-item-summary">{n.summary}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
