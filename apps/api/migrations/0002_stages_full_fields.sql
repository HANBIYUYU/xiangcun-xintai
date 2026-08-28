-- 0002：stages 全字段整理
-- 1) damage 放开 CHECK（存「保护现状」原文，如 保存完好/年久失修）
-- 2) 新增列：name_en/era/province/city/address/ancestral_hall/
--    heritage_batch/heritage_date/heritage_type/media_links/oral_history
-- 3) 原 built_year 存的是「时代」，迁移到新列 era
-- SQLite 不支持 ALTER DROP CONSTRAINT，采用重建表方案

CREATE TABLE stages_new (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT NOT NULL,
  name_en        TEXT NOT NULL DEFAULT '',
  town           TEXT NOT NULL DEFAULT '',
  province       TEXT NOT NULL DEFAULT '',
  city           TEXT NOT NULL DEFAULT '',
  address        TEXT NOT NULL DEFAULT '',
  ancestral_hall TEXT NOT NULL DEFAULT '',
  heritage_level TEXT NOT NULL DEFAULT '未定级' CHECK (heritage_level IN ('国家级', '省级', '市级', '县级', '未定级')),
  heritage_batch TEXT NOT NULL DEFAULT '',
  heritage_date  TEXT NOT NULL DEFAULT '',
  heritage_type  TEXT NOT NULL DEFAULT '',
  era            TEXT NOT NULL DEFAULT '',
  built_year     TEXT NOT NULL DEFAULT '',
  style          TEXT NOT NULL DEFAULT '',
  damage         TEXT NOT NULL DEFAULT '较好',
  history_text   TEXT NOT NULL DEFAULT '',
  red_story      TEXT NOT NULL DEFAULT '',
  repair_log     TEXT NOT NULL DEFAULT '',
  media_links    TEXT NOT NULL DEFAULT '',
  oral_history   TEXT NOT NULL DEFAULT '',
  audio_url      TEXT NOT NULL DEFAULT '',
  lng            REAL,
  lat            REAL,
  cover_url      TEXT NOT NULL DEFAULT '',
  is_red_site    INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

INSERT INTO stages_new (id, name, town, heritage_level, damage, built_year, style, history_text, red_story, repair_log, audio_url, lng, lat, cover_url, is_red_site, created_at, updated_at)
  SELECT id, name, town, heritage_level, damage, built_year, style, history_text, red_story, repair_log, audio_url, lng, lat, cover_url, is_red_site, created_at, updated_at FROM stages;

-- 旧 built_year 为「时代」→ 迁入 era
UPDATE stages_new SET era = built_year WHERE era = '' AND built_year != '';

DROP TABLE stages;
ALTER TABLE stages_new RENAME TO stages;

CREATE INDEX IF NOT EXISTS idx_stages_town          ON stages (town);
CREATE INDEX IF NOT EXISTS idx_stages_heritage      ON stages (heritage_level);
CREATE INDEX IF NOT EXISTS idx_stages_red_site      ON stages (is_red_site);
