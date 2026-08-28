/**
 * 生成 stages 全字段整理导入 SQL（v4）
 * 数据源：戏台详细数据补充（详细史料/保护现状/网络信息）、
 *        戏台详细数据补充2（英文标题/批次/公布时间/文保类型/时代/省市区/地址/坐标）、
 *        ancient_stages.geojson（简介/时代/文保等级/坐标/图片）
 * 原则：不覆盖原字段；补充信息以【补充史料】追加在原文下方；damage 存「保护现状」原文
 * 用法：先执行 seeds/real_stages.sql（恢复原 42 座），再执行本脚本生成的 SQL
 */
import { readFileSync, writeFileSync } from 'node:fs'

const F1 = '戏台详细数据补充'
const F2 = '戏台详细数据补充2'
const GEO = 'apps/web/public/assets/map/ancient_stages.geojson'
const OUT = 'apps/api/seeds/real_stages_v4.sql'

const lines1 = readFileSync(F1, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
const lines2 = readFileSync(F2, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
const geo = JSON.parse(readFileSync(GEO, 'utf8'))

// 补充1 列：0名称 1镇村 2宗祠 3始建 4重修 5大小 6图案 7结构 8文字/对联 9风格/特色 10保护现状 11保护级别 12文化价值 13关注情况 14网络信息
const rows1 = lines1
  .filter((l) => !l.includes('古戏台名称') && !l.includes('所属镇村'))
  .map((l) => l.split('|').map((c) => c.trim()))
  .filter((r) => r.length >= 2 && r[0])
// 补充2 列：0文保标题 1英文 2批次 3公布时间 4文保类型 5时代 6开放 7省 8市 9详细地址 10经度 11纬度
// 注意：表头已由上方 filter 剔除，数据行从首行开始，不能再 slice(1)（否则丢掉第一行）
const rows2 = lines2
  .filter((l) => !l.includes('文保标题'))
  .map((l) => l.split('\t').map((c) => c.trim()))
  .filter((r) => r[0])

const NORM = (s = '') =>
  String(s)
    .replace(/（[^）]*）/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/宗祠古戏台|古戏台|露天|氏宗祠|宗祠|自然村|村|镇|乡|街道/g, '')
    .trim()

const esc = (v) => String(v ?? '').replace(/'/g, "''")
const clean = (v) => {
  const s = String(v ?? '').trim()
  return s === '/' ? '' : s
}

function matchRow(r, name) {
  const n = NORM(name)
  return r.find((x) => {
    const m = NORM(x[0])
    return m && (m.includes(n) || n.includes(m))
  })
}

const dbNames = geo.features.map((f) => String(f.properties['文保标题'] || '').trim()).filter(Boolean)

const MERGE_MAP = {
  '太平村古戏台': '太坪村成氏宗祠古戏台',
  '泗洲村古戏台（B）': '泗州村陈氏宗祠古戏台',
}
const resolveName = (n) => MERGE_MAP[n] || n

function buildAppend(r1) {
  const parts = []
  if (clean(r1?.[5])) parts.push(`尺寸：${clean(r1[5])}`)
  if (clean(r1?.[6])) parts.push(`雕刻彩绘：${clean(r1[6])}`)
  if (clean(r1?.[7])) parts.push(`结构形制：${clean(r1[7])}`)
  if (clean(r1?.[8])) parts.push(`匾额对联：${clean(r1[8])}`)
  if (clean(r1?.[9])) parts.push(`风格特色：${clean(r1[9])}`)
  if (clean(r1?.[12])) parts.push(`文化价值：${clean(r1[12])}`)
  if (clean(r1?.[13])) parts.push(`关注情况：${clean(r1[13])}`)
  return parts.join('\n')
}

const matched = new Set()
const updates = []
const inserts = []

for (const name of dbNames) {
  const r1 = matchRow(rows1, name)
  const r2 = matchRow(rows2, name)
  if (!r1 && !r2) continue
  matched.add(name)
  const geoProp = geo.features.find((f) => String(f.properties['文保标题'] || '').trim() === name)?.properties || {}

  updates.push({
    name,
    name_en: clean(r2?.[1]),
    province: clean(r2?.[7]),
    city: clean(r2?.[8]),
    address: clean(r2?.[9]),
    ancestral_hall: clean(r1?.[2]),
    heritage_batch: clean(r2?.[2]),
    heritage_date: clean(r2?.[3]),
    heritage_type: clean(r2?.[4]),
    era: clean(r2?.[5]) || clean(geoProp['时代']),
    built_year: clean(r1?.[3]),
    damage: clean(r1?.[10]), // 保护现状原文
    media_links: clean(r1?.[14]),
    append: buildAppend(r1),
  })
}

// 新增：补充1 有数据但 DB 没有的戏台
for (const r1 of rows1) {
  if (!r1[0] || !r1[1]) continue
  const dbTarget = resolveName(r1[0])
  const target = dbNames.find((d) => {
    const m = NORM(d)
    return m.includes(NORM(dbTarget)) || NORM(dbTarget).includes(m)
  })
  if (target) {
    // 同源异名：并入 UPDATE
    const existing = updates.find((u) => u.name === target)
    if (existing) {
      existing.built_year = existing.built_year || clean(r1[3])
      existing.ancestral_hall = existing.ancestral_hall || clean(r1[2])
      existing.damage = existing.damage || clean(r1[10])
      existing.media_links = existing.media_links || clean(r1[14])
      if (!existing.append) existing.append = buildAppend(r1)
    }
    continue
  }
  const r2 = matchRow(rows2, r1[0])
  const dms = (s) => {
    const m = String(s).match(/([+-]?\d+)[°度](?:(\d+)[′分'])?(?:(\d+(?:\.\d+)?)[″秒"])?/)
    if (!m) return null
    return Number(m[1]) + Number(m[2] || 0) / 60 + Number(m[3] || 0) / 3600
  }
  inserts.push({
    name: r1[0], town: r1[1],
    name_en: clean(r2?.[1]), province: clean(r2?.[7]), city: clean(r2?.[8]), address: clean(r2?.[9]),
    ancestral_hall: clean(r1[2]), heritage_batch: clean(r2?.[2]), heritage_date: clean(r2?.[3]),
    heritage_type: clean(r2?.[4]), era: clean(r2?.[5]),
    built_year: clean(r1[3]), style: clean(r1[9]),
    damage: clean(r1[10]) || '较好', heritage_level: '未定级',
    history_text: buildAppend(r1), media_links: clean(r1[14]),
    lng: dms(r2?.[10] || ''), lat: dms(r2?.[11] || ''),
  })
}

let sql = `-- stages 全字段整理导入 v4（保护现状原文 + 新增列；追加式不覆盖）\n`
for (const u of updates) {
  const set = []
  if (u.name_en) set.push(`name_en = '${esc(u.name_en)}'`)
  if (u.province) set.push(`province = '${esc(u.province)}'`)
  if (u.city) set.push(`city = '${esc(u.city)}'`)
  if (u.address) set.push(`address = '${esc(u.address)}'`)
  if (u.ancestral_hall) set.push(`ancestral_hall = CASE WHEN ancestral_hall = '' THEN '${esc(u.ancestral_hall)}' ELSE ancestral_hall END`)
  if (u.heritage_batch) set.push(`heritage_batch = CASE WHEN heritage_batch = '' THEN '${esc(u.heritage_batch)}' ELSE heritage_batch END`)
  if (u.heritage_date) set.push(`heritage_date = CASE WHEN heritage_date = '' THEN '${esc(u.heritage_date)}' ELSE heritage_date END`)
  if (u.heritage_type) set.push(`heritage_type = CASE WHEN heritage_type = '' THEN '${esc(u.heritage_type)}' ELSE heritage_type END`)
  if (u.era) set.push(`era = CASE WHEN era = '' THEN '${esc(u.era)}' ELSE era END`)
  // built_year 专存「始建年份」：无条件覆盖（无始建则置空，时代存 era）
  set.push(`built_year = '${esc(u.built_year)}'`)
  if (u.damage) set.push(`damage = CASE WHEN damage = '较好' THEN '${esc(u.damage)}' ELSE damage END`)
  if (u.media_links) set.push(`media_links = CASE WHEN media_links = '' THEN '${esc(u.media_links)}' ELSE media_links END`)
  if (u.append) set.push(`history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '${esc(u.append)}'`)
  if (!set.length) continue
  sql += `UPDATE stages SET ${set.join(', ')} WHERE name = '${esc(u.name)}';\n`
}
for (const i of inserts) {
  sql += `INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('${esc(i.name)}','${esc(i.name_en)}','${esc(i.town)}','${esc(i.province)}','${esc(i.city)}','${esc(i.address)}','${esc(i.ancestral_hall)}','${esc(i.heritage_batch)}','${esc(i.heritage_date)}','${esc(i.heritage_type)}','${esc(i.era)}','${esc(i.built_year)}','${esc(i.style)}','${esc(i.damage)}','${esc(i.heritage_level)}','${esc(i.history_text)}','${esc(i.media_links)}',${i.lng ?? 'NULL'},${i.lat ?? 'NULL'},0);\n`
}
writeFileSync(OUT, sql, 'utf8')

console.log('=== 匹配报告 ===')
console.log('DB 戏台:', dbNames.length, '| 匹配补充数据:', matched.size)
dbNames.filter((n) => !matched.has(n)).forEach((n) => console.log('  未匹配(保留原样):', n))
console.log('新增戏台:', inserts.length)
inserts.forEach((i) => console.log('  +', i.name, i.town, i.lng ?? '(无坐标)'))
console.log('SQL 写入:', OUT, `(${(sql.length / 1024).toFixed(1)} KB, ${updates.length} UPDATE + ${inserts.length} INSERT)`)
