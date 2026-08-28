# 湘村新台（xiangcun-xintai）

桂阳古戏台红色文旅数字官网。以「戏台红 + 湘昆金 + 米白」为视觉主调，聚合古戏台数字档案、三维古建展厅、红色湘昆文化、乡土共创、研学预约、文创商城与 AI 智能问答的数字文旅平台。

> 当前进度：**P0–P12 全部完成 ✅，已上线 Cloudflare（2026-08-21）**。前台九大模块 + 后台管理均为真实前后端实现；档案馆已接入 **42 座真实文保戏台数据**（GeoJSON 导入 + 真实图片）；新增 ArcGIS 交互地图与专题图集；后台含首页影像/首页动态管理；后续按 `docs/TODO.md` 推进（设计优化 → 数据补录 → 增强项）。

## 业务介绍

**湘村新台**是桂阳古戏台红色文旅的数字门户，以「数字档案 + 红色传播 + 用户共创 + 文旅消费」构成完整业务闭环：

| 环节 | 业务内容 | 面向用户 |
|---|---|---|
| **档案沉淀** | 桂阳各级文保戏台台账数字化（当前收录 **42 座真实文保戏台**，含建筑史料、文保等级、经纬度与实拍图），支持多条件检索与 PDF/Excel 导出，供乡镇文旅与党史办存档 | 游客 / 政企文旅部门 |
| **红色传播** | 三维古戏台展厅（720° 浏览）、红色湘昆文化馆（戏曲/阅读/活动）、专题短片与校地合作新闻，让红色记忆可看、可听、可互动 | 游客 / 研学团体 |
| **用户共创** | 红色记忆投稿（老照片/口述/短视频）后台审核后公开展示；活化建言自动分类归档、可导出提交文旅局；戏台红色知识答题，通关发放电子优惠券 | 村民 / 游客 |
| **研学转化** | 中小学思政与高校建筑实践两类套餐展示，团体在线预约生成预约单，后台确认排期；研学成果线上展示 | 学校 / 党团组织 |
| **消费反哺** | 文创商城 + 桂阳农特产（农户代销）线上下单、自提/同城配送，答题/投稿所得优惠券可抵扣；订单核销与营收台账公示，农特产收益按标注比例**反哺戏台修缮**，形成「文化保护 → 文旅消费 → 反哺保护」的可持续闭环 | 游客 / 农户 / 项目团队 |

平台实行**三级权限**：游客（浏览、答题、投稿、预约、下单、留言）｜ 项目团队（**全量后台管理**：戏台档案、红色戏曲、首页影像/动态、投稿审核、研学预约、订单、题库等）｜ 政企文旅管理员（**戏台档案 / 活动预告 / 订单** 三项管理 + 营收台账）。

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

## 线上地址（2026-08-21 首次部署）

| 端 | 地址 |
| --- | --- |
| 官网（Cloudflare Pages） | https://xiangcun-xintai.pages.dev |
| API（Workers，生产环境） | https://xiangcun-xintai-api-production.quaiquai11.workers.dev |
| 远程数据库 | D1 `xiangcun-xintai-db`（亚太区，已迁移 + 种子） |

前端 `/api` 请求由 **Pages Function**（`apps/web/functions/api/[[path]].ts`）同域代理到 API Worker，Cookie 登录链路可用。部署命令：`pnpm deploy:api`（`wrangler deploy --env production`）与 `pnpm deploy:web`（Pages `--project-name=xiangcun-xintai`）。

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

## 素材方案现状

- **官方素材（图片 / GeoJSON 地图 / OBJ 3D / 短音频）**：打包进 Pages 静态目录 `apps/web/public/assets/`，随部署上线（Pages 限制：单文件 ≤25 MiB、Free 计划 ≤20,000 文件）。
- **视频**：长视频放 B 站，页面用官方 **裸 iframe**（`player.bilibili.com/player.html?bvid=...`）嵌入；后续可选 Cloudflare Stream 私有视频（无跳转、不公开，需外币卡）。
- **R2 存储**：尚未开通，`wrangler.toml` 中已留注释占位；`/api/upload` 为占位实现，待 R2 开通后落地——用于**用户投稿上传**与超 25MiB 大文件；开通前素材以外链 URL 在后台录入。
- 本地开发请勿提交 `.dev.vars` 与 `wrangler.toml.local`（已在 `.gitignore` 中排除）；生产 `JWT_SECRET` 请通过 Cloudflare secrets 覆盖。

## 主题

戏台红 `#A3232B` · 亮红 `#C0392B` · 湘昆金 `#D4A017` · 米白 `#FAF7F2` · 深褐红 `#3B2A26` · 深戏台褐 `#2B1D1A`。设计 token 见 `apps/web/src/styles/theme.css`，AntD 主题 token 见 `apps/web/src/main.tsx`。
