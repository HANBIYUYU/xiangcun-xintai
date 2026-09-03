import { useEffect, useState } from 'react';
import {
  Card, Col, Row, Statistic, Spin, Tag, List, Empty, Button,
} from 'antd';
import { Link } from 'react-router-dom';
import {
  BankOutlined, FlagOutlined, TeamOutlined, WalletOutlined, AuditOutlined, ArrowRightOutlined,
} from '@ant-design/icons';
import { statsAPI, submissionsAPI, ordersAPI } from '../../api';

const QUICK = [
  { key: '/admin/stages', label: '戏台档案', desc: '52 座档案维护' },
  { key: '/admin/films', label: '首页影像', desc: '短片与封面' },
  { key: '/admin/news', label: '首页动态', desc: '校地合作新闻' },
  { key: '/admin/faq', label: '问答库', desc: '台小湘知识库' },
  { key: '/admin/submissions', label: '投稿审核', desc: '红色记忆审核' },
  { key: '/admin/bookings', label: '研学预约', desc: '预约单处理' },
  { key: '/admin/orders', label: '订单', desc: '核销与营收' },
  { key: '/admin/media', label: '素材库', desc: 'R2 图床上传' },
];

/** 管理后台仪表盘：平台统计 + 待办 + 快捷入口 */
export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      statsAPI.overview(),
      ordersAPI.revenue(),
      submissionsAPI.list({ status: '待审核', limit: 5 }),
    ])
      .then(([s, r, sub]: any[]) => { setStats(s); setRevenue(r); setPending(sub.list || []); })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  const valueStyle = { fontSize: 30, fontWeight: 700 };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>仪表盘</h1>
        <span style={{ color: '#999', fontSize: 13 }}>
          {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })} · 数据实时读取
        </span>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="收录戏台" value={stats?.stages ?? 0} suffix=" 座" prefix={<BankOutlined style={{ color: '#A3232B' }} />} valueStyle={valueStyle} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="红色旧址戏台" value={stats?.redSites ?? 0} suffix=" 座" prefix={<FlagOutlined style={{ color: '#C0392B' }} />} valueStyle={valueStyle} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="待审核投稿" value={stats?.pendingSubmissions ?? pending.length} prefix={<AuditOutlined style={{ color: '#D4A017' }} />} valueStyle={valueStyle} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="订单营收（元）" value={revenue?.totalRevenue ?? 0} precision={0} prefix={<WalletOutlined />} valueStyle={valueStyle} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="研学接待人次" value={stats?.people ?? 0} suffix=" 人" prefix={<TeamOutlined />} valueStyle={valueStyle} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="订单数" value={revenue?.orderCount ?? 0} prefix={<WalletOutlined />} valueStyle={valueStyle} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 待办：待审核投稿 */}
        <Col xs={24} lg={10}>
          <Card
            size="small"
            title={<span style={{ fontSize: 16 }}>待办 · 投稿审核</span>}
            extra={<Link to="/admin/submissions">全部 →</Link>}
          >
            {pending.length === 0 ? (
              <Empty description="暂无待审核投稿" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <List
                size="small"
                dataSource={pending}
                renderItem={(s: any) => (
                  <List.Item
                    actions={[<Link key="go" to="/admin/submissions"><Button size="small" type="link">去审核</Button></Link>]}
                  >
                    <List.Item.Meta
                      title={<span>{s.author_name} <Tag color={s.type === '短视频' ? 'purple' : 'gold'} style={{ marginLeft: 6 }}>{s.type}</Tag></span>}
                      description={<span style={{ fontSize: 13, color: '#666' }}>{String(s.content || '').slice(0, 40)}</span>}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* 快捷入口 */}
        <Col xs={24} lg={14}>
          <Card size="small" title={<span style={{ fontSize: 16 }}>快捷入口</span>}>
            <Row gutter={[12, 12]}>
              {QUICK.map((q) => (
                <Col xs={12} sm={8} key={q.key}>
                  <Link to={q.key}>
                    <div style={{
                      border: '1px solid #f0f0f0', borderRadius: 10, padding: '12px 14px',
                      background: '#fafafa', transition: 'all .2s',
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{q.label} <ArrowRightOutlined style={{ float: 'right', color: '#bbb', fontSize: 12 }} /></div>
                      <div style={{ color: '#999', fontSize: 12, marginTop: 2 }}>{q.desc}</div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <p style={{ color: '#aaa', marginTop: 16, fontSize: 13 }}>
        数据来自 /api/stats 与 /api/orders/revenue，随数据库实时更新；更多数据入口见左侧分组菜单。
      </p>
    </div>
  );
}
