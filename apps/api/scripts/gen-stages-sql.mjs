/**
 * 生成 stages 真实数据导入 SQL（数据源：apps/web/public/assets/map/ancient_stages.geojson）
 * 用法：node apps/api/scripts/gen-stages-sql.mjs
 * 产出：apps/api/seeds/real_stages.sql（DELETE + INSERT）
 * 执行：wrangler d1 execute xiangcun-xintai-db --file=./seeds/real_stages.sql [--remote]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const geojsonPath = join(__dirname, '../../../apps/web/public/assets/map/ancient_stages.geojson')
const outPath = join(__dirname, '../seeds/real_stages.sql')

const geo = JSON.parse(readFileSync(geojsonPath, 'utf8'))

/** 文保等级 → stages 表 CHECK 枚举 */
const LEVEL_MAP = {
  国家级: '国家级',
  省级: '省级',
  市级: '市级',
  县级: '县级',
  暂无文保等级: '未定级',
}

function esc(v) {
  const s = v == null ? '' : String(v)
  return s.replace(/'/g, "''")
}

const rows = geo.features
  .map((f) => f.properties || {})
  .map((p) => ({
    name: esc(p['文保标题'] || '未命名古戏台'),
    town: esc(p['乡镇'] || ''),
    heritage_level: LEVEL_MAP[p['Heritage_Level']] || '未定级',
    damage: '较好',
    built_year: esc(p['时代'] || ''),
    style: '',
    history_text: esc(p['简介'] || ''),
    red_story: '',
    repair_log: '',
    audio_url: '',
    lng: p['Longitude_DD'] ?? p['经度'] ?? null,
    lat: p['Latitude_DD'] ?? p['纬度'] ?? null,
    cover_url: p['图片'] ? `/assets/map/stage-images/${esc(p['图片'])}` : '',
    is_red_site: 0, // 数据源「是否推荐」为全量“是”，非红色旧址语义，统一置 0
  }))

const values = rows
  .map(
    (r) =>
      `('${r.name}','${r.town}','${r.heritage_level}','${r.damage}','${r.built_year}','${r.style}','${r.history_text}','${r.red_story}','${r.repair_log}','${r.audio_url}',${r.lng},${r.lat},'${r.cover_url}',${r.is_red_site})`
  )
  .join(',\n')

const sql = `-- 真实戏台数据导入（由 gen-stages-sql.mjs 从 ancient_stages.geojson 生成）
-- 覆盖 42 座文保戏台，替换原种子占位数据
DELETE FROM stages;
INSERT INTO stages (name, town, heritage_level, damage, built_year, style, history_text, red_story, repair_log, audio_url, lng, lat, cover_url, is_red_site) VALUES
${values};
`

writeFileSync(outPath, sql, 'utf8')
console.log(`生成 ${rows.length} 条 → ${outPath}`)
