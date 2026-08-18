/**
 * 动态数据看板（占位）：数字先用占位值，P4 接入 API 后动态更新
 */
const stats = [
  { label: '收录戏台', value: 110, suffix: ' 座', prefix: '' },
  { label: '红色旧址戏台', value: 32, suffix: ' 座', prefix: '' },
  { label: '研学接待人次', value: 8600, suffix: ' 人', prefix: '' },
  { label: '文创销售额', value: '12.6', suffix: ' 万', prefix: '¥' },
];

export default function StatsSection() {
  return (
    <section
      id="stats"
      style={{
        background: 'linear-gradient(135deg, #A3232B 0%, #C0392B 45%, #D4A017 100%)',
      }}
    >
      <div className="container">
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: '#fff' }}>动态数据看板</h2>
        </div>
        <p className="section-desc" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
          桂阳古戏台数字化保护与红色文旅运营的最新进展
        </p>

        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">
                {s.prefix}{s.value}{s.suffix}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="stat-note">当前为占位数据，P4 接入 API 后动态更新</p>
      </div>
    </section>
  );
}
