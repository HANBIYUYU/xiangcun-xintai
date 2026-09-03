import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button, Empty, Input, Modal, Popconfirm, Select, Space, Spin, Tag, Upload, message,
} from 'antd'
import {
  CloudUploadOutlined, CopyOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined,
} from '@ant-design/icons'
import { mediaAPI } from '../../api'

type Asset = { key: string; size: number }

/** 官方上传目录（与后端白名单一致；uploads/ 走游客通道不在图床直传） */
export const UPLOAD_DIRS = ['hero', 'xitai_photos', 'maps', 'trend_cover', 'videos', 'placeholder_img']

/** 把 R2 key 转成可访问 URL（按段编码，兼容中文文件名） */
export const mediaUrl = (key: string) => '/api/files/' + key.split('/').map(encodeURIComponent).join('/')
export const isImageKey = (k: string) => /\.(jpe?g|png|webp|gif)$/i.test(k)
export const isVideoKey = (k: string) => /\.(mp4|webm|mov)$/i.test(k)
export const dirOfKey = (k: string) => (k.includes('/') ? k.split('/')[0] : '其他')
const fmtSize = (n: number) => (n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : n >= 1024 ? Math.round(n / 1024) + ' KB' : n + ' B')

/** 拉取 R2 对象清单 */
function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const reload = useCallback(() => {
    setLoading(true)
    mediaAPI.list()
      .then((res: any) => setAssets(res.objects || []))
      .catch(() => message.error('素材加载失败'))
      .finally(() => setLoading(false))
  }, [])
  useEffect(() => { reload() }, [reload])
  return { assets, loading, reload }
}

/** 上传控件：选目录 + 选文件 */
function UploadControl({ onDone }: { onDone: () => void }) {
  const [dir, setDir] = useState('xitai_photos')
  const [busy, setBusy] = useState(false)
  const customUpload = async (opt: any) => {
    const { file, onSuccess, onError } = opt
    setBusy(true)
    try {
      await mediaAPI.uploadOfficial(file as File, dir)
      message.success('上传成功')
      onDone()
      onSuccess?.(file)
    } catch (e: any) {
      message.error(e?.error || '上传失败')
      onError?.(e)
    } finally {
      setBusy(false)
    }
  }
  return (
    <Space.Compact>
      <Select value={dir} onChange={setDir} style={{ width: 150 }} options={UPLOAD_DIRS.map((d) => ({ value: d, label: d }))} />
      <Upload customRequest={customUpload} accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" showUploadList={false}>
        <Button type="primary" icon={<CloudUploadOutlined />} loading={busy}>上传图片/视频</Button>
      </Upload>
    </Space.Compact>
  )
}

function AssetCard({ asset, onCopy, onDelete, onSelect }: {
  asset: Asset
  onCopy?: (k: string) => void
  onDelete?: (k: string) => void
  onSelect?: (k: string) => void
}) {
  const k = asset.key
  const url = mediaUrl(k)
  const isV = isVideoKey(k)
  const isI = isImageKey(k)
  return (
    <div style={{
      border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', background: '#fff',
      cursor: onSelect ? 'pointer' : 'default', display: 'flex', flexDirection: 'column',
      transition: 'all .2s', boxShadow: '0 1px 4px rgba(0,0,0,.04)',
    }}>
      <div
        style={{ height: 112, background: '#f6f4ee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        onClick={() => onSelect?.(k)}
      >
        {isI ? (
          <img src={url} alt={k} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : isV ? (
          <video src={url} muted preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Tag>文件</Tag>
        )}
      </div>
      <div style={{ padding: '6px 8px', fontSize: 11, color: '#666' }}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }} title={k}>{k}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{fmtSize(asset.size)}</span>
          <span onClick={(e) => e.stopPropagation()}>
            {onCopy && <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => onCopy(k)} />}
            {onDelete && (
              <Popconfirm title="删除该素材？" description="被内容引用的图片/视频将无法显示" onConfirm={() => onDelete(k)}>
                <Button size="small" type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

/** 素材库（图床）管理页：/admin/media */
export function MediaLibraryPage() {
  const { assets, loading, reload } = useAssets()
  const [kw, setKw] = useState('')
  const [dir, setDir] = useState('全部')

  const list = useMemo(() => assets.filter((a) =>
    (dir === '全部' || dirOfKey(a.key) === dir) &&
    (!kw || a.key.toLowerCase().includes(kw.toLowerCase()))
  ), [assets, kw, dir])

  const dirOptions = useMemo(() => ['全部', ...Array.from(new Set(assets.map((a) => dirOfKey(a.key))))], [assets])

  const copy = async (k: string) => {
    try {
      await navigator.clipboard.writeText(mediaUrl(k))
      message.success('URL 已复制，可直接粘贴到内容表单')
    } catch { message.error('复制失败，请手动复制') }
  }
  const remove = async (k: string) => {
    try {
      await mediaAPI.remove(k)
      message.success('已删除')
      reload()
    } catch (e: any) { message.error(e?.error || '删除失败') }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>素材库（R2 图床）</h2>
        <Space wrap>
          <UploadControl onDone={reload} />
          <Button icon={<ReloadOutlined />} onClick={reload}>刷新</Button>
        </Space>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <Select style={{ width: 150 }} value={dir} onChange={setDir} options={dirOptions.map((d) => ({ value: d, label: d }))} />
        <Input allowClear prefix={<SearchOutlined />} placeholder="搜索文件名" value={kw} onChange={(e) => setKw(e.target.value)} style={{ maxWidth: 260 }} />
        <span style={{ color: '#999', fontSize: 13 }}>共 {list.length} 个素材 · 官方目录素材可被内容表单「素材库」按钮直接选用</span>
      </div>
      <Spin spinning={loading}>
        {list.length === 0 ? (
          <Empty description="暂无素材，选目录后上传图片 / 视频" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
            {list.map((a) => <AssetCard key={a.key} asset={a} onCopy={copy} onDelete={remove} />)}
          </div>
        )}
      </Spin>
    </div>
  )
}

/** 素材选择弹窗：供内容表单的「素材库」按钮使用 */
export function MediaPickerModal({ open, onCancel, onSelect }: {
  open: boolean
  onCancel: () => void
  onSelect: (url: string) => void
}) {
  const { assets, loading, reload } = useAssets()
  const [kw, setKw] = useState('')
  const list = useMemo(() => assets.filter((a) => !kw || a.key.toLowerCase().includes(kw.toLowerCase())), [assets, kw])

  return (
    <Modal
      title="从素材库选择"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={860}
      destroyOnClose
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
        <UploadControl onDone={reload} />
        <Input allowClear prefix={<SearchOutlined />} placeholder="搜索文件名" value={kw} onChange={(e) => setKw(e.target.value)} style={{ maxWidth: 240 }} />
      </div>
      <Spin spinning={loading}>
        {list.length === 0 ? <Empty description="素材库为空" /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, maxHeight: '56vh', overflow: 'auto', paddingRight: 4 }}>
            {list.map((a) => (
              <AssetCard key={a.key} asset={a} onSelect={(k) => { onSelect(mediaUrl(k)); onCancel() }} />
            ))}
          </div>
        )}
      </Spin>
    </Modal>
  )
}
