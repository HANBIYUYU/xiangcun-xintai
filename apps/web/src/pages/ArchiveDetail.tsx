import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Spin, Tag, Space, Descriptions, message, Result } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, AudioOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
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
            <Tag>{stage.damage}</Tag>
            <span className="text-caption">{stage.town} · {stage.built_year || '年代待考'} · {stage.style || '形制待考'}</span>
          </Space>
        </div>
        <Space>
          <Button icon={<FilePdfOutlined />} onClick={exportPdf}>导出档案 PDF</Button>
          <Link to="/archive"><Button icon={<ArrowLeftOutlined />}>返回列表</Button></Link>
        </Space>
      </div>

      <div style={{ height: 220, borderRadius: 8, overflow: 'hidden', marginBottom: 20, background: 'linear-gradient(135deg,#A3232B,#C0392B,#D4A017)' }}>
        {stage.cover_url
          ? <img src={stage.cover_url} alt={stage.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : null}
      </div>

      <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small" style={{ marginBottom: 20 }}>
        <Descriptions.Item label="档案编号">{stage.id}</Descriptions.Item>
        <Descriptions.Item label="所属乡镇">{stage.town || '—'}</Descriptions.Item>
        <Descriptions.Item label="文保等级">{stage.heritage_level || '—'}</Descriptions.Item>
        <Descriptions.Item label="破损程度">{stage.damage || '—'}</Descriptions.Item>
        <Descriptions.Item label="始建年代">{stage.built_year || '—'}</Descriptions.Item>
        <Descriptions.Item label="建筑形制">{stage.style || '—'}</Descriptions.Item>
        <Descriptions.Item label="经度">{stage.lng != null ? stage.lng.toFixed(4) : '—'}</Descriptions.Item>
        <Descriptions.Item label="纬度">{stage.lat != null ? stage.lat.toFixed(4) : '—'}</Descriptions.Item>
      </Descriptions>

      {blocks.filter((b) => b.content).map((b) => (
        <div key={b.title} className="detail-block" style={{ background: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, color: '#A3232B', marginBottom: 8 }}>{b.title}</h2>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, margin: 0 }}>{b.content}</p>
        </div>
      ))}

      {stage.audio_url && (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
          <h2 style={{ fontSize: 16, color: '#A3232B', marginBottom: 8 }}>村民口述音频</h2>
          <Button icon={<AudioOutlined />} href={stage.audio_url} target="_blank">播放口述音频</Button>
        </div>
      )}

      {!blocks.some((b) => b.content) && !stage.audio_url && (
        <div className="placeholder-note">该戏台档案正在补录中，史料与红色事迹将陆续完善。</div>
      )}
    </PageLayout>
  );
}
