/** 懒加载图片组件：滚动进入视口才加载，配合缩略图显著提速 */
export default function LazyImage({
  src, alt, className, style, eager,
}: {
  src?: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  /** 首屏关键图设为 true（立即加载 + 高优先级） */
  eager?: boolean
}) {
  return (
    <img
      src={src || undefined}
      alt={alt || ''}
      className={className}
      style={style}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
    />
  )
}
