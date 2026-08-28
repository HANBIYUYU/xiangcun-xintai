import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Select, Input, Button, Pagination, Empty, Spin, Space, Tag, message } from 'antd';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import { stagesAPI } from '../api';

const { Option } = Select;

const HERITAGE_LEVELS = ['国家级', '省级', '市级', '县级', '未定级'];
const DAMAGES = ['完好', '较好', '一般', '破损', '濒危'];

const LEVEL_COLOR: Record<string, string> = {
  国家级: 'red', 省级: 'volcano', 市级: 'gold', 县级: 'blue', 未定级: 'default',
};

interface Filters {
  town?: string;
  heritage_level?: string;
  damage?: string;
  keyword?: string;
}

/** 档案列表页（P5）：多条件筛选 + 搜索 + 分页 + Excel 台账导出 */
export default function ArchivePage() {
  const [towns, setTowns] = useState<string[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(24);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [keywordInput, setKeywordInput] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    stagesAPI.metaTowns().then((res: any) => setTowns(res.list || [])).catch(() => setTowns([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    stagesAPI.list({ page, pageSize, ...filters })
      .then((res: any) => {
        setList(res.list || []);
        setTotal(res.total || 0);
      })
      .catch(() => {
        setList([]);
        setTotal(0);
        message.error('档案加载失败，请稍后重试');
      })
      .finally(() => setLoading(false));
  }, [page, filters]);

  const exportExcel = async () => {
    setExporting(true);
    try {
      const blob = (await stagesAPI.exportExcel()) as unknown as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '桂阳古戏台台账.csv';
      a.click();
      URL.revokeObjectURL(url);
      message.success('台账已导出（Excel 兼容 CSV）');
    } catch {
      message.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageLayout title="戏台数字档案馆" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">戏台数字档案馆</h1>
        <p className="text-body">
          收录桂阳古戏台的历史沿革、建筑形制、红色故事与影像资料，支持按乡镇、文保等级、破损程度筛选与关键词检索。
        </p>
      </div>

      {/* 筛选区 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <Select
          placeholder="乡镇"
          allowClear
          style={{ width: 160 }}
          value={filters.town}
          onChange={(v) => { setPage(1); setFilters((f) => ({ ...f, town: v })); }}
        >
          {towns.map((t) => <Option key={t} value={t}>{t}</Option>)}
        </Select>
        <Select
          placeholder="文保等级"
          allowClear
          style={{ width: 140 }}
          value={filters.heritage_level}
          onChange={(v) => { setPage(1); setFilters((f) => ({ ...f, heritage_level: v })); }}
        >
          {HERITAGE_LEVELS.map((h) => <Option key={h} value={h}>{h}</Option>)}
        </Select>
        <Select
          placeholder="破损程度"
          allowClear
          style={{ width: 140 }}
          value={filters.damage}
          onChange={(v) => { setPage(1); setFilters((f) => ({ ...f, damage: v })); }}
        >
          {DAMAGES.map((d) => <Option key={d} value={d}>{d}</Option>)}
        </Select>
        <Input.Search
          placeholder="搜索名称 / 乡镇 / 史料关键词"
          allowClear
          style={{ width: 280 }}
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onSearch={(v) => { setPage(1); setFilters((f) => ({ ...f, keyword: v || undefined })); }}
        />
        <Space>
          <Button type="primary" icon={<SearchOutlined />} onClick={() => setPage(1)}>查询</Button>
          <Button icon={<FileExcelOutlined />} loading={exporting} onClick={exportExcel}>导出台账</Button>
        </Space>
      </div>

      {/* 列表 */}
      <Spin spinning={loading}>
        {list.length === 0 && !loading ? (
          <Empty description="未找到符合条件的戏台，试试放宽筛选条件" />
        ) : (
          <div className="archive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {list.map((s) => (
              <Link key={s.id} to={`/archive/${s.id}`} className="card-hover" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ borderRadius: 8, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <div style={{ height: 140, background: 'linear-gradient(135deg,#A3232B,#C0392B)' }}>
                    {s.cover_url
                      ? <img src={s.cover_url} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : null}
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                      {s.name}
                      {s.is_red_site ? <Tag color="red" style={{ marginLeft: 6 }}>红色旧址</Tag> : null}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
                      {s.town} · {s.built_year || '年代待考'}
                    </div>
                    <Space size={4}>
                      <Tag color={LEVEL_COLOR[s.heritage_level] || 'default'}>{s.heritage_level}</Tag>
                      <Tag>{s.damage}</Tag>
                    </Space>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Spin>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          showSizeChanger={false}
          showTotal={(t) => `共 ${t} 座戏台`}
          onChange={(p) => { setPage(p); window.scrollTo({ top: 0 }); }}
        />
      </div>
    </PageLayout>
  );
}
