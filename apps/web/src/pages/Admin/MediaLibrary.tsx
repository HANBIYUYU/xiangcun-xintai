import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button, Empty, Input, Modal, Popconfirm, Select, Space, Spin, Switch, Tag, Upload, message,
} from 'antd'
import {
  CloudUploadOutlined, CopyOutlined, DeleteOutlined, PictureOutlined, ReloadOutlined, SearchOutlined,
} from '@ant-design/icons'
import { mediaAPI } from '../../api'

type Asset = { key: string; size: number }

/** 系统目录（自动维护，如戏台实拍+缩略图）：默认在素材库/选择器中隐藏，可打开「系统目录」查看 */
export const SYSTEM_DIRS = ['xitai_photos', 'uploads', 'placeholder_img']
/** 上传可选目录（图床可管理，含官方素材目录） */
export const UPLOAD_DIRS = ['hero', 'trend_cover', 'videos', 'maps', 'placeholder_img']

/** R2 key → 可访问 URL（按段编码，兼容中文文件名） */
export const mediaUrl = (key: string) => '/api/files/' + key.split('/').map(encodeURIComponent).join('/')
export const isImageKey = (k: string) => /\.(jpe?g|png|webp|gif)$/i.test(k)
export const isVideoKey = (k: string) => /\.(mp4|webm|mov)$/i.test(k)
export const dirOfKey = (k: string) => (k.includes('/') ? k.split('/')[0] : '其他')
const isSystem = (k: string) => SYSTEM_DIRS.includes(dirOfKey(k))
const fmtSize = (n: number) => (n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : n >= 1024 ? Math.round(n / 1024) + ' KB' : n + ' B')

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

/** 上传子窗口：预览素材 + 选择目录（独立界面，不再放在页面顶部） */
function UploadMediaModal({ open, onCancel, onDone }: { open: boolean; onCancel: () => void; onDone: () => void }) {
  const [dir, setDir] = useState(UPLOAD_DIRS[0])
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [busy, setBusy] = useState(false)

  const reset = () => { setFile(null); setPreview(''); setBusy(false) }
  const pickFile = (f: File) => {
    setFile(f)
    setPreview(f ? URL.createObjectURL(f) : '')
  }
  const beforeUpload = (f: File) => {
    const ok = /\.(jpe?g|png|webp|gif|mp4|webm|mov)$/i.test(f.name)
    if (!ok) message.error('仅支持图片 / 短视频')
    if (ok) pickFile(f)
    return false // 手动上传
  }
  const doUpload = async () => {
    if (!file) { message.warning('请先选择文件'); return }
    setBusy(true)
    try {
      await mediaAPI.uploadOfficial(file, dir)
      message.success('上传成功')
      reset()
      onDone()
      onCancel()
    } catch (e: any) {
      message.error(e?.error || '上传失败')
    } finally {
      setBusy(false)
    }
  }

  const isV = file ? /\.(mp4|webm|mov)$/i.test(file.name) : false

  return (
    <Modal
      title="上传素材"
      open={open}
      onCancel={() => { reset(); onCancel() }}
      onOk={doUpload}
      okText={busy ? '上传中…' : '确认上传'}
      confirmLoading={busy}
      okButtonProps={{ disabled: !file }}
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: '100%' }} size={14}>
        <div>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>1. 选择素材文件夹</div>
          <Select value={dir} onChange={setDir} style={{ width: '100%' }} options={UPLOAD_DIRS.map((d) => ({ value: d, label: `${d}（${dirHint(d)}）` }))} />
        </div>
        <div>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>2. 选择文件（可预览）</div>
          <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime">
            <Button icon={<PictureOutlined />} block>选择图片 / 视频</Button>
          </Upload>
        </div>
        {file && preview && (
          <div style={{ border: '1px dashed #ddd', borderRadius: 10, padding: 10, textAlign: 'center', background: '#fafafa' }}>
            {isV ? (
              <video src={preview} controls style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 8, background: '#000' }} />
            ) : (
              <img src={preview} alt="预览" style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 8 }} />
            )}
            <div style={{ marginTop: 6, color: '#666', fontSize: 13 }}>{file.name} · {fmtSize(file.size)}</div>
          </div>
        )}
      </Space>
    </Modal>
  )
}

const dirHint = (d: string) => ({
  hero: '首页滑窗', trend_cover: '资讯/动态封面', videos: '演出视频', maps: '专题图', placeholder_img: '占位图',
}[d] || '')

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

/** 通用浏览区（页面自然滚动，无内层滚动条） */
function AssetGrid({ assets, kw, dir, showSystem, onCopy, onDelete, onSelect }: {
  assets: Asset[]
  kw: string
  dir: string
  showSystem: boolean
  onCopy?: (k: string) => void
  onDelete?: (k: string) => void
  onSelect?: (k: string) => void
}) {
  const list = useMemo(() => assets.filter((a) =>
    (showSystem || !isSystem(a.key)) &&
    (dir === '全部' || dirOfKey(a.key) === dir) &&
    (!kw || a.key.toLowerCase().includes(kw.toLowerCase()))
  ), [assets, kw, dir, showSystem])

  if (list.length === 0) return <Empty description="暂无素材，点右上角「上传素材」添加" style={{ padding: 40 }} />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
      {list.map((a) => (
        <AssetCard key={a.key} asset={a} onCopy={onCopy} onDelete={onDelete} onSelect={onSelect} />
      ))}
    </div>
  )
}

/** 素材库（图床）管理页：/admin/media —— 页面无内层滚动条，随内容自然滚动 */
export function MediaLibraryPage() {
  const { assets, loading, reload } = useAssets()
  const [kw, setKw] = useState('')
  const [dir, setDir] = useState('全部')
  const [showSystem, setShowSystem] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

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
          <Button type="primary" icon={<CloudUploadOutlined />} onClick={() => setUploadOpen(true)}>上传素材</Button>
          <Button icon={<ReloadOutlined />} onClick={reload}>刷新</Button>
        </Space>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <Select style={{ width: 150 }} value={dir} onChange={setDir} options={dirOptions(assets, showSystem)} />
        <Input allowClear prefix={<SearchOutlined />} placeholder="搜索文件名" value={kw} onChange={(e) => setKw(e.target.value)} style={{ maxWidth: 240 }} />
        <Switch checked={showSystem} onChange={setShowSystem} checkedChildren="含系统目录" unCheckedChildren="隐藏系统目录" />
        <span style={{ color: '#999', fontSize: 13 }}>系统目录（戏台实拍/缩略图/投稿）默认隐藏，仅展示可管理素材</span>
      </div>
      <Spin spinning={loading}>
        <AssetGrid assets={assets} kw={kw} dir={dir} showSystem={showSystem} onCopy={copy} onDelete={remove} />
      </Spin>
      <UploadMediaModal open={uploadOpen} onCancel={() => setUploadOpen(false)} onDone={reload} />
    </div>
  )
}

function dirOptions(assets: Asset[], showSystem: boolean) {
  const dirs = new Set<string>(['全部'])
  assets.forEach((a) => { if (showSystem || !isSystem(a.key)) dirs.add(dirOfKey(a.key)) })
  return [...dirs].map((d) => ({ value: d, label: d }))
}

/** 素材选择弹窗：内容表单「素材库」按钮使用（同样默认隐藏系统目录） */
export function MediaPickerModal({ open, onCancel, onSelect }: {
  open: boolean
  onCancel: () => void
  onSelect: (url: string) => void
}) {
  const { assets, loading, reload } = useAssets()
  const [kw, setKw] = useState('')
  const [dir, setDir] = useState('全部')
  const [showSystem, setShowSystem] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <Modal
      title="从素材库选择"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={860}
      destroyOnClose
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <Select style={{ width: 140 }} value={dir} onChange={setDir} options={dirOptions(assets, showSystem)} />
        <Input allowClear prefix={<SearchOutlined />} placeholder="搜索文件名" value={kw} onChange={(e) => setKw(e.target.value)} style={{ maxWidth: 200 }} />
        <Switch checked={showSystem} onChange={setShowSystem} checkedChildren="系统目录" unCheckedChildren="隐藏系统目录" />
        <Button icon={<CloudUploadOutlined />} onClick={() => setUploadOpen(true)}>上传素材</Button>
      </div>
      <Spin spinning={loading}>
        <AssetGrid
          assets={assets} kw={kw} dir={dir} showSystem={showSystem}
          onSelect={(k) => { onSelect(mediaUrl(k)); onCancel() }}
        />
      </Spin>
      <UploadMediaModal open={uploadOpen} onCancel={() => setUploadOpen(false)} onDone={reload} />
    </Modal>
  )
}
