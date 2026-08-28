// 生成媒体报道 → articles 导入 SQL（数据源：数据补充3）
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('数据补充3', 'utf8')
  .split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

const esc = (v) => String(v ?? '').replace(/'/g, "''")

const rows = src
  .filter((l) => !l.includes('报道日期') && !l.startsWith('附件'))
  .map((l) => l.split('\t').map((c) => c.trim()))
  .filter((r) => r.length >= 4 && r[1])

let sql = '-- 媒体报道导入（数据补充3）→ 互动阅读\n'
for (const r of rows) {
  const [no, date, title, url, media] = r
  const content = `${title}\n\n报道媒体：${media}\n报道日期：${date}\n\n阅读原文：${url}`
  sql += `INSERT INTO articles (title, content, cover_url, source, sort_order) VALUES ('${esc(title)}','${esc(content)}','','${esc(media)}',${Number(no) || 100});\n`
}
writeFileSync('apps/api/seeds/media_articles.sql', sql, 'utf8')
console.log(`生成 ${rows.length} 条 → apps/api/seeds/media_articles.sql`)
