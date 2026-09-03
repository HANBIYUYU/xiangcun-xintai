# 湘村新台（xiangcun-xintai）

桂阳古戏台红色文旅数字官网。以「戏台红 + 湘昆金 + 米白」为视觉主调，聚合古戏台数字档案、三维古建展厅、红色湘昆文化、乡土共创、研学预约、文创商城与 AI 智能问答的数字文旅平台。

> 当前进度：**P0–P15 全部完成 ✅，已上线 Cloudflare（2026-08-21 起多次迭代部署）**。前台九大模块 + 后台管理均为真实前后端实现；档案馆接入 **52 座真实文保戏台全字段数据**（GeoJSON + 补充台账：史料/宗祠/文保批次/保护现状原文/坐标/图片/网络资料）；ArcGIS 交互地图与专题图集；**台小湘 AI 悬浮助手**（树状对话：5 主题分支 + 叶子追问 + 跳转入口；日常闲聊：问候/天气/时间；介绍语以编号 0 入问答库）；媒体报道进文化馆互动阅读；图片加速（242MB → 20MB + 600px 缩略图 + 强缓存 + 懒加载）；页面切换渐入动画（后台除外）、首页数字卡片悬停/点击重播、后台列表自动刷新与固定一屏高滚动表格。后续按 `docs/TODO.md` 推进（域名绑定 → 数据补录 → 增强项）。

## 业务介绍

**湘村新台**是桂阳古戏台红色文旅的数字门户，以「数字档案 + 红色传播 + 用户共创 + 文旅消费」构成完整业务闭环：

| 环节 | 业务内容 | 面向用户 |
|---|---|---|
| **档案沉淀** | 桂阳各级文保戏台台账数字化（当前收录 **52 座真实文保戏台**：史料/宗祠/文保批次/保护现状/坐标/实拍图/网络资料），支持多条件检索与 PDF/Excel 导出，供乡镇文旅与党史办存档 | 游客 / 政企文旅部门 |
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
    │   ├── seeds/                # seed.sql：管理员/52 戏台/40 题库/38 FAQ/商品等；real_stages.sql+v4：真实戏台台账；media_articles.sql：13 篇媒体报道；faq_extra.sql：FAQ 扩充
    │   └── src/
    │       ├── index.ts          # Hono 入口：logger + cors + 健康检查 + 路由注册 + onError/notFound
    │       ├── types.ts          # Env / Admin / JWTPayload 类型
    │       ├── middleware/auth.ts# JWT 校验 + requireRole 角色中间件
    │       └── routes/           # 19 个资源路由（auth/stages/red-plays/articles/activities/submissions/suggestions/quiz/bookings/study-plans/study-results/products/orders/coupons/faq/ai-chat/news/stats/upload）
    └── web/                      # React 18 + Vite + AntD + React Router
        └── src/
            ├── main.tsx          # ConfigProvider（zhCN + 红旅主题 token）
            ├── App.tsx           # 前台 9 条路由 + 后台 15 条路由 + 全站挂载台小湘 + 兜底回首页
            ├── api/index.ts      # axios 实例 + 全量资源 API 分组（含 aiChatAPI）
            ├── styles/theme.css  # 红色文旅设计系统（CSS 变量 + 工具类）
            ├── components/       # TransparentNav / Footer / PageLayout / AdminLayout / Stage3D / AIAssistant(台小湘) / LazyImage
            ├── sections/         # HeroSection / AboutSection / MediaSection
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

- **官方素材（✅ 2026-09 全量迁 R2）**：统一存 R2 桶 `xiangcun-xintai-assets`，目录：`hero/` 首页滑窗 ｜ `xitai_photos/` 戏台实拍 + 缩略图 ｜ `maps/` 专题图 ｜ `trend_cover/` 资讯封面（待素材）｜ `videos/` 演出视频（待素材）｜ `placeholder_img/` 品牌占位图（无真实素材的内容统一引用）；通过 `/api/files/...` 同域直链（长缓存）。**仅 logo 与 geojson 数据文件保留本地打包**（`apps/web/public/assets/`）。
- **视频（方案变更）**：原「长视频放 B 站裸 iframe」**弃用**——演出视频统一放 R2 `videos/` 目录、`<video>` 直链播放；素材提供后接入（待办）。
- **图片加速（✅ 已上线）**：`_headers` 强缓存（图片/JS/CSS 一年 immutable、HTML no-cache）；42 张戏台图压缩 234MB → 13MB（1600px q80）+ 600px 缩略图（44KB）；档案馆卡片/地图弹窗/台小湘用缩略图 + 懒加载；原图备份于 `原图备份_stage-images/`（gitignore）。
- **视频**：长视频统一放 R2 `videos/` 目录，`<video src="/api/files/videos/xxx.mp4">` 直链播放（不再用 B 站）；素材提供后接入。
- **R2 存储（✅ 2026-08 开通落地）**：桶 `xiangcun-xintai-assets`；`/api/upload`（multipart，图片/短视频 ≤100MB，类型白名单）+ `/api/files/*` 直链读取（长缓存）；**乡村共创投稿已开通图片/视频直接上传**（外链 URL 仍可用）。R2 同时兜底未来超 25MiB 大文件与后台运行期素材上传。
- **AI 台小湘**：左下角悬浮气泡助手（树状对话：湘昆/研学/档案馆/展厅/商城 5 主题分支 → 叶子追问 + 跳转入口按钮；日常闲聊：问候/天气/当前时间；气泡悬停变色、点击淡出后展开聊天窗）；问答库共 60 条（介绍语编号 0 置顶），后台「问答库」可统一管理；管理后台不显示。
- 本地开发请勿提交 `.dev.vars` 与 `wrangler.toml.local`（已在 `.gitignore` 中排除）；生产 `JWT_SECRET` 请通过 Cloudflare secrets 覆盖。

## 主题

戏台红 `#A3232B` · 亮红 `#C0392B` · 湘昆金 `#D4A017` · 米白 `#FAF7F2` · 深褐红 `#3B2A26` · 深戏台褐 `#2B1D1A`。设计 token 见 `apps/web/src/styles/theme.css`，AntD 主题 token 见 `apps/web/src/main.tsx`。
