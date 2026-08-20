-- 湘村新台 P1 数据库初始化迁移
-- 桂阳古戏台红色文旅数字官网 · D1 (SQLite)
-- 表结构与《构建计划.md》§5 对齐

-- 1. 管理账号（三级权限中的两级管理角色：team 项目团队 / admin 政企文旅管理员）
CREATE TABLE IF NOT EXISTS admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'team' CHECK (role IN ('team', 'admin')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- 2. 戏台数字档案（110 座古戏台台账）
CREATE TABLE IF NOT EXISTS stages (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  town          TEXT NOT NULL DEFAULT '',           -- 所属乡镇
  heritage_level TEXT NOT NULL DEFAULT '未定级' CHECK (heritage_level IN ('国家级', '省级', '市级', '县级', '未定级')),
  damage        TEXT NOT NULL DEFAULT '较好' CHECK (damage IN ('完好', '较好', '一般', '破损', '濒危')),
  built_year    TEXT NOT NULL DEFAULT '',           -- 始建年代（如 "清光绪年间"）
  style         TEXT NOT NULL DEFAULT '',           -- 建筑形制（如 "单檐歇山"）
  history_text  TEXT NOT NULL DEFAULT '',           -- 建筑史料
  red_story     TEXT NOT NULL DEFAULT '',           -- 红色革命事迹
  repair_log    TEXT NOT NULL DEFAULT '',           -- 修缮记录
  audio_url     TEXT NOT NULL DEFAULT '',           -- 村民口述音频（外链）
  lng           REAL,                               -- 经度（真实地图预留）
  lat           REAL,                               -- 纬度
  cover_url     TEXT NOT NULL DEFAULT '',           -- 封面（主题色 SVG 占位或外链）
  is_red_site   INTEGER NOT NULL DEFAULT 0,         -- 是否红色旧址（0/1）
  created_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_stages_town          ON stages (town);
CREATE INDEX IF NOT EXISTS idx_stages_heritage      ON stages (heritage_level);
CREATE INDEX IF NOT EXISTS idx_stages_red_site      ON stages (is_red_site);

-- 3. 红色戏曲/演出视频
CREATE TABLE IF NOT EXISTS red_plays (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT '折子戏' CHECK (category IN ('折子戏', '演出视频')),
  iframe_src  TEXT NOT NULL DEFAULT '',            -- 白名单嵌入：player.bilibili.com / v.qq.com / www.youtube.com
  cover_url   TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_red_plays_category ON red_plays (category, sort_order);

-- 4. 互动阅读（红色戏台故事图文 / 公众号推文）
CREATE TABLE IF NOT EXISTS articles (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL DEFAULT '',
  cover_url   TEXT NOT NULL DEFAULT '',
  source      TEXT NOT NULL DEFAULT '',            -- 来源（如 "桂阳发布"公众号）
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_articles_sort ON articles (sort_order);

-- 5. 线下红旅活动预告
CREATE TABLE IF NOT EXISTS activities (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT '红色党课' CHECK (type IN ('红色党课', '非遗体验', '戏曲汇演')),
  place       TEXT NOT NULL DEFAULT '',
  start_time  TEXT NOT NULL DEFAULT '',
  end_time    TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT '报名中' CHECK (status IN ('报名中', '已结束', '已取消')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_activities_time ON activities (start_time);

-- 6. 红色记忆投稿（游客提交 + 团队审核流）
CREATE TABLE IF NOT EXISTS submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name TEXT NOT NULL DEFAULT '',
  contact     TEXT NOT NULL DEFAULT '',
  type        TEXT NOT NULL DEFAULT '老照片' CHECK (type IN ('老照片', '口述', '短视频')),
  content     TEXT NOT NULL DEFAULT '',
  media_url   TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT '待审核' CHECK (status IN ('待审核', '已通过', '已驳回')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions (status);

-- 7. 活化建言留言板
CREATE TABLE IF NOT EXISTS suggestions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT '修缮保护' CHECK (category IN ('修缮保护', '文旅开发', '宣传推广', '其他')),
  content     TEXT NOT NULL DEFAULT '',
  contact     TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT '待处理' CHECK (status IN ('待处理', '已归档', '已采纳')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions (status);

-- 8. 答题题库（种子 ≥40 题）
CREATE TABLE IF NOT EXISTS quiz_questions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  question    TEXT NOT NULL,
  option_a    TEXT NOT NULL DEFAULT '',
  option_b    TEXT NOT NULL DEFAULT '',
  option_c    TEXT NOT NULL DEFAULT '',
  option_d    TEXT NOT NULL DEFAULT '',
  answer      TEXT NOT NULL CHECK (answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT NOT NULL DEFAULT '',
  stage_id    INTEGER,                             -- 关联戏台（可空）
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_quiz_stage ON quiz_questions (stage_id);

-- 9. 研学预约单
CREATE TABLE IF NOT EXISTS bookings (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  org_name     TEXT NOT NULL,
  contact      TEXT NOT NULL DEFAULT '',
  plan_type    TEXT NOT NULL DEFAULT '中小学思政' CHECK (plan_type IN ('中小学思政', '高校实践')),
  people_count INTEGER NOT NULL DEFAULT 0,
  duration     TEXT NOT NULL DEFAULT '',           -- 研学时长（如 "1 天"）
  target_stage TEXT NOT NULL DEFAULT '',           -- 目标研学/参访古戏台
  note         TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT '待确认' CHECK (status IN ('待确认', '已确认', '已完成', '已取消')),
  created_at   TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

-- 10. 研学套餐
CREATE TABLE IF NOT EXISTS study_plans (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT '中小学思政' CHECK (type IN ('中小学思政', '高校实践')),
  schedule    TEXT NOT NULL DEFAULT '',            -- 标准化行程
  courseware  TEXT NOT NULL DEFAULT '',            -- 课程课件说明
  teachers    TEXT NOT NULL DEFAULT '',            -- 师资介绍
  cover_url   TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_study_plans_type ON study_plans (type);

-- 11. 研学成果展示
CREATE TABLE IF NOT EXISTS study_results (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  org_name    TEXT NOT NULL DEFAULT '',
  content     TEXT NOT NULL DEFAULT '',
  images      TEXT NOT NULL DEFAULT '',            -- 逗号分隔外链
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- 12. 商品（文创 / 农特产）
CREATE TABLE IF NOT EXISTS products (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT '文创' CHECK (category IN ('文创', '农特产')),
  price         REAL NOT NULL DEFAULT 0,
  stock         INTEGER NOT NULL DEFAULT 0,
  cover_url     TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  revenue_note  TEXT NOT NULL DEFAULT '',          -- 收益反哺戏台修缮说明
  created_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);

-- 13. 订单（预约单 + 线下自提/同城配送，优惠券码抵扣）
CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no    TEXT NOT NULL UNIQUE,
  items       TEXT NOT NULL DEFAULT '',            -- JSON：[{title, qty, price}]
  total       REAL NOT NULL DEFAULT 0,
  coupon_code TEXT NOT NULL DEFAULT '',
  pickup_type TEXT NOT NULL DEFAULT '自提' CHECK (pickup_type IN ('自提', '配送')),
  contact     TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT '待处理' CHECK (status IN ('待处理', '已核销', '已取消')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- 14. 优惠券
CREATE TABLE IF NOT EXISTS coupons (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  code        TEXT NOT NULL UNIQUE,
  type        TEXT NOT NULL DEFAULT '立减' CHECK (type IN ('立减', '折扣')),
  value       REAL NOT NULL DEFAULT 0,
  owner_phone TEXT NOT NULL DEFAULT '',
  source      TEXT NOT NULL DEFAULT '答题' CHECK (source IN ('答题', '投稿', '活动')),
  status      TEXT NOT NULL DEFAULT '未用' CHECK (status IN ('未用', '已用')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons (status);

-- 15. AI 固定问答库（台小湘）
CREATE TABLE IF NOT EXISTS faq_entries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  question    TEXT NOT NULL,
  keywords    TEXT NOT NULL DEFAULT '',            -- 逗号分隔关键词
  answer      TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- 16. 校地红旅合作新闻
CREATE TABLE IF NOT EXISTS news (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL DEFAULT '',
  cover_url   TEXT NOT NULL DEFAULT '',
  date        TEXT NOT NULL DEFAULT (date('now', 'localtime')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
