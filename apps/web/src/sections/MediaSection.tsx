import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';
import { redPlaysAPI, newsAPI } from '../api';

/**
 * 第 3 屏 · 影像与动态：
 * 左右两列等宽、无外框；每列固定高度 + 内层各自滚动（slidebar）。
 * 左侧「首页影像」B 站式卡片：封面在上、标题文字在下；
 * 右侧「最新动态」列表行，点击弹出详情阅读（正文链接可点）。
 */
interface Film {
  id?: number;
  title: string;
  tag: string;
  cover_url?: string;
  iframe_src?: string;
}
interface NewsItem {
  id?: number;
  date: string;
  tag: string;
  title: string;
  summary: string;
  content?: string;
  cover_url?: string;
}

const FALLBACK_FILMS: Film[] = [
  { title: '红色戏台 · 桂阳记忆', tag: '纪录片' },
  { title: '湘昆腔韵 · 戏台新生', tag: '非遗影像' },
  { title: '古建重生 · 数字建档', tag: '技术记录' },
  { title: '台前幕后 · 口述寻访', tag: '访谈' },
  { title: '戏台修缮 · 匠心实录', tag: '纪实' },
];

const FALLBACK_NEWS: NewsItem[] = [
  { date: '2025.03.15', tag: '研学', title: '桂阳古戏台红色研学季启动', summary: '上海大学与桂阳县文旅局联合推出研学线路，以戏台为课堂重温红色记忆。' },
  { date: '2025.02.28', tag: '档案', title: '第三批古戏台数字档案上线', summary: '新增多座戏台三维模型与口述史料，数字档案持续扩充。' },
  { date: '2025.01.20', tag: '合作', title: '湘昆非遗传承人入驻文化馆', summary: '首批湘昆唱段数字档案完成采集与整理，非遗影像持续更新。' },
  { date: '2025.01.05', tag: '共建', title: '校地共建红色实践基地', summary: '高校团队与桂阳共建红色研学与非遗实践基地。' },
];

function formatDate(d: string): string {
  const s = (d || '').replace(/[-/]/g, '.').slice(0, 10);
  return s || '—';
}

function tagClass(tag: string): string {
  if (/档案|建档|台账/.test(tag)) return 'news-tag dark';
  if (/合作|共建|入驻|签约/.test(tag)) return 'news-tag gold';
  return 'news-tag';
}

/** 判断视频源是直链文件（R2 /api/files 或 mp4 等）还是网页/iframe 嵌入 */
export function isDirectVideoUrl(src: string): boolean {
  return src.startsWith('/api/files/') || /\.(mp4|webm|mov)(\?|#|$)/i.test(src);
}

/** 正文里的 http(s) 链接渲染成可点击超链接 */
function linkify(text?: string) {
  if (!text) return null;
  const parts = String(text).split(/(https?:\/\/[^\s\u4e00-\u9fa5，。；、（）】》"'）]+)/g);
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? (
      <a key={i} href={p} target="_blank" rel="noopener noreferrer" style={{ color: '#A3232B', wordBreak: 'break-all' }}>
        {p}
      </a>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function MediaSection() {
  const [films, setFilms] = useState<Film[] | null>(null);
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [reading, setReading] = useState<NewsItem | null>(null);
  const [player, setPlayer] = useState<Film | null>(null);

  useEffect(() => {
    redPlaysAPI.list({ category: '演出视频', limit: 8 })
      .then((res: any) => {
        const list: any[] = res.list || [];
        setFilms(list.map((p) => ({
          id: p.id, title: p.title, tag: p.category || '演出视频',
          cover_url: p.cover_url, iframe_src: p.iframe_src,
        })));
      })
      .catch(() => setFilms([]));

    newsAPI.list({ limit: 8 })
      .then((res: any) => {
        const list: any[] = res.list || [];
        setNews(list.map((n) => ({
          id: n.id, date: formatDate(n.date), tag: '动态', title: n.title,
          summary: n.content ? String(n.content).slice(0, 60) + (String(n.content).length > 60 ? '…' : '') : '',
          content: n.content, cover_url: n.cover_url,
        })));
      })
      .catch(() => setNews([]));
  }, []);

  const filmList = films === null || films.length === 0 ? FALLBACK_FILMS : films;
  const newsList = news === null || news.length === 0 ? FALLBACK_NEWS : news;
  const filmsLoading = films === null;
  const newsLoading = news === null;

  return (
    <section id="media" className="section-block" style={{ background: '#FAF7F2', borderTop: '1px solid rgba(163, 35, 43, 0.12)' }}>
      <div className="container">
        <div className="home-section-head">
          <h2 className="home-section-title">影像与动态</h2>
          <p className="home-section-sub">红色戏台与湘昆非遗影像，校地红旅合作最新进展</p>
        </div>

        <div className="media-section-grid">
          {/* 左：专题短片 —— 原版样式（1 大 + 小卡左右两列延伸），仅加内层滚动 */}
          <div className="media-col">
            <div className="media-col-scroll">
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
                  <div
                    className="film-main"
                    role="button"
                    tabIndex={0}
                    onClick={() => setPlayer(filmList[0])}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlayer(filmList[0]); } }}
                  >
                    {filmList[0].cover_url ? (
                      <div className="film-main-cover" style={{ backgroundImage: `url(${filmList[0].cover_url})` }} />
                    ) : null}
                    <span className="film-tag-badge">{filmList[0].tag}</span>
                    <div className="film-play"><PlayCircleFilled /></div>
                    <div className="film-title-overlay">{filmList[0].title}</div>
                  </div>
                  {/* 次要视频卡片（两两左右延伸） */}
                  <div className="film-subs">
                    {filmList.slice(1).map((f) => (
                      <div
                        key={`${f.id ?? f.title}`}
                        className="film-sub"
                        role="button"
                        tabIndex={0}
                        onClick={() => setPlayer(f)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlayer(f); } }}
                      >
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
          </div>

          {/* 右：最新动态 —— 原版样式，仅加内层滚动 + 点击阅读 */}
          <div className="media-col">
            <div className="media-col-scroll">
              {newsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="skeleton" style={{ height: 110, width: '100%', background: '#EAE0D6' }} />
                  ))}
                </div>
              ) : (
                newsList.map((n, i) => (
                  <div
                    key={`${n.id ?? `${n.title}-${i}`}`}
                    className="news-item"
                    role="button"
                    tabIndex={0}
                    onClick={() => setReading(n)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setReading(n); } }}
                  >
                    <div className="news-item-top">
                      <span className="news-item-date">{n.date}</span>
                      <span className={tagClass(n.tag)}>{n.tag}</span>
                    </div>
                    <div className="news-item-title">{n.title}</div>
                    <div className="news-item-summary">{n.summary}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 动态详情弹窗（与互动阅读一致：正文链接可点） */}
      <Modal
        title={reading?.title}
        open={!!reading}
        onCancel={() => setReading(null)}
        footer={null}
        width={680}
        destroyOnClose
      >
        {reading && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className={tagClass(reading.tag)}>{reading.tag}</span>
              <span style={{ color: '#999', fontSize: 13 }}>{reading.date}</span>
            </div>
            {reading.cover_url && (
              <img
                src={reading.cover_url}
                alt={reading.title}
                loading="lazy"
                style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 10, marginTop: 12 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, marginTop: 12, color: '#3B2A26' }}>
              {linkify(reading.content) || reading.summary || '（正文待补录）'}
            </p>
          </div>
        )}
      </Modal>

      {/* 影像播放弹窗：R2 直链视频用 <video>，网页/B 站嵌入用 iframe */}
      <Modal
        title={player?.title}
        open={!!player}
        onCancel={() => setPlayer(null)}
        footer={null}
        width={860}
        destroyOnClose
      >
        {player?.iframe_src ? (
          isDirectVideoUrl(player.iframe_src) ? (
            <video
              src={player.iframe_src}
              controls
              style={{ width: '100%', borderRadius: 8, background: '#000', aspectRatio: '16 / 9', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                title={player.title}
                src={player.iframe_src}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
                allowFullScreen
              />
            </div>
          )
        ) : (
          <div className="placeholder-note" style={{ margin: 0 }}>
            视频源待接入（可填 B 站嵌入地址，或在素材库选 R2 视频）。
          </div>
        )}
        <p style={{ color: '#888', marginTop: 12 }}>分类：{player?.tag}</p>
      </Modal>
    </section>
  );
}
