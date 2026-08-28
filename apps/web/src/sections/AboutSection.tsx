import { useEffect, useRef, useState } from 'react';
import { RiseOutlined } from '@ant-design/icons';
import { statsAPI } from '../api';

/**
 * 第 2 屏 · 守护故事区（redo 方案）：
 * 左文右图（数字卡片）+ 媒体徽章无限横向滚动
 * 数字卡片：进入视口后 0 → 目标值递增（1500ms，easeOutExpo，仅一次）
 */
const story = [
  '湘村新台——古戏台数字化保护与活态传承实践',
  '桂阳县现存明清古戏台300余座，数量居全国县域前列，是湘昆这一国家级非物质文化遗产的原生土壤。然而，这批不可再生的文化遗产正面临修缮资金短缺、日常维护乏力、年轻受众流失、数字化水平偏低等多重困境。项目团队由上海大学通信与信息工程学院、文学院、社会学院8名本科生组成，以“数字化保护+活态传承”为核心，历时数月深入桂阳县3个街道、7个镇、50余个村庄，实地勘察43座古戏台，完成64段深度访谈，整理访谈文字逾11万字，系统收集110座古戏台的基础资料。基于扎实的一手数据，团队搭建了“桂阳乡村戏台数字档案库”，并在此基础上规划建设“湘村新台”数字文旅平台。',
  '平台以“红色戏台+湘昆非遗”为双主线，规划九大功能模块：首页门户整合戏台数字档案、三维古建展厅、红色湘昆文化馆、乡村文旅商城四大入口；戏台数字档案馆收录110座古戏台完整信息，支持多条件筛选与数据导出；三维古建展厅通过轻量化建模实现戏台720°自由浏览；红色湘昆文化馆集中展示红色改编剧目与线下活动预告；乡土共创交互平台设置红色记忆投稿、建言留言与知识答题小游戏；研学预约服务中心与乡韵文创助农商城打通文化教育、消费助农与戏台保护的资金闭环；分级权限管理后台满足游客、团队与政企管理员的多层次使用需求。',
  '项目成果已获“青春上海”“学习强国”“新湖南”“郴州广电”等十余家主流媒体报道，总浏览量突破32万次。团队已与桂阳县文旅局完成正式座谈并提交活化建议书，初步建立校地合作关系。本项目以青年之力构建“调研—建档—展示—传播—运营”五位一体的乡村文化遗产活化模式，为全国同类文化遗产的数字化保护与乡村振兴融合发展提供可复制的“桂阳样本”。',
];

const numbers = [
  { value: 300, suffix: '+', label: '现存戏台', note: '桂阳县域保存数量居全国前列' },
  { value: 43, suffix: '', label: '实地勘察', note: '覆盖43个村落，逐台测绘记录' },
  { value: 64, suffix: '', label: '深度访谈', note: '村民、工匠、非遗传承人' },
];

const WIDE_NUMBER = { value: 32, suffix: '万+', label: '媒体报道浏览量', note: '青春上海、学习强国等平台' };

const mediaList = ['青春上海', '学习强国', '新湖南', '郴州广电', '湖南日报', '红网'];

/** 数字递增动画（easeOutExpo） */
function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [dbCount, setDbCount] = useState<number | null>(null);
  const wideValue = useCountUp(WIDE_NUMBER.value, inView);

  // 「系统收录」动态读数据库，不写死
  useEffect(() => {
    statsAPI.overview().then((res: any) => setDbCount(res.stages ?? null)).catch(() => undefined);
  }, []);

  // 动态数字卡：现存/勘察/访谈为调研事实，系统收录为平台实时库量
  const dynamicNumbers = [
    ...numbers,
    { value: dbCount ?? 0, suffix: '', label: '系统收录', note: '平台数字档案实时收录' },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="story" className="section-block" ref={ref} style={{ background: '#FAF7F2' }}>
      <div className="container">
        <div className="home-section-head">
          <h2 className="home-section-title">以青年之力 · 守护百年戏台</h2>
          <p className="home-section-sub">桂阳古戏台的现状、行动与数字化未来</p>
        </div>

        <div className="story-grid">
          {/* 左：正文 */}
          <div className="story-text">
            {story.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* 右：动态数字卡片 */}
          <div className="story-numbers">
            {dynamicNumbers.map((n) => (
              <MiniStat key={n.label} {...n} active={inView} />
            ))}
            <div className="stat-wide">
              <div className="stat-wide-icon">
                <RiseOutlined />
              </div>
              <div>
                <div className="stat-wide-value">
                  {wideValue}
                  {WIDE_NUMBER.suffix}
                </div>
                <div className="stat-wide-label">{WIDE_NUMBER.label}</div>
                <div className="stat-wide-note">{WIDE_NUMBER.note}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部整栏：媒体徽章 marquee */}
        <div className="media-marquee">
          <div className="media-track">
            {[...mediaList, ...mediaList].map((m, i) => (
              <span key={`${m}-${i}`} className="media-badge">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ value, suffix, label, note, active }: {
  value: number; suffix: string; label: string; note: string; active: boolean;
}) {
  const n = useCountUp(value, active);
  return (
    <div className="stat-mini">
      <div className="stat-mini-value">{n}{suffix}</div>
      <div className="stat-mini-label">{label}</div>
      <div className="stat-mini-divider" />
      <div className="stat-mini-note">{note}</div>
    </div>
  );
}
