/** 缩略图 URL：列表/弹窗等小图场景用 600px 缩略图，详情用原图（1600px）
 *  R2 全量迁移后：戏台实拍存 /api/files/xitai_photos/（缩略图 thumb- 前缀）；
 *  占位图无缩略图，原样返回 */
export function thumbUrl(url?: string): string {
  if (!url) return ''
  if (url.includes('/placeholder_img/')) return url
  if (url.includes('/xitai_photos/')) return url.replace('/xitai_photos/', '/xitai_photos/thumb-')
  // 兼容旧打包路径
  return url.replace('/stage-images/', '/stage-images/thumb-')
}
