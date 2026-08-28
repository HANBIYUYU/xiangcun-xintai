# 湘村新台 · 待办清单（TODO）

> 更新：2026-08-21（第二次部署后）。P0–P12 已完成并上线（见 `docs/需求与计划.md`），以下为剩余工作，按优先级分组。

## A. 前端设计优化

- [ ] 移动端适配检查：导航、表格横向滚动、抽屉、3D 画布高度、商城结算表单
- [ ] 视觉与交互细节打磨
- [ ] 空态 / 加载态统一（已有基础，逐个页面过一遍）
- [ ] 打印样式完善（档案导出页 `@media print` 已在服务端 HTML 内联，核对浏览器效果）
- [ ] stage-images 大图压缩（12 张 10-19MB → 目标 <1MB）
- [ ] ......持续反馈更新

## B. 部署与上线

- [x] API 部署：`wrangler deploy --env production`（2026-08-21 已上线）
- [x] Web 部署：Pages `--project-name=xiangcun-xintai --branch=main`（2026-08-21 已上线）
- [ ] 域名绑定 + CORS 白名单补充正式域名（当前使用 `*.pages.dev`）
- [ ] 生产 `JWT_SECRET` 通过 Cloudflare secrets 覆盖（勿入库）

## C. 真数据填充 · 素材接入（打包方案 + R2）

> **素材存储决策（2026-08-21 调研）**：官方/精选素材（图片、GeoJSON、OBJ、短音频）**直接打包进 Pages 静态目录**（`apps/web/public/assets/`），随部署上线、CDN 免费无限流量；**用户投稿与超 25MiB 大文件仍需 R2**。限制：Pages 单文件 ≤25 MiB、每站点 ≤20,000 文件（Free）。详见 `docs/需求与计划.md` §7/§8。

- [x] 官方素材打包方案落地：`apps/web/public/assets/`（hero 5 图 + logo + map 数据 + stage-images）
- [x] 42 座真实文保戏台导入 `stages`（`ancient_stages.geojson` → `seeds/real_stages.sql`，本地+远程）
- [x] 真实戏台照片接入（`stage-images/` 42 张，`cover_url` 一一对应）
- [x] 真实经纬度导入 `stages.lng/lat`（与地图一致）
- [x] **古戏台地图模块**：`/map` ArcGIS 交互地图（42 点位 + 文保着色 + 弹窗档案/照片）+ 6 张专题图集
- [ ] 破损程度真实数据补录（现为默认"较好"，待保存状态台账或后台逐条更新）
- [ ] **3D 模型**：OBJ 文件直接导入（`public/assets/models/*.obj` + MTL/贴图），three.js OBJLoader 加载；单文件 ≤25MiB，超限拆分或压缩
- [ ] 正式演出视频嵌入地址替换 `bvid=PLACEHOLDER*`（B 站上传 + 官方裸 iframe 嵌入；后续可选 Cloudflare Stream 私有视频）
- [ ] 村民口述音频采集（≤25MiB 短音频可打包；长音频走 R2/外链）
- [ ] 题库按真实台账校订、扩充（≥40 题）
- [ ] 公众号推文、校地新闻、研学成果、商品图文真实资料录入
- [ ] FAQ 依据官方资料校订
- [ ] 演示账号 `xiangcun2026` 改密
- [ ] R2 存储开通 → `/api/upload` 落地（用户投稿/大文件，需支付方式）
- [ ] 乡村共创平台，开通图片视频上传功能（依赖 R2）

## D. 其余（增强项，按需排期）

- [x] `news` 后台管理入口（已上线「首页动态」管理，team）
- [ ] `study_plans` / `study_results` 后台管理入口（目前仅有 API 与种子数据，可 SQL 维护）
- [ ] 大模型语义问答（替代/补充 FAQ 关键词匹配）
- [ ] 站内「待处理」红点（投稿/预约/建言提醒，替代企微通知）
