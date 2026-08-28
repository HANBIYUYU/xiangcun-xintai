/** 固定导航高度（top 12 + 内容约 62）——锚点滚动偏移基准 */
export const NAV_OFFSET = 92;

/**
 * 平滑滚动到指定 section，避开固定导航遮挡（手动计算目标坐标）
 * 若目标区块内存在 `.home-section-head`（首页区块标题块），
 * 则以标题块为锚点，避免区块顶部内边距（120/80/60px）造成的
 * 「落点上方悬空大片空白、标题不在导航正下方」的跳转偏差。
 * @param id 目标元素 id
 * @param extraOffset 额外偏移（px，可选）
 */
export function scrollToSection(id: string, extraOffset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  const anchor = el.querySelector<HTMLElement>('.home-section-head') || el;
  const top = anchor.getBoundingClientRect().top + window.scrollY - NAV_OFFSET + extraOffset;
  window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
}
