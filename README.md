# 湘村新台（xiangcun-xintai）

桂阳古戏台红色文旅数字官网。以「戏台红 + 湘昆金 + 米白」为视觉主调，聚合古戏台数字档案、三维古建展厅、红色湘昆文化、乡土共创、研学预约、文创商城与 AI 智能问答的数字文旅平台。

> 当前进度：**P0 脚手架 ✅ + P1 数据库 ✅**。前后台路由骨架可编译可运行；D1 全部 16 张表 + 索引已迁移、种子数据已落库（110 座戏台 / 40 题题库 / 默认管理员等）。业务接口与页面仍为占位（`status: 'coming'`），P2 起逐步实现。

## 技术栈

| 端 | 技术 |
| --- | --- |
| Web（`apps/web`） | React 18 + Vite 5 + Ant Design 5 + React Router 6 + Axios |
| API（`apps/api`） | Cloudflare Workers + Hono + D1（SQLite）+ JWT（jose）+ bcryptjs |
| 工程 | pnpm monorepo（`apps/*`，对齐 mili-edu） |

## 开发命令

```bash
pnpm install        # 安装依赖
pnpm dev:api        # API 本地开发（wrangler dev，端口 8787）
pnpm dev:web        # Web 本地开发（Vite，端口 5173）
pnpm build:web      # Web 构建（vite build）
pnpm db:migrate     # 应用 D1 迁移（本地模拟库）
pnpm db:seed        # 写入种子数据（本地模拟库）
pnpm deploy:api     # 部署 API（wrangler deploy）
pnpm deploy:web     # 构建后部署 Cloudflare Pages（branch=main）
pnpm clean          # 删除所有 node_modules
```

`pnpm dev:api` 与 `pnpm dev:web` 需同时运行。Web 开发服务器通过 Vite proxy 将 `/api` 请求代理到 `localhost:8787`。

## 目录结构

```
xiangcun-xintai/
├── package.json / pnpm-workspace.yaml / .gitignore / README.md
└── apps/
    ├── api/                      # Cloudflare Workers + Hono + D1
    │   ├── wrangler.toml         # dev / production 双环境；R2、KV 注释占位
    │   ├── migrations/           # 0001_init.sql：16 张表 + 索引（P1 ✅）
    │   ├── seeds/                # seed.sql：管理员/110 戏台/40 题库/FAQ/商品等（P1 ✅）
    │   └── src/
    │       ├── index.ts          # Hono 入口：logger + cors + 健康检查 + 路由注册 + onError/notFound
    │       ├── types.ts          # Env / Admin / JWTPayload 类型
    │       ├── middleware/auth.ts# JWT 校验 + requireRole 角色中间件
    │       └── routes/           # auth（已实现）+ 13 个占位路由（P2/P3 实现）
    └── web/                      # React 18 + Vite + AntD + React Router
        └── src/
            ├── main.tsx          # ConfigProvider（zhCN + 红旅主题 token）
            ├── App.tsx           # 前台 9 条路由 + 后台 12 条路由 + 兜底回首页
            ├── api/index.ts      # axios 实例（/api、withCredentials、401 拦截）+ authAPI
            ├── styles/theme.css  # 红色文旅设计系统（CSS 变量 + 工具类）
            ├── components/       # TransparentNav / Footer / BackToTop / FloatingNext / PageLayout / AdminLayout
            ├── sections/         # HeroSection / EntrancesSection / StatsSection
            └── pages/            # 前台 9 页 + Admin（Login / Dashboard / ResourcePlaceholder）
```

## 默认账号

P1 已通过种子脚本（`apps/api/seeds/seed.sql`）写入两个管理账号，均可登录后台：

| 账号 | 密码 | 角色 |
| --- | --- | --- |
| `team` | `xiangcun2026` | 项目团队（上传/审核/预约/订单/导出） |
| `admin` | `xiangcun2026` | 政企文旅管理员（戏台史料/官方活动/营收台账） |

> 演示用途密码，上线前请通过后台或 SQL 修改。

## R2 / 上传现状

- R2 存储尚未开通，`wrangler.toml` 中已留注释占位（`xiangcun-xintai-assets`），KV 命名空间同理。
- `/api/upload` 目前为占位实现（返回 `status: 'coming'`），文件上传与预签名 URL 待 R2 开通后于 P2 实现。
- 本地开发请勿提交 `.dev.vars` 与 `wrangler.toml.local`（已在 `.gitignore` 中排除）；生产 `JWT_SECRET` 请通过 Cloudflare secrets 覆盖。

## 主题

戏台红 `#A3232B` · 亮红 `#C0392B` · 湘昆金 `#D4A017` · 米白 `#FAF7F2` · 深褐红 `#3B2A26` · 深戏台褐 `#2B1D1A`。设计 token 见 `apps/web/src/styles/theme.css`，AntD 主题 token 见 `apps/web/src/main.tsx`。
