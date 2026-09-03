-- 素材全量迁 R2 后的封面路径改写（2026-09-03）
-- 规则：stages 有实拍图 → /api/files/xitai_photos/<同名>；其余（无真实文件）→ /api/files/placeholder_img/placeholder_img.png

-- ① stages：/assets/map/stage-images/xxx.jpg → /api/files/xitai_photos/xxx.jpg
UPDATE stages SET cover_url = '/api/files/xitai_photos/' || substr(cover_url, length('/assets/map/stage-images/') + 1) WHERE cover_url LIKE '/assets/map/stage-images/%';

-- ② 无真实文件的封面统一改指向占位图
UPDATE stages SET cover_url = '/api/files/placeholder_img/placeholder_img.png' WHERE cover_url = '';
UPDATE red_plays SET cover_url = '/api/files/placeholder_img/placeholder_img.png' WHERE cover_url LIKE '/assets/%' OR cover_url = '';
UPDATE articles SET cover_url = '/api/files/placeholder_img/placeholder_img.png' WHERE cover_url LIKE '/assets/%' OR cover_url = '';
UPDATE news SET cover_url = '/api/files/placeholder_img/placeholder_img.png' WHERE cover_url LIKE '/assets/%' OR cover_url LIKE '/api/files/uploads/%' OR cover_url = '';
UPDATE study_plans SET cover_url = '/api/files/placeholder_img/placeholder_img.png' WHERE cover_url LIKE '/assets/%' OR cover_url = '';
UPDATE products SET cover_url = '/api/files/placeholder_img/placeholder_img.png' WHERE cover_url LIKE '/assets/%' OR cover_url = '';
