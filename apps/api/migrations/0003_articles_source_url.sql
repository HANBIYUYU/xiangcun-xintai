-- 互动阅读：新增「原文链接」字段（2026-09）
ALTER TABLE articles ADD COLUMN source_url TEXT NOT NULL DEFAULT '';
