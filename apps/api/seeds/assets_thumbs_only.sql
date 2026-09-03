-- R2 仅存缩略图方案（2026-09）：戏台封面统一指向 thumb 文件（整图已从 R2 删除，本地 原图备份_stage-images/ 保留）
UPDATE stages SET cover_url = '/api/files/xitai_photos/thumb-' || substr(cover_url, length('/api/files/xitai_photos/') + 1) WHERE cover_url LIKE '/api/files/xitai_photos/%' AND cover_url NOT LIKE '%thumb-%';
