import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  BankOutlined,
  EnvironmentOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { scrollToSection } from '../utils/scroll';
import { statsAPI } from '../api';

/**
 * 首屏 Hero（redo 方案）：
 * 全屏古戏台摄影滑窗（手动切换，不自动轮播）
 * + 标题区（左中偏上） + 底部 5 张入口卡片 + 弹跳向下箭头
 * 未放图时回退到暗色渐变面板
 */
const slides = [
  { key: 'slide-1', bg: '/api/files/hero/hero-1.jpg' },
  { key: 'slide-2', bg: '/api/files/hero/hero-2.jpg' },
  { key: 'slide-3', bg: '/api/files/hero/hero-3.jpg' },
  { key: 'slide-4', bg: '/api/files/hero/hero-4.jpg' },
  { key: 'slide-5', bg: '/api/files/hero/hero-5.jpg' },
];

const entrances = [
  { key: 'archive', icon: <BankOutlined />, title: '戏台数字档案', desc: '动态档案数', path: '/archive' },
  { key: 'map', icon: <EnvironmentOutlined />, title: '古戏台数字地图', desc: '在桂阳山水间定位百年戏台', path: '/map' },
  { key: 'hall', icon: <DeploymentUnitOutlined />, title: '三维古建展厅', desc: '走进戏台内部，看梁架结构', path: '/3d' },
  { key: 'culture', icon: <ReadOutlined />, title: '红色湘昆文化馆', desc: '湘昆腔韵与红色戏台记忆', path: '/culture' },
  { key: 'mall', icon: <ShoppingOutlined />, title: '乡村文旅商城', desc: '把戏台记忆带回家', path: '/mall' },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [stageCount, setStageCount] = useState<number | null>(null);
  const navigate = useNavigate();

  // 档案数动态读数据库（/api/stats），不写死
  useEffect(() => {
    statsAPI.overview().then((res: any) => setStageCount(res.stages ?? null)).catch(() => undefined);
  }, []);

  // 每 8 秒自动切换一张滑窗（手动点击箭头/圆点仍可切换）
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i: number) => setActive((i + slides.length) % slides.length);

  // 档案卡描述：真实数据库数量
  const archiveDesc = stageCount != null
    ? `查阅 ${stageCount} 座文保戏台的数字化档案`
    : '查阅桂阳各级文保戏台的数字化档案';
  const entranceCards = entrances.map((e) =>
    e.key === 'archive' ? { ...e, desc: archiveDesc } : e
  );

  return (
    <section id="hero" className="hero-root">
      {/* 背景滑窗层（暗色渐变回退 + 实拍图 + 暗化遮罩） */}
      {slides.map((s, i) => (
        <div
          key={s.key}
          className={`hero-slide-bg${i === active ? ' active' : ''}`}
          style={{
            backgroundImage: `url(${s.bg}), linear-gradient(135deg, #2B1D1A 0%, #4A3B38 100%)`,
          }}
        />
      ))}

      {/* 左右切换箭头 */}
      <button
        className="hero-arrow left"
        aria-label="上一张"
        onClick={() => goTo(active - 1)}
      >
        <LeftOutlined />
      </button>
      <button
        className="hero-arrow right"
        aria-label="下一张"
        onClick={() => goTo(active + 1)}
      >
        <RightOutlined />
      </button>

      <div className="hero-inner">
        {/* 标题区：左中偏上 */}
        <div className="hero-text">
          <h1 className="hero-title">湘村新台</h1>
          <p className="hero-subtitle">让百年戏台在数字时代重焕红色光芒</p>
          <button className="btn-explore" onClick={() => scrollToSection('story')}>
            开始探索
          </button>
        </div>

        {/* 底部入口卡片（融入首屏） */}
        <div className="hero-entrances">
          {entranceCards.map((e) => (
            <div
              key={e.key}
              className="entrance-chip"
              role="button"
              tabIndex={0}
              onClick={() => navigate(e.path)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') navigate(e.path);
              }}
            >
              <div className="entrance-chip-icon">{e.icon}</div>
              <div className="entrance-chip-title">{e.title}</div>
              <div className="entrance-chip-desc">{e.desc}</div>
              <span className="entrance-chip-go">进入 →</span>
            </div>
          ))}
        </div>
      </div>

      {/* 底部栏：圆点指示器 + 影像计数 */}
      <div className="hero-bottom">
        <div className="hero-dots">
          {slides.map((s, i) => (
            <button
              key={s.key}
              className={`hero-dot${i === active ? ' active' : ''}`}
              aria-label={`切换到影像 ${i + 1}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <span className="hero-counter">影像 {active + 1} / {slides.length}</span>
      </div>

      {/* 弹跳向下箭头 */}
      <div className="hero-chevron" role="button" aria-label="向下探索" onClick={() => scrollToSection('story')}>
        <DownOutlined />
      </div>
    </section>
  );
}
