# 湘村新台 · 待办清单（TODO）

> 更新：2026-08-21。P0–P12 已完成（见 `docs/需求与计划.md` §6），以下为剩余工作，按优先级分组。

## A. 前端设计优化

- [ ] 部分排版问题
- [ ] 移动端适配检查：导航、表格横向滚动、抽屉、3D 画布高度、商城结算表单
- [ ] 空态 / 加载态统一（已有基础，逐个页面过一遍）
- [ ] 打印样式完善（档案导出页 `@media print` 已在服务端 HTML 内联，核对浏览器效果）
- [ ] 视觉与交互细节打磨：卡片阴影、渐变过渡带、hover 动效、图标与字体统一（红旅主题贯穿）
- [ ] ......持续反馈更新

## B. 部署与上线

- [ ] API 部署：`pnpm deploy:api`（`wrangler deploy`，需 Cloudflare 账号授权）
- [ ] Web 部署：`pnpm deploy:web`（构建后 Pages 部署 `--branch=main`）
- [ ] 域名绑定 + CORS 白名单补充正式域名
- [ ] 生产 `JWT_SECRET` 通过 Cloudflare secrets 覆盖（勿入库）

## C. 真数据填充 · 素材接入（打包方案 + R2）

> **素材存储决策（2026-08-21 调研）**：官方/精选素材（图片、GeoJSON、OBJ、短音频）**直接打包进 Pages 静态目录**（`apps/web/public/assets/`），随部署上线、CDN 免费无限流量；**用户投稿与超 25MiB 大文件仍需 R2**。限制：Pages 单文件 ≤25 MiB、每站点 ≤20,000 文件（Free）。详见 `docs/需求与计划.md` §7/§8。

- [ ] 官方素材打包方案落地：`apps/web/public/assets/` 目录规范（命名 `模块_类型_编号`）
- [ ] 110 座戏台官方台账导入 `stages`（Excel/CSV），替换 95 条占位行
- [ ] 真实戏台照片替换占位图（打包进 `public/assets/stages/`）
- [ ] 真实经纬度更新 `stages.lng/lat`（同步生成 GeoJSON）
- [ ] **古戏台地图模块**：生成 `public/assets/map/guiyang-stages.geojson` 直接导入，高德/Leaflet 画点 + 点击弹简介（与档案库打通）
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

- [ ] `study_plans` / `study_results` / `news` 后台管理入口（目前仅有 API 与种子数据，可 SQL 维护）
- [ ] 大模型语义问答（替代/补充 FAQ 关键词匹配）
- [ ] 站内「待处理」红点（投稿/预约/建言提醒，替代企微通知）