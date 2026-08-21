import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Spin } from 'antd';
import { BankOutlined, HomeOutlined, FlagOutlined, TeamOutlined, WalletOutlined, AuditOutlined } from '@ant-design/icons';
import { statsAPI, ordersAPI } from '../../api';

/** 管理后台仪表盘（P11）：平台统计 + 营收台账 */
export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([statsAPI.overview(), ordersAPI.revenue()])
      .then(([s, r]: any[]) => { setStats(s); setRevenue(r); })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>
      <Row gutter={[16, 16]}>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="收录戏台" value={stats?.stages ?? 0} suffix="座" prefix={<BankOutlined />} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="红色旧址戏台" value={stats?.redSites ?? 0} suffix="座" prefix={<FlagOutlined />} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="研学接待人次" value={stats?.people ?? 0} suffix="人" prefix={<TeamOutlined />} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="文创销售额" value={stats?.revenue ?? 0} prefix="¥" precision={0} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="待审核投稿" value={stats?.pendingSubmissions ?? 0} prefix={<AuditOutlined />} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="订单营收（元）" value={revenue?.totalRevenue ?? 0} prefix="¥" /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="订单数" value={revenue?.orderCount ?? 0} prefix={<WalletOutlined />} /></Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card><Statistic title="已核销优惠券" value={revenue?.couponUsedCount ?? 0} prefix={<HomeOutlined />} /></Card>
        </Col>
      </Row>
      <p style={{ color: '#999', marginTop: 16 }}>
        数据来自 /api/stats 与 /api/orders/revenue，随数据库实时更新。
      </p>
    </div>
  );
}
