import { Card, Statistic, Row, Col, Alert } from 'antd'
import { BankOutlined, FileTextOutlined, CalendarOutlined, ShoppingOutlined } from '@ant-design/icons'

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>仪表盘</h1>
      <Alert
        type="info"
        showIcon
        message="当前为占位统计，P1 起接入 API 后动态更新"
        style={{ marginBottom: 24, maxWidth: 420 }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="收录戏台"
              value={110}
              suffix="座"
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="待审投稿"
              value={0}
              suffix="篇"
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="待处理预约"
              value={0}
              suffix="单"
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="文创销售额"
              value={12.6}
              precision={1}
              prefix={<ShoppingOutlined />}
              suffix="万元"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
