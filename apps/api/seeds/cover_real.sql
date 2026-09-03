-- 封面占位图替换为真实图（2026-09-03）
-- 兜底策略：官方素材打包图（hero 首屏实拍 + stage-images 戏台实拍）；「首页动态·上线试运行」用 R2 直链演示

-- 红色戏曲（演出视频）
UPDATE red_plays SET cover_url = '/assets/hero/hero-1.jpg' WHERE id = 1;
UPDATE red_plays SET cover_url = '/assets/hero/hero-2.jpg' WHERE id = 2;
UPDATE red_plays SET cover_url = '/assets/hero/hero-3.jpg' WHERE id = 3;
UPDATE red_plays SET cover_url = '/assets/hero/hero-4.jpg' WHERE id = 4;
UPDATE red_plays SET cover_url = '/assets/hero/hero-5.jpg' WHERE id = 5;
UPDATE red_plays SET cover_url = '/assets/map/stage-images/canghai.jpg' WHERE id = 6;

-- 互动阅读
UPDATE articles SET cover_url = '/assets/map/stage-images/chejiang.jpg' WHERE id = 1;
UPDATE articles SET cover_url = '/assets/map/stage-images/chouxia.jpg' WHERE id = 2;
UPDATE articles SET cover_url = '/assets/map/stage-images/dahu.jpg' WHERE id = 3;
UPDATE articles SET cover_url = '/assets/map/stage-images/dawan.jpg' WHERE id = 4;
UPDATE articles SET cover_url = '/assets/map/stage-images/dawo.jpg' WHERE id = 5;
UPDATE articles SET cover_url = '/assets/map/stage-images/daxi.jpg' WHERE id = 6;

-- 首页动态（第 5 条「上线试运行」改用 R2 直链）
UPDATE news SET cover_url = '/assets/map/stage-images/dongliu.jpg' WHERE id = 1;
UPDATE news SET cover_url = '/assets/map/stage-images/douyu.jpg' WHERE id = 2;
UPDATE news SET cover_url = '/assets/map/stage-images/huaijiang.jpg' WHERE id = 3;
UPDATE news SET cover_url = '/assets/map/stage-images/jianjia.jpg' WHERE id = 4;
UPDATE news SET cover_url = '/api/files/uploads/1788429240115-c3c03528.jpg' WHERE id = 5;

-- 研学套餐
UPDATE study_plans SET cover_url = '/assets/map/stage-images/jinhu.jpg' WHERE id = 1;
UPDATE study_plans SET cover_url = '/assets/map/stage-images/langshi.jpg' WHERE id = 2;

-- 商城商品（文创/农特产，兜底用戏台实拍，待真实商品图替换）
UPDATE products SET cover_url = '/assets/map/stage-images/liantang.jpg' WHERE id = 1;
UPDATE products SET cover_url = '/assets/map/stage-images/liyu.jpg' WHERE id = 2;
UPDATE products SET cover_url = '/assets/map/stage-images/meihua.jpg' WHERE id = 3;
UPDATE products SET cover_url = '/assets/map/stage-images/miaoxia.jpg' WHERE id = 4;
UPDATE products SET cover_url = '/assets/map/stage-images/pantang.jpg' WHERE id = 5;
UPDATE products SET cover_url = '/assets/map/stage-images/quanjin.jpg' WHERE id = 6;
UPDATE products SET cover_url = '/assets/map/stage-images/sanlangxia.jpg' WHERE id = 7;
UPDATE products SET cover_url = '/assets/map/stage-images/shangfang.jpg' WHERE id = 8;
