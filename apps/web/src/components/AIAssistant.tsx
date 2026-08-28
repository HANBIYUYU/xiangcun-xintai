import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CloseOutlined, SendOutlined, RobotOutlined } from '@ant-design/icons'
import { aiChatAPI } from '../api'

/** 消息类型：AI 回复可附带戏台卡片 / 快捷操作 / 推荐追问 */
interface ChatMsg {
  role: 'ai' | 'user'
  text: string
  cards?: { type: string; title: string; image: string; link: string }[]
  actions?: { label: string; url: string }[]
  suggestions?: string[]
}

const OPENING: ChatMsg = {
  role: 'ai',
  text: '你好！我是台小湘 🎭\n我可以帮你：查询古戏台的历史与现状、了解湘昆非遗、解读戏台建筑，或提供研学预约、商城购买等实用信息。试着点击下方问题，或直接输入～',
  suggestions: [
    '桂阳有多少座古戏台？',
    '湘昆和京剧有什么区别？',
    '戏台的建筑结构是怎样的？',
    '如何预约研学？',
    '有什么文创产品？',
  ],
}

const STORAGE_KEY = 'xc_ai_history'

/**
 * 台小湘 · AI 戏台助手（redo 方案）：
 * 左下角气泡胶囊 → 点击展开聊天窗（窗口可拖拽）；全站可见（App 级挂载）
 */
export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  // 窗口位置：仅本次会话拖拽生效，关闭后重置回默认位置（不记忆）
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as ChatMsg[]) : [OPENING]
    } catch {
      return [OPENING]
    }
  })
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // 3 秒后气泡滑入
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 3000)
    return () => clearTimeout(t)
  }, [])

  // 消息持久化（仅文本）
  useEffect(() => {
    try {
      const slim = messages.slice(-20).map((m) => ({ role: m.role, text: m.text }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slim))
    } catch { /* ignore */ }
  }, [messages])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, typing, open])

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || typing) return
    setMessages((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setTyping(true)
    try {
      const res: any = await aiChatAPI.ask({
        message: q,
        session_id: crypto.randomUUID(),
        context: messages.slice(-10).map((m) => m.text),
        source: 'homepage',
      })
      setMessages((m) => [...m, {
        role: 'ai',
        text: res.reply || '',
        cards: res.cards,
        actions: res.actions,
        suggestions: res.suggestions,
      }])
    } catch {
      setMessages((m) => [...m, { role: 'ai', text: '抱歉，我走神了，请稍后再试～' }])
    } finally {
      setTyping(false)
    }
  }

  const clearHistory = () => {
    setMessages([OPENING])
    localStorage.removeItem(STORAGE_KEY)
  }

  // 聊天窗拖拽（仅桌面端，拖头部移动；松手时钳制在视口内）
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)
  const onHeaderMouseDown = (e: React.MouseEvent) => {
    if (window.innerWidth <= 768) return
    // 以窗口当前实际位置为基准（兼容默认 bottom 锚定，避免首次拖动瞬移）
    const win = (e.currentTarget as HTMLElement).closest('.ai-window') as HTMLElement
    const rect = win.getBoundingClientRect()
    const sx = e.clientX, sy = e.clientY
    const ox = rect.left, oy = rect.top
    dragRef.current = { sx, sy, ox, oy }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const { sx: s, sy: t, ox: o, oy: p } = dragRef.current
      setPos({ x: o + (ev.clientX - s), y: p + (ev.clientY - t) })
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      dragRef.current = null
      setPos((p) => {
        if (!p) return p
        const w = Math.min(380, window.innerWidth - 48)
        const h = Math.min(520, window.innerHeight - 48)
        return {
          x: Math.max(0, Math.min(p.x, window.innerWidth - w - 8)),
          y: Math.max(0, Math.min(p.y, window.innerHeight - h - 8)),
        }
      })
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <>
      {/* ======== 折叠态：单个对话气泡（微信样式，带小尾巴） ======== */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="ai-bubble"
          style={{
            position: 'fixed',
            left: 24,
            bottom: 24,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 18px',
            border: 'none',
            background: '#A3232B',
            color: '#FAF7F2',
            borderRadius: '18px 18px 18px 6px',
            boxShadow: '0 6px 20px rgba(163, 35, 43, 0.35)',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'inherit',
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateX(0)' : 'translateX(-100px)',
            transition: 'opacity 0.6s cubic-bezier(0.34,1.56,0.64,1), transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <span className="ai-dot" />
          <RobotOutlined style={{ fontSize: 16 }} />
          台小湘
        </button>
      )}

      {/* ======== 展开态：聊天窗（可拖拽） ======== */}
      {open && (
        <div className="ai-window" style={{
          position: 'fixed',
          left: pos?.x ?? 24,
          top: pos ? pos.y : undefined,
          bottom: pos ? undefined : 24,
          zIndex: 999,
          width: 380,
          height: 520,
          maxHeight: 'calc(100vh - 48px)',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#FAF7F2',
          boxShadow: '0 16px 48px rgba(43, 29, 26, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'ai-window-in 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* 头部（拖拽手柄） */}
          <div
            onMouseDown={onHeaderMouseDown}
            style={{
              height: 52,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 14px',
              background: '#A3232B',
              color: '#FAF7F2',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#FAF7F2', color: '#A3232B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <RobotOutlined />
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>台小湘</div>
                <div style={{ fontSize: 11, color: '#D4A017', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#52c41a', display: 'inline-block' }} />
                  在线
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={clearHistory}
                style={{ background: 'none', border: 'none', color: 'rgba(250,247,242,0.75)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              >清空</button>
              <button
                onClick={() => { setOpen(false); setPos(null); }}
                style={{ background: 'none', border: 'none', color: '#FAF7F2', fontSize: 16, cursor: 'pointer' }}
              ><CloseOutlined /></button>
            </div>
          </div>

          {/* 消息区 */}
          <div ref={listRef} style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? '#A3232B' : 'rgba(43,29,26,0.04)',
                  color: m.role === 'user' ? '#FAF7F2' : '#2B1D1A',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.7,
                  fontSize: 14,
                  animation: 'ai-msg-in 0.3s ease-out',
                }}>
                  {m.text}
                </div>

                {m.cards?.map((c, ci) => (
                  <div key={ci} onClick={() => navigate(c.link)}
                    style={{
                      marginTop: 8, width: '88%', background: '#fff', borderRadius: 8,
                      border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                    {c.image ? (
                      <div style={{ height: 90, background: `url(${c.image}) center/cover no-repeat` }} />
                    ) : (
                      <div style={{ height: 40, background: 'linear-gradient(135deg,#A3232B,#C0392B)' }} />
                    )}
                    <div style={{ padding: '8px 12px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2B1D1A' }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: '#A3232B' }}>查看详情 →</div>
                    </div>
                  </div>
                ))}

                {m.actions?.length ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {m.actions.map((a, ai) => (
                      <button key={ai} onClick={() => navigate(a.url)}
                        style={{
                          padding: '6px 12px', borderRadius: 8, fontSize: 13,
                          border: '1px solid #A3232B', background: 'transparent', color: '#A3232B',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}>{a.label}</button>
                    ))}
                  </div>
                ) : null}

                {m.suggestions?.length ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {m.suggestions.map((s, si) => (
                      <button key={si} onClick={() => send(s)}
                        style={{
                          padding: '8px 14px', borderRadius: 9999, fontSize: 13,
                          background: 'rgba(163,35,43,0.06)', color: '#A3232B',
                          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        }}>{s}</button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '10px 14px', background: 'rgba(43,29,26,0.04)', borderRadius: '16px 16px 16px 4px', alignSelf: 'flex-start' }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="ai-typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#A3232B' }} />
                ))}
              </div>
            )}
          </div>

          {/* 输入区 */}
          <div style={{
            height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 16px', background: '#fff', borderTop: '1px solid rgba(43,29,26,0.06)',
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="输入你的问题..."
              style={{
                flex: 1, height: 36, padding: '0 14px', borderRadius: 24, border: '1px solid transparent',
                background: '#F5F5F0', outline: 'none', fontSize: 14, fontFamily: 'inherit',
              }}
              onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.background = '#fff'; (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(163,35,43,0.3)'; }}
              onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.background = '#F5F5F0'; (e.currentTarget as HTMLInputElement).style.borderColor = 'transparent'; }}
            />
            <button
              onClick={() => send(input)}
              style={{
                width: 36, height: 36, borderRadius: '50%', border: 'none',
                background: input.trim() ? '#A3232B' : 'rgba(43,29,26,0.3)',
                color: '#fff', cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            ><SendOutlined /></button>
          </div>
        </div>
      )}

      <style>{`
        .ai-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #D4A017;
          animation: ai-breathe 2s ease-in-out infinite;
        }
        @keyframes ai-breathe { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        /* 对话气泡 + 小尾巴（微信样式） */
        .ai-bubble { position: fixed; }
        .ai-bubble::after {
          content: '';
          position: absolute;
          left: 16px;
          bottom: -5px;
          width: 10px;
          height: 10px;
          background: #A3232B;
          border-radius: 2px;
          transform: rotate(45deg);
        }
        .ai-bubble:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(163,35,43,0.45);
        }
        .ai-typing-dot { animation: ai-typing 0.6s ease-in-out infinite; }
        .ai-typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .ai-typing-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes ai-typing { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes ai-window-in { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes ai-msg-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .ai-window {
            left: 0 !important; right: 0 !important; bottom: 0 !important; top: auto !important;
            width: 100% !important; height: 70vh !important;
            border-radius: 16px 16px 0 0 !important;
          }
          .ai-window > div:first-child { border-radius: 16px 16px 0 0 !important; }
          .ai-bubble { left: 16px !important; bottom: 16px !important; }
        }
      `}</style>
    </>
  )
}
