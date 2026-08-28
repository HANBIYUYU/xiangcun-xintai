import { Hono } from 'hono'
import type { Env } from '../types'

/**
 * POST /api/ai-chat — AI 戏台助手（关键词知识库 + 戏台检索）
 * body: { message, session_id?, context?, source? }
 * resp: { reply, cards?, suggestions?, actions? }
 *   cards: [{ type:'stage_info', title, image, link }]
 */
const aiChat = new Hono<{ Bindings: Env }>()

const FALLBACK_SUGGESTIONS = [
  '桂阳有多少座古戏台？',
  '湘昆和京剧有什么区别？',
  '戏台的建筑结构是怎样的？',
  '如何预约研学？',
  '有什么文创产品？',
]

const DEFAULT_ACTIONS = [
  { label: '查看档案', url: '/archive' },
  { label: '预约研学', url: '/study' },
]

aiChat.post('/', async (c) => {
  const body = await c.req.json().catch(() => null)
  const message = String(body?.message ?? '').trim()
  if (!message) return c.json({ error: '请输入问题' }, 400)

  const db = c.env.DB
  const reply: string[] = []
  const cards: any[] = []
  const actions: any[] = []
  let suggestions: string[] = []

  // ---------- 1) FAQ 命中：整句命中 > 问题包含 > 关键词 ----------
  const entries = (await db.prepare('SELECT question, keywords, answer FROM faq_entries').all()).results as any[]
  const hit =
    entries.find((r) => r.question === message) ||
    entries.find((r) => r.question && message.includes(r.question)) ||
    entries.find((r) => r.question && r.question.includes(message)) ||
    entries.find((r) =>
      r.keywords && r.keywords.split(/[,，]/).some((k: string) => k && message.includes(k))
    )
  if (hit) {
    reply.push(hit.answer)
  }

  // ---------- 2) 戏台检索：命中戏台名/乡镇 ----------
  const stages = (await db.prepare(
    "SELECT id, name, town, heritage_level, damage, era, cover_url FROM stages WHERE name LIKE ? OR town LIKE ? LIMIT 5"
  ).bind(`%${message}%`, `%${message}%`).all()).results as any[]

  if (stages.length === 1) {
    const s = stages[0]
    cards.push({
      type: 'stage_info',
      title: s.name,
      image: s.cover_url || '',
      link: `/archive/${s.id}`,
    })
    actions.push({ label: '查看详情', url: `/archive/${s.id}` })
    // 精确命中戏台时优先回复戏台介绍（覆盖泛化 FAQ 答案）
    if (hit) reply.length = 0
    reply.push(
      `为你找到「${s.name}」：${s.town} · ${s.heritage_level}文保 · ${s.era || '年代待考'}${s.damage ? ` · 保护现状：${s.damage}` : ''}。点击卡片可查看完整档案。`
    )
  } else if (stages.length > 1) {
    reply.push(`为你找到 ${stages.length} 座相关戏台：${stages.map((s) => s.name).join('、')}。可以去档案馆看看～`)
    actions.push({ label: '打开档案馆', url: '/archive' })
  }

  // ---------- 3) 通用问题 ----------
  if (!hit && stages.length === 0) {
    if (/多少|几座|数量|统计/.test(message) && /戏台|古戏台/.test(message)) {
      const cnt = await db.prepare('SELECT COUNT(*) AS n FROM stages').first()
      reply.push(`目前档案馆共收录 ${cnt?.n ?? 0} 座古戏台（含各级文物保护单位），并持续扩充中。`)
      actions.push({ label: '浏览全部档案', url: '/archive' })
    } else if (/研学|预约|参观/.test(message)) {
      reply.push('研学预约支持两类套餐：中小学红色思政研学、高校非遗建筑实践研学。可在研学中心查看行程并提交团体预约表单，后台确认后生成预约单。')
      actions.push({ label: '去研学中心', url: '/study' })
    } else if (/商城|文创|购买|优惠券|商品/.test(message)) {
      reply.push('商城有古戏台文创（明信片、徽章、帆布袋等）与桂阳农特产（茶油、陶艺、红薯粉丝），农户代销、收益反哺戏台修缮。答题/投稿通关可获得电子优惠券，下单可抵扣。')
      actions.push({ label: '去商城逛逛', url: '/mall' })
    } else if (/湘昆/.test(message)) {
      reply.push('湘昆是昆曲传入湖南后形成的地方支派（又称湖南昆曲），以曲笛主奏、细腻典雅，桂阳古戏台是其重要演出载体。文化馆里有红色改编剧目与演出视频。')
      actions.push({ label: '去文化馆', url: '/culture' })
    } else if (/投稿|老照片|口述/.test(message)) {
      reply.push('红色记忆投稿支持老照片、口述文字、短视频三类，提交后经后台审核通过即公开展示。你的每一份记忆都很珍贵，欢迎投稿～')
      actions.push({ label: '去投稿', url: '/community' })
    } else if (/红色|革命|湘南起义|欧阳海/.test(message)) {
      reply.push('桂阳古戏台见证了湘南起义、红军长征等红色历史，也承载着欧阳海烈士故乡的精神传承。档案馆中标注「红色旧址」的戏台可在详情页查看事迹（数据持续补录中）。')
      actions.push({ label: '查看红色旧址档案', url: '/archive' })
    } else if (/地图|位置|分布/.test(message)) {
      reply.push('数字地图基于 ArcGIS 空间数据构建，展示了桂阳古戏台的空间分布，点位按文保等级着色，点击可查看档案与照片，还有乡镇分布、年代分布等专题图集。')
      actions.push({ label: '打开数字地图', url: '/map' })
    } else if (/3d|三维|模型|展厅/.test(message)) {
      reply.push('三维古建展厅用程序化建模还原戏台形制（台基、戏台红柱、四坡屋顶与宝顶），支持 720° 自由旋转缩放，后续将接入真实戏台的 OBJ 模型。')
      actions.push({ label: '进入三维展厅', url: '/3d' })
    } else if (/新闻|动态|报道/.test(message)) {
      reply.push('首页「影像与动态」展示专题短片与校地合作最新进展；媒体报道覆盖青春上海、学习强国、新湖南、郴州广电等十余家媒体。')
      actions.push({ label: '去看看动态', url: '/' })
    } else {
      reply.push('这个问题我还在学习中。你可以试试问我：桂阳有多少座古戏台？湘昆是什么？如何预约研学？怎么投稿？答题怎么领券？')
      suggestions = FALLBACK_SUGGESTIONS
    }
  }

  if (actions.length === 0) actions.push(...DEFAULT_ACTIONS)
  if (suggestions.length === 0) suggestions = FALLBACK_SUGGESTIONS

  return c.json({ reply: reply.join('\n'), cards, suggestions, actions })
})

export default aiChat
