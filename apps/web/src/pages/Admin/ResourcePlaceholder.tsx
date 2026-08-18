import { Table, Alert, Typography } from 'antd'

interface ResourcePlaceholderProps {
  /** 模块标题，如「戏台档案管理」 */
  title: string
  /** 模块说明，展示在表格上方 */
  description?: string
}

/**
 * 通用占位页：P1+ 实现前，后台各资源模块统一展示该页面
 */
export default function ResourcePlaceholder({ title, description }: ResourcePlaceholderProps) {
  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>{title}</Typography.Title>
      {description && (
        <Alert
          type="info"
          showIcon
          message={description}
          style={{ marginBottom: 16, maxWidth: 560 }}
        />
      )}
      <Table
        rowKey="id"
        columns={[]}
        dataSource={[]}
        pagination={false}
        locale={{ emptyText: '该模块 P1+ 实现' }}
      />
    </div>
  )
}
