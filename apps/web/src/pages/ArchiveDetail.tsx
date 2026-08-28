import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Spin, Tag, Space, Descriptions, message, Result } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, AudioOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import LazyImage from '../components/LazyImage';
import { stagesAPI } from '../api';

const LEVEL_COLOR: Record<string, string> = {
  国家级: 'red', 省级: 'volcano', 市级: 'gold', 县级: 'blue', 未定级: 'default',
};

/** 单戏台详情页（P5）：史料 / 红色事迹 / 修缮记录 / 口述音频 + 导出 PDF */
export default function ArchiveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [stage, setStage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    stagesAPI.detail(id)
      .then((res: any) => setStage(res))
      .catch((e) => {
        if (e?.error === '戏台不存在') setNotFound(true);
        else message.error('加载失败，请稍后重试');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const exportPdf = () => {
    window.open(`/api/stages/${id}/export`, '_blank');
  };

  if (loading) {
    return (
      <PageLayout title="戏台详情" backTo="/archive" backLabel="返回档案馆">
        <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
      </PageLayout>
    );
  }

  if (notFound || !stage) {
    return (
      <PageLayout title="戏台详情" backTo="/archive" backLabel="返回档案馆">
        <Result status="404" title="未找到该戏台" extra={<Link to="/archive"><Button type="primary">返回档案馆</Button></Link>} />
      </PageLayout>
    );
  }

  const blocks: { title: string; content: string }[] = [
    { title: '建筑史料', content: stage.history_text },
    { title: '红色革命事迹', content: stage.red_story },
    { title: '修缮记录', content: stage.repair_log },
  ];

  return (
    <PageLayout title="戏台详情" backTo="/archive" backLabel="返回档案馆">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 className="text-h1" style={{ marginBottom: 4 }}>
            {stage.name}
            {stage.is_red_site ? <Tag color="red" style={{ marginLeft: 8 }}>红色旧址</Tag> : null}
          </h1>
          <Space size={4}>
            <Tag color={LEVEL_COLOR[stage.heritage_level] || 'default'}>{stage.heritage_level}文保</Tag>
            <span className="text-caption">
              {[stage.town, stage.era || stage.built_year, stage.style].filter(Boolean).join(' · ') || '—'}
            </span>
          </Space>
        </div>
        <Space>
          <Button icon={<FilePdfOutlined />} onClick={exportPdf}>导出档案 PDF</Button>
          <Link to="/archive"><Button icon={<ArrowLeftOutlined />}>返回列表</Button></Link>
        </Space>
      </div>

      {/* 图片框：16:9 比例、限宽居中（详情大图 1600px，懒加载） */}
      <div style={{ maxWidth: 960, margin: '0 auto 20px', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(135deg,#A3232B,#C0392B,#D4A017)' }}>
        {stage.cover_url
          ? <LazyImage src={stage.cover_url} alt={stage.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          : null}
      </div>

      {/* 分组信息：身份 / 属地 / 文保 / 建筑与保护 / 坐标 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 14, color: '#A3232B' }}>身份信息</h3>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="档案编号">{stage.id}</Descriptions.Item>
            {stage.name_en ? <Descriptions.Item label="英文标题">{stage.name_en}</Descriptions.Item> : null}
            <Descriptions.Item label="红色旧址">{stage.is_red_site ? '是' : '否'}</Descriptions.Item>
          </Descriptions>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 14, color: '#A3232B' }}>属地信息</h3>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="所属乡镇">{stage.town || '—'}</Descriptions.Item>
            <Descriptions.Item label="所属省市">{[stage.province, stage.city].filter(Boolean).join(' ')}</Descriptions.Item>
            <Descriptions.Item label="详细地址">{stage.address || '—'}</Descriptions.Item>
            {stage.ancestral_hall ? <Descriptions.Item label="所属宗祠">{stage.ancestral_hall}</Descriptions.Item> : null}
          </Descriptions>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 14, color: '#A3232B' }}>文保信息</h3>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="文保等级">{stage.heritage_level || '—'}</Descriptions.Item>
            {stage.heritage_batch ? <Descriptions.Item label="文保批次">{stage.heritage_batch}</Descriptions.Item> : null}
            {stage.heritage_date ? <Descriptions.Item label="公布时间">{stage.heritage_date}</Descriptions.Item> : null}
            {stage.heritage_type ? <Descriptions.Item label="文保类型">{stage.heritage_type}</Descriptions.Item> : null}
          </Descriptions>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 14, color: '#A3232B' }}>建筑与保护</h3>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="时代">{stage.era || '—'}</Descriptions.Item>
            {stage.built_year ? <Descriptions.Item label="始建年份">{stage.built_year}</Descriptions.Item> : null}
            {stage.style ? <Descriptions.Item label="建筑形制">{stage.style}</Descriptions.Item> : null}
            <Descriptions.Item label="保护现状">{stage.damage || '—'}</Descriptions.Item>
          </Descriptions>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 14, color: '#A3232B' }}>坐标定位</h3>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="经度">{stage.lng != null ? stage.lng.toFixed(4) : '—'}</Descriptions.Item>
            <Descriptions.Item label="纬度">{stage.lat != null ? stage.lat.toFixed(4) : '—'}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      {blocks.filter((b) => b.content).map((b) => (
        <div key={b.title} className="detail-block" style={{ background: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, color: '#A3232B', marginBottom: 8 }}>{b.title}</h2>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, margin: 0 }}>{b.content}</p>
        </div>
      ))}

      {/* 口述访谈（文字） */}
      {stage.oral_history ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, color: '#A3232B', marginBottom: 8 }}>村民口述访谈</h2>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, margin: 0 }}>{stage.oral_history}</p>
        </div>
      ) : null}

      {/* 网络信息（报道/影像链接） */}
      {stage.media_links ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, color: '#A3232B', marginBottom: 8 }}>网络资料</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {stage.media_links.split(/\s+/).filter((t: string) => /^https?:\/\//.test(t)).map((url: string, i: number) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, color: '#A3232B', border: '1px solid rgba(163,35,43,0.25)', borderRadius: 16, padding: '4px 12px', textDecoration: 'none' }}>
                资料 {i + 1} ↗
              </a>
            ))}
          </div>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, margin: '10px 0 0', color: '#666', fontSize: 13 }}>{stage.media_links.replace(/https?:\/\/\S+/g, '')}</p>
        </div>
      ) : null}

      {stage.audio_url && (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
          <h2 style={{ fontSize: 16, color: '#A3232B', marginBottom: 8 }}>村民口述音频</h2>
          <Button icon={<AudioOutlined />} href={stage.audio_url} target="_blank">播放口述音频</Button>
        </div>
      )}

      {!blocks.some((b) => b.content) && !stage.audio_url && !stage.oral_history && (
        <div className="placeholder-note">该戏台档案正在补录中，史料与红色事迹将陆续完善。</div>
      )}
    </PageLayout>
  );
}
