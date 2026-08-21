# 湘村新台（xiangcun-xintai）

桂阳古戏台红色文旅数字官网。以「戏台红 + 湘昆金 + 米白」为视觉主调，聚合古戏台数字档案、三维古建展厅、红色湘昆文化、乡土共创、研学预约、文创商城与 AI 智能问答的数字文旅平台。

> 当前进度：**P0–P12 全部完成 ✅**（脚手架/数据库/API 基础/前端框架/首页门户/档案库/三维展厅/文化馆/共创平台/研学中心/商城/管理后台/AI 助手）。前台九大模块与后台管理页均为真实前后端实现，业务数据落库 D1；后续按 `docs/TODO.md` 推进（前端设计优化 → 部署上线 → 真数据填充/地图/建模）。

## 业务介绍

**湘村新台**是桂阳古戏台红色文旅的数字门户，以「数字档案 + 红色传播 + 用户共创 + 文旅消费」构成完整业务闭环：

| 环节 | 业务内容 | 面向用户 |
|---|---|---|
| **档案沉淀** | 110 座古戏台台账数字化：建筑史料、红色革命事迹、修缮记录、村民口述音频，支持多条件检索与 PDF/Excel 导出，供乡镇文旅与党史办存档 | 游客 / 政企文旅部门 |
| **红色传播** | 三维古戏台展厅（720° 浏览）、红色湘昆文化馆（戏曲/阅读/活动）、专题短片与校地合作新闻，让红色记忆可看、可听、可互动 | 游客 / 研学团体 |
| **用户共创** | 红色记忆投稿（老照片/口述/短视频）后台审核后公开展示；活化建言自动分类归档、可导出提交文旅局；戏台红色知识答题，通关发放电子优惠券 | 村民 / 游客 |
| **研学转化** | 中小学思政与高校建筑实践两类套餐展示，团体在线预约生成预约单，后台确认排期；研学成果线上展示 | 学校 / 党团组织 |
| **消费反哺** | 文创商城 + 桂阳农特产（农户代销）线上下单、自提/同城配送，答题/投稿所得优惠券可抵扣；订单核销与营收台账公示，农特产收益按标注比例**反哺戏台修缮**，形成「文化保护 → 文旅消费 → 反哺保护」的可持续闭环 | 游客 / 农户 / 项目团队 |

平台实行**三级权限**：游客（浏览、答题、投稿、预约、下单、留言）｜ 项目团队（上传素材、审核投稿、管理预约订单、导出报表）｜ 政企文旅管理员（戏台史料、官方活动、营收台账、档案导出）。

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
├── docs/
│   ├── 需求与计划.md             # 需求九大模块 + 技术定位 + 路由 + 数据库 + 阶段进度 + 验收
│   ├── 数据需求.md               # 假数据/占位文案 → 待填充真数据（台账/素材/地图/3D/配置）
│   └── TODO.md                   # 待办清单（A 设计优化 / B 部署上线 / C 真数据·地图建模 / D 其余）
└── apps/
    ├── api/                      # Cloudflare Workers + Hono + D1
    │   ├── wrangler.toml         # dev / production 双环境；R2、KV 注释占位
    │   ├── migrations/           # 0001_init.sql：16 张表 + 索引
    │   ├── seeds/                # seed.sql：管理员/110 戏台/40 题库/FAQ/商品等
    │   └── src/
    │       ├── index.ts          # Hono 入口：logger + cors + 健康检查 + 路由注册 + onError/notFound
    │       ├── types.ts          # Env / Admin / JWTPayload 类型
    │       ├── middleware/auth.ts# JWT 校验 + requireRole 角色中间件
    │       └── routes/           # 16 个资源路由（auth/stages/red-plays/articles/activities/submissions/suggestions/quiz/bookings/study-plans/study-results/products/orders/coupons/faq/news/stats/upload）
    └── web/                      # React 18 + Vite + AntD + React Router
        └── src/
            ├── main.tsx          # ConfigProvider（zhCN + 红旅主题 token）
            ├── App.tsx           # 前台 9 条路由 + 后台 12 条路由 + 兜底回首页
            ├── api/index.ts      # axios 实例 + 全量资源 API 分组
            ├── styles/theme.css  # 红色文旅设计系统（CSS 变量 + 工具类）
            ├── components/       # TransparentNav / Footer / BackToTop / FloatingNext / PageLayout / AdminLayout / Stage3D
            ├── sections/         # HeroSection / EntrancesSection / StatsSection
            └── pages/            # 前台 9 页 + Admin（Login/Dashboard/CRUD/专项管理页）
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
- `/api/upload` 目前为占位实现（返回 `status: 'coming'`），文件上传与预签名 URL 待 R2 开通后实现；开通前图片/素材可通过外链 URL 在后台录入。
- 本地开发请勿提交 `.dev.vars` 与 `wrangler.toml.local`（已在 `.gitignore` 中排除）；生产 `JWT_SECRET` 请通过 Cloudflare secrets 覆盖。

## 主题

戏台红 `#A3232B` · 亮红 `#C0392B` · 湘昆金 `#D4A017` · 米白 `#FAF7F2` · 深褐红 `#3B2A26` · 深戏台褐 `#2B1D1A`。设计 token 见 `apps/web/src/styles/theme.css`，AntD 主题 token 见 `apps/web/src/main.tsx`。
