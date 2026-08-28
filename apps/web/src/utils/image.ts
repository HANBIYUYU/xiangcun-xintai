/** 缩略图 URL：列表/弹窗等小图场景用 600px 缩略图，详情用原图（1600px） */
export function thumbUrl(url?: string): string {
  if (!url) return ''
  return url.replace('/stage-images/', '/stage-images/thumb-')
}
