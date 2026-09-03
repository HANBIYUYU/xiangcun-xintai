/** 缩略图工具（R2 全 thumb 方案后恒等返回）：
 *  2026-09 起 R2 戏台照片只存 600px 缩略图（thumb-*.jpg），
 *  列表/详情/弹窗统一使用同一文件，不再有原图/缩略图之分，无需二次加工。
 *  占位图与专题图同理原样返回。 */
export function thumbUrl(url?: string): string {
  return url || ''
}
