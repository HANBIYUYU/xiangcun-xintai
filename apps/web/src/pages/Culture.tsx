import { useEffect, useState } from 'react';
import { Tabs, Card, Tag, Modal, Spin, Empty, message } from 'antd';
import { PlayCircleOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import { redPlaysAPI, articlesAPI, activitiesAPI } from '../api';

const TYPE_COLOR: Record<string, string> = {
  红色党课: 'red', 非遗体验: 'gold', 戏曲汇演: 'purple',
};
const STATUS_COLOR: Record<string, string> = {
  报名中: 'green', 已结束: 'default', 已取消: 'red',
};

/** 红色湘昆文化馆（P7）：红色戏曲 / 互动阅读 / 活动预告 */
export default function CulturePage() {
  const [plays, setPlays] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 弹层状态
  const [player, setPlayer] = useState<any>(null);       // 戏曲播放
  const [reading, setReading] = useState<any>(null);     // 阅读详情

  useEffect(() => {
    Promise.all([
      redPlaysAPI.list({ limit: 50 }),
      articlesAPI.list({ limit: 50 }),
      activitiesAPI.list({ limit: 50 }),
    ])
      .then(([p, a, ac]: any[]) => {
        setPlays(p.list || []);
        setArticles(a.list || []);
        setActivities(ac.list || []);
      })
      .catch(() => message.error('文化馆内容加载失败'))
      .finally(() => setLoading(false));
  }, []);

  const items = [
    {
      key: 'reading',
      label: `互动阅读（${articles.length}）`,
      children: loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
      ) : articles.length === 0 ? (
        <Empty description="暂无阅读内容" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {articles.map((a) => (
            <Card key={a.id} hoverable size="small" onClick={() => setReading(a)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontWeight: 600 }}>{a.title}</div>
                <Tag>{a.source || '湘村新台'}</Tag>
              </div>
              <div style={{ color: '#888', fontSize: 13, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {a.content || '（正文待补录）'}
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      key: 'plays',
      label: `红色戏曲（${plays.length}）`,
      children: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {plays.map((p) => (
            <Card
              key={p.id}
              hoverable
              cover={
                <div style={{ height: 150, background: 'linear-gradient(135deg,#A3232B,#C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.cover_url
                    ? <img src={p.cover_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <PlayCircleOutlined style={{ fontSize: 44, color: '#fff' }} />}
                </div>
              }
              onClick={() => setPlayer(p)}
            >
              <Card.Meta
                title={p.title}
                description={<Tag color={p.category === '折子戏' ? 'volcano' : 'blue'}>{p.category}</Tag>}
              />
            </Card>
          ))}
          {plays.length === 0 && !loading && <Empty description="暂无戏曲内容" />}
        </div>
      ),
    },
    {
      key: 'activities',
      label: `活动预告（${activities.length}）`,
      children: loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
      ) : activities.length === 0 ? (
        <Empty description="暂无活动" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activities.map((a) => (
            <Card key={a.id} size="small">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {a.title}
                    <Tag color={TYPE_COLOR[a.type] || 'default'} style={{ marginLeft: 8 }}>{a.type}</Tag>
                    <Tag color={STATUS_COLOR[a.status] || 'default'}>{a.status}</Tag>
                  </div>
                  <div style={{ color: '#888', fontSize: 13, marginTop: 6 }}>
                    <EnvironmentOutlined /> {a.place}　<CalendarOutlined /> {a.start_time?.replace('T', ' ')} 至 {a.end_time?.replace('T', ' ')}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <PageLayout title="红色湘昆文化馆" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">红色湘昆文化馆</h1>
        <p className="text-body">
          汇聚红色戏曲、互动阅读与活动预告，让湘昆非遗在红色文化语境中焕发新生。
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : (
        <Tabs items={items} />
      )}

      {/* 戏曲播放弹层 */}
      <Modal
        title={player?.title}
        open={!!player}
        onCancel={() => setPlayer(null)}
        footer={null}
        width={720}
        destroyOnClose
      >
        {player?.iframe_src ? (
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              title={player.title}
              src={player.iframe_src}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
              allowFullScreen
            />
          </div>
        ) : (
          <div className="placeholder-note" style={{ margin: 0 }}>
            视频源待接入（白名单：bilibili / 腾讯视频 / YouTube），当前为占位封面。
          </div>
        )}
        <p style={{ color: '#888', marginTop: 12 }}>分类：{player?.category}</p>
      </Modal>

      {/* 阅读详情弹层 */}
      <Modal
        title={reading?.title}
        open={!!reading}
        onCancel={() => setReading(null)}
        footer={null}
        width={680}
        destroyOnClose
      >
        <Tag>{reading?.source || '湘村新台'}</Tag>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, marginTop: 12 }}>{reading?.content || '（正文待补录）'}</p>
      </Modal>
    </PageLayout>
  );
}
