import { ReactNode, useEffect } from 'react';
import TransparentNav from './TransparentNav';
import Footer from './Footer';

interface PageLayoutProps {
  /** 页面标题（子页自行渲染大标题时可不传，统一使用 text-h1 样式） */
  title?: string;
  background?: string;
  children: ReactNode;
  /** 兼容旧调用：返回按钮已移除，此参数不再生效 */
  backTo?: string;
  /** 兼容旧调用：返回按钮已移除，此参数不再生效 */
  backLabel?: string;
}

/**
 * 子页面布局：顶部统一完整导航（TransparentNav 常驻浅色模式）
 * + 内容容器（1200 / 左右 24）+ Footer
 * 大标题由各子页使用 .text-h1 渲染（与 Hero 同款衬线字体）
 */
export default function PageLayout({ background = '#FAF7F2', children }: PageLayoutProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <div style={{ background, minHeight: '100vh' }}>
      {/* 完整导航（子页常驻浅色毛玻璃，深色文字） */}
      <TransparentNav solid />

      {/* 内容区：正文最小高度 1500，保证页面观感充实 */}
      <main style={{ paddingTop: 145, paddingBottom: 50, minHeight: 1500 }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
