import PageLayout from '../components/PageLayout';

const products = [
  { key: 'p1', name: '戏台书签 · 占位', price: '¥ 12.00' },
  { key: 'p2', name: '湘昆脸谱帆布包 · 占位', price: '¥ 39.00' },
  { key: 'p3', name: '桂阳古戏台明信片 · 占位', price: '¥ 8.00' },
  { key: 'p4', name: '乡村助农土特产 · 占位', price: '¥ 29.90' },
];

export default function MallPage() {
  return (
    <PageLayout title="乡韵文创助农商城" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">乡韵文创助农商城</h1>
        <p className="text-body">
          精选戏台文创与乡村助农产品，以消费带动桂阳红色文旅与乡村振兴。
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
        }}
      >
        {products.map((p) => (
          <div key={p.key} className="card-hover" style={{ padding: 20 }}>
            <div className="video-cover" style={{ marginBottom: 16, fontSize: 14, letterSpacing: '0.06em' }}>
              商品占位图
            </div>
            <div className="film-title">{p.name}</div>
            <div style={{ marginTop: 8, color: '#A3232B', fontWeight: 700 }}>{p.price}</div>
          </div>
        ))}
      </div>
      <div className="placeholder-note" style={{ marginTop: 32 }}>
        商品、购物车与订单流程 P10 实现。
      </div>
    </PageLayout>
  );
}
