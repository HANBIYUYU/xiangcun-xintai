import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TransparentNav from '../components/TransparentNav';
import BackToTop from '../components/BackToTop';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import MediaSection from '../sections/MediaSection';
import Footer from '../components/Footer';
import { scrollToSection } from '../utils/scroll';

/**
 * 首页（redo 方案 · 4 屏结构）：
 * 第 1 屏 Hero（全屏背景滑窗 + 5 入口卡片）
 * 第 2 屏 守护故事（左文右数字卡 + 媒体 marquee）
 * 第 3 屏 影像与动态（左短片 /api/red-plays + 右新闻 /api/news）
 * 第 4 屏 页脚
 */
export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // 与「开始探索」按钮同一套锚点逻辑（含导航偏移 + 标题块对齐）
      requestAnimationFrame(() => scrollToSection(hash.replace('#', '')));
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [hash]);

  return (
    <div style={{ background: 'var(--color-surface)' }}>
      <TransparentNav />
      <HeroSection />
      <AboutSection />
      <MediaSection />
      <Footer />
      <BackToTop />
    </div>
  );
}
