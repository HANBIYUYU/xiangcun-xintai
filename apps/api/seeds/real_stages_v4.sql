-- stages 全字段整理导入 v4（保护现状原文 + 新增列；追加式不覆盖）
UPDATE stages SET name_en = 'Daxi Village Ancient Stage', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县大溪村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '骆氏宗祠' ELSE ancestral_hall END, heritage_batch = CASE WHEN heritage_batch = '' THEN '第八批全国重点文保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2019.10.7' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '明至清' ELSE era END, built_year = '明嘉靖（1522-1566）', history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台基高1.9米，进深8.6米，面阔6.3米，围高0.3米。
雕刻彩绘：前檐抬梁雕刻双龙戏珠及花鸟。
结构形制：砖木结构，单檐歇山顶。台左边是料石砌阶梯。顶蓬正中制八卦藻井，戏台上部为木结构。
匾额对联：前，后台置屏风木板上书"有庆"字匾。屏风背面留有清嘉庆年间维修工程竣工时，福庆园戏班在此演出16天，56个昆曲节目的墨迹。
文化价值：见证桂阳明清时的戏台上演桂阳昆曲，为桂阳昆曲文化的发展作出辉煌贡献。' WHERE name = '大溪村古戏台';
UPDATE stages SET name_en = 'Sanlangxia Open-air Ancient Stage', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县三郎下村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, built_year = '' WHERE name = '三郎下露天古戏台';
UPDATE stages SET name_en = 'Chen''s Ancestral Hall Stage in Zhuli Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县竹里村', heritage_batch = CASE WHEN heritage_batch = '' THEN '桂阳县第五批县保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2017.4.12' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代嘉庆十二年' ELSE era END, built_year = '' WHERE name = '竹里村成氏宗祠古戏台';
UPDATE stages SET name_en = 'Chen''s Ancestral Hall Stage in Taiping Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县太坪村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '成氏宗祠' ELSE ancestral_hall END, heritage_batch = CASE WHEN heritage_batch = '' THEN '湖南省第十批省保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2019.2.28' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代道光八年' ELSE era END, built_year = '清光绪癸已年（1893）', damage = CASE WHEN damage = '较好' THEN '保存较好' ELSE damage END, media_links = CASE WHEN media_links = '' THEN '有【经纬度】http://baike.duqu8.com/s/5d9a0a14e198a7cf9f1ed4e0d105dedd/689942/ ；【湖南省文物局关于省级文物保护单位桂阳昆曲古戏台（增补点）三期工程——太平成氏宗祠古戏台修缮工程勘察设计方案的批复】https://wwj.hunan.gov.cn/wwj/c100322/c100324/202509/t20250924_33812961.html' ELSE media_links END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台基高2.0米，台面至台口横梁高5.8米，台面阔6.2米，进深5米；后台面阔11米，进深5米。前台沿三面均以0.3米的青条石围栏。
雕刻彩绘：台口石栏雕二龙戏珠，台基左右转角石雕刻花鸟和戏曲人物故事。前封檐板刻龙凤；隔板绘有福，禄，寿三星彩图。
结构形制：戏台和两侧厢楼连为一体，厢楼用于演出团队放置行头，临时休息，换妆。台基用青砖砌墙。台右置青石台阶。前台有8根木柱支撑上架斗蓬，台中以木板隔成屏风，两边有耳门。后台两边有楼梯上下两侧厢楼。戏台为单檐歇山式，青瓦屋面。
匾额对联：前墙“光绪癸已监造，一品当朝，万代诸侯，丁粮两盛，富贵双全，荣华富贵，万代荣昌”。两边耳门“出将”，“入相”。隔板上部有“风歌雅韵”匾额。后台板，壁多处有昆曲，祁剧班戏班演出剧目、演出留言。' WHERE name = '太坪村成氏宗祠古戏台';
UPDATE stages SET name_en = 'Chen''s Ancestral Hall Stage in Shangfang Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县上坊村', heritage_batch = CASE WHEN heritage_batch = '' THEN '桂阳县第五批县保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2017.4.12' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代道光十年' ELSE era END, built_year = '' WHERE name = '上坊村成氏宗祠古戏台';
UPDATE stages SET name_en = 'Tongmu Village Open-air Ancient Stage', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县桐木村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, built_year = '' WHERE name = '桐木村露天古戏台';
UPDATE stages SET name_en = 'Shi''s Ancestral Hall Stage in Tingxia Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县亭下村', heritage_batch = CASE WHEN heritage_batch = '' THEN '桂阳县第五批县保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2017.4.12' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代同治六年' ELSE era END, built_year = '清同治年间（1862–1874）', media_links = CASE WHEN media_links = '' THEN '亭下史家古戏台影像https://www.douyin.com/video/7606300352400966058' ELSE media_links END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：前台面阔6.6米，进深5米，高1.2米；后台面阔11米，进深9米。
雕刻彩绘：木屏镂雕花卉窗棂；斗拱下檐板和牵梁雕刻麒麟、鹿和各种花卉；屋脊雕塑宝塔式葫芦；翘角飞檐有龙凤争扬。
结构形制：呈倒凸字形，座北朝南；前台6柱；前顶有覆盆藻井；左右有石砌阶梯；歇山式顶。
风格特色：充满民族传统建筑风格
文化价值：具有较高的历史、科学、艺术研究价值。' WHERE name = '亭下村史氏宗祠古戏台';
UPDATE stages SET name_en = 'Shi''s Ancestral Hall Stage in Tingxia Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县亭下村', heritage_batch = CASE WHEN heritage_batch = '' THEN '桂阳县第五批县保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2017.4.12' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代同治六年' ELSE era END, built_year = '清同治年间（1862–1874）', media_links = CASE WHEN media_links = '' THEN '亭下史家古戏台影像https://www.douyin.com/video/7606300352400966058' ELSE media_links END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：前台面阔6.6米，进深5米，高1.2米；后台面阔11米，进深9米。
雕刻彩绘：木屏镂雕花卉窗棂；斗拱下檐板和牵梁雕刻麒麟、鹿和各种花卉；屋脊雕塑宝塔式葫芦；翘角飞檐有龙凤争扬。
结构形制：呈倒凸字形，座北朝南；前台6柱；前顶有覆盆藻井；左右有石砌阶梯；歇山式顶。
风格特色：充满民族传统建筑风格
文化价值：具有较高的历史、科学、艺术研究价值。' WHERE name = '亭下村露天古戏台';
UPDATE stages SET name_en = 'Deng''s Ancestral Hall Stage in Chejiang Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县车江村', heritage_batch = CASE WHEN heritage_batch = '' THEN '桂阳县第五批县保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2017.4.12' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代乾隆二十五年' ELSE era END, built_year = '' WHERE name = '车江村邓氏宗祠古戏台';
UPDATE stages SET name_en = 'Lei''s Ancestral Hall Stage in Miaoxia Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县庙下村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '雷氏宗祠' ELSE ancestral_hall END, heritage_batch = CASE WHEN heritage_batch = '' THEN '桂阳县第五批县保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2017.4.12' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '明万历年间 - 清康熙年间' ELSE era END, built_year = '清乾隆三年（1738）', media_links = CASE WHEN media_links = '' THEN '对【基本情况】有详细补充。http://www.tcmap.com.cn/landscape/106/guiyangguxitaiqun.html' ELSE media_links END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台基高5.8米；前台面阔6.2米，进深5米；后台面阔11米，进深3米。
雕刻彩绘：卷草雕花、龙头雕饰、花鸟山水壁画、花鸟木雕装饰、“二龙戏珠”木雕、龙尾戏珠（龙头含珠、回望呼应、龙身翻腾穿插）。
结构形制：戏台与两侧厢楼连为一体，前台与厢楼廊道齐平；后台与宗祠北墙紧紧连接，形成倒“山”字建筑格局；戏台底部吊脚楼式，屋面单檐歇山式；整个戏台包括副台、后台和侧楼，均为木结构；台前四柱为八字形，以月梁相连；前、后台之间置木板屏风，两侧有耳门，中设花格窗棂；后台两边有阶梯上两侧厢楼；台顶八角藻井。
匾额对联：屏风板上书“南风之薰”；厢楼砖墙上书对联：“□□窦桂种鸡山根深枝茂，让水廉泉生石洞源远流长”；屏风后面和两边厢楼粉墙多处留有清代至民国期间昆曲、花灯、班社等演出留言墨迹。
风格特色：造型独具一格，木雕工艺精湛，“二龙戏珠”“龙尾戏珠”等木雕是难得一见民间工艺精品。
文化价值：是研究湘南文化不可多得的实物资料，具有较高的历史、科学和艺术价值。2014年该村荣获湖南省“全国重点文物保护单位和省级文物保护单位集中成片传统村落文化遗产整体保护利用示范村”称号。唱戏，在庙下村，就是一种生活方式。尽管日月更替，但咿呀咿呀的唱腔依然在庙下村萦绕，从来不曾因为现代文明的冲击而消沉。古村有一个成立于上世纪50年代的乡村业余湘剧团，演员全部是村里的雷氏族人。剧团现有28人，年龄最大的82岁，最小的24岁。' WHERE name = '庙下村雷氏宗祠古戏台';
UPDATE stages SET name_en = 'Zaixia Village Open-air Ancient Stage', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县寨下村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, built_year = '' WHERE name = '寨下村露天古戏台';
UPDATE stages SET name_en = 'Liu''s Ancestral Hall Stage in Shetang Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县社塘村', heritage_batch = CASE WHEN heritage_batch = '' THEN '桂阳县第五批县保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2017.4.12' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代嘉庆十八年' ELSE era END, built_year = '' WHERE name = '社塘村刘氏宗祠古戏台';
UPDATE stages SET name_en = 'Hou''s Ancestral Hall Stage in Dahu Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县大湖村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '侯氏宗祠' ELSE ancestral_hall END, heritage_batch = CASE WHEN heritage_batch = '' THEN '桂阳县第五批县保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2017.4.12' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代道光八年' ELSE era END, built_year = '清道光年间（1820–1850）', damage = CASE WHEN damage = '较好' THEN '前檐口拱棚下雕刻彩绘严重损坏、模糊不清；戏台两侧木制厢楼结构稳固、完整无损。' ELSE damage END, media_links = CASE WHEN media_links = '' THEN '【四普撷珍】' ELSE media_links END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台下以8根直径约0.4米圆木柱立于精美雕刻石础上。
雕刻彩绘：戏台上半部木构件雕刻龙头、花枝；瓦脊端为蟠龙仰天；檐板木雕精美。
结构形制：上下均为木结构，为单檐歇山式；台柱穿梁与宗祠砖墙连接；两侧木制厢楼结构稳固。
风格特色：清代木结构戏台，木雕精美，单檐歇山式，台柱与宗祠砖墙相连增强稳固性。
文化价值：侯氏宗祠古戏台不仅是一处建筑艺术的结晶，更是桂阳地区传统戏曲文化的重要载体，是研究当地昆曲文化发展的重要实物见证。各色剧目在这方舞台上上演，也成为维系乡土社会情感的纽带。这座戏台凝结着地方匠师的智慧，也记录了民间艺术与宗族文化交融的印记。作为桂阳地区保存较为完好的清代戏台建筑之一，大湖村侯氏宗祠古戏台兼具历史、艺术与科学价值。其木构技艺、石雕工艺和彩画艺术，为研究湘南地区宗祠建筑形制、装饰风格与戏曲文化传播提供了重要的实物依据。' WHERE name = '大湖村侯氏宗祠古戏台';
UPDATE stages SET name_en = 'Liu''s Ancestral Hall Stage in Douyu Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县斗余村', heritage_batch = CASE WHEN heritage_batch = '' THEN '桂阳县第五批县保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2017.4.12' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代道光十二年' ELSE era END, built_year = '' WHERE name = '斗余村刘氏宗祠古戏台';
UPDATE stages SET name_en = 'Lei''s Ancestral Hall Stage in Langshi', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县浪石村', heritage_batch = CASE WHEN heritage_batch = '' THEN '第八批全国重点文保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2019.10.7' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代光绪六年' ELSE era END, built_year = '' WHERE name = '浪石雷氏宗祠古戏台';
UPDATE stages SET ancestral_hall = CASE WHEN ancestral_hall = '' THEN '唐氏宗祠' ELSE ancestral_hall END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清乾隆年间（1735–1796）', damage = CASE WHEN damage = '较好' THEN '保存完好' ELSE damage END, media_links = CASE WHEN media_links = '' THEN '有【百度百科】https://baike.baidu.com/item/%E4%B8%8B%E6%A1%A5%E5%94%90%E6%B0%8F%E5%AE%97%E7%A5%A0/20587221' ELSE media_links END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：戏台上部分三层，第一层高2.8米。
雕刻彩绘：前沿围台石一对雕刻精细石狮；前面封檐板雕刻双龙戏珠；两侧及各层檐口木构件雕刻各种动物、花草图案。
结构形制：下部以磨制青条石围筑；上部木结构，前四柱为八字形布局；左右檐下另附斜檐。戏台上部分三层，三层重檐八角亭阁式（穹隆式）：第一层上架设十字方梁，十字方梁交叉处设置雷公柱至顶层；第二层、第三层各8根牵梁伸向童柱，形成三层八角形宝塔式穹窿式顶；楼顶置有相轮和陶质宝瓶。
风格特色：三层重檐八角亭阁式（穹隆式）戏台，涂金绘彩，建筑造型特殊。
文化价值：彰显古代建筑工艺高超和文化底蕴。
关注情况：保护范围：以祠堂外墙基为起点，四向各至50米处；建设控制地带：保护范围四向外延100米。' WHERE name = '下桥村唐氏宗祠古戏台';
UPDATE stages SET name_en = 'Yang''s Ancestral Hall Stage in Jianjia Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县蒹葭村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '蒹葭村杨氏宗祠古戏台';
UPDATE stages SET name_en = 'Zhou''s Ancestral Hall Stage in Shuitou Village, Zhaojin', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县昭金水头村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '昭金水头村周氏宗祠古戏台';
UPDATE stages SET name_en = 'Wei Family Ancestral Hall Stage in Zhaojin Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县昭金村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '魏家宗祠' ELSE ancestral_hall END, heritage_batch = CASE WHEN heritage_batch = '' THEN '湖南省第十批省保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2019.2.28' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清同治二年（1863）', media_links = CASE WHEN media_links = '' THEN '【都说桂阳美' ELSE media_links END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台基高2.0米，进深5.2米，面阔7.8米；圆柱4排12根，每根柱粗0.3米。
雕刻彩绘：木构件精雕细刻龙凤花鸟等吉祥物。
结构形制：倚宗祠中大门立圆柱，行人从戏台楼底穿过；后部左右短砖墙承托横梁，砖墙外与马头墙间有小楼；木构架三面檐口及屏墙以方木镶合；屋面单檐歇山式。
匾额对联：内台屏墙上有清光绪至民国年间15个昆曲文秀班和花灯戏班演出的墨迹留言。
风格特色：建筑工艺高超，承载桂阳昆曲等戏曲文化传承。
文化价值：魏家公祠古戏台作为湘昆戏曲的重要载体，具有多重价值：历史价值方面，它见证了晚清湘军文化对地方社会的影响；文化价值方面，它是湘南地区宗族文化与戏曲艺术融合的典型代表；审美价值方面，其建筑形制与装饰艺术展现了湘南工匠的高超技艺；科技价值方面，藻井的声学设计和木构架的力学结构体现了传统建筑的智慧；时代价值方面，它的保护与活化利用为传统村落的文化振兴提供了范例。
关注情况：“浴火重生”' WHERE name = '昭金村魏家宗祠古戏台';
UPDATE stages SET name_en = 'Liyu Village Open-air Ancient Stage', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县鲤鱼村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '鲤鱼村露天古戏台';
UPDATE stages SET name_en = 'Luo''s Ancestral Hall Stage in Huaijiang Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县槐江村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '槐江村罗氏宗祠古戏台';
UPDATE stages SET name_en = 'Hou''s Ancestral Hall Stage in Chouxia Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县愁下村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '侯氏宗祠' ELSE ancestral_hall END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清嘉庆二年（1797）', damage = CASE WHEN damage = '较好' THEN '具有深厚民族文化传统底蕴和明清建筑风格' ELSE damage END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台基高1.4米；台面进深7.6米，面阔6.1米。
雕刻彩绘：打磨围石右：孔雀开屏、二鹿相依；左：花鸟虫鱼、二马游春；前台口横梁：含珠龙头、双狮滚绣球、鲤鱼跳龙门、虎跃龙腾、二龙戏珠。
结构形制：台基以砖石砌筑；前台口横梁；后台砖墙柱；左右有吊脚楼；屋面为歇山式顶。
风格特色：后台砖墙柱对联：“合百代之笙簧鼓瑟或清或浊闻人尤宜领趣；仰千秋之善恶忠奸可惩可罚睹青着意会参”；屏壁后有历年昆、祁、花灯演出留言。' WHERE name = '愁下村侯氏宗祠古戏台';
UPDATE stages SET name_en = 'Luo''s Ancestral Hall Stage in Shanglongquan', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县上龙泉村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '胡氏宗祠' ELSE ancestral_hall END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清雍正十一年（1722）', damage = CASE WHEN damage = '较好' THEN '至今保存完好' ELSE damage END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：围高0.3米。
雕刻彩绘：青石浮雕龙、鱼、花鸟、虫草等10幅；柱础雕刻花纹；泥塑“龙凤呈祥”；雕刻“双鹿”；彩绘“八仙”；横梁雕刻双龙头及其他吉祥动物；屏风木板有彩画。
结构形制：戏台独立坐落在宗祠内；后台紧连两侧砖房二楼，从后台木梯上台面；前台沿三面以青条石围栏；8个圆柱从台底撑至台顶蓬；单檐歇山顶。
匾额对联：台中屏风木板，前面上书“与人同”；两边砖墙柱上书对联。
风格特色：突显明清时期建筑风格
文化价值：为族人团结，凝聚家族力量，构建和谐家园与社会，起着不可估量的作用。
关注情况：遭文革时期破四旧风暴的劫难，旧神台被毁坏。现有的神台是1996年仿古修复而成的，比起旧神台，差得很远了！https://mp.weixin.qq.com/s/L9U-wD8AA6OmwdZrEOgj-Q' WHERE name = '上龙泉罗氏宗祠古戏台';
UPDATE stages SET name_en = 'Ning''s Ancestral Hall Stage in Canghai', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县沧海村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '宁氏宗祠' ELSE ancestral_hall END, heritage_batch = CASE WHEN heritage_batch = '' THEN '湖南省第十批省保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2019.2.28' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清康熙（1661-1722）', damage = CASE WHEN damage = '较好' THEN '村民全面修缮' ELSE damage END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台基高1.6米，深6.6米，阔7米
雕刻彩绘：戏台前沿围台石雕刻一对石狮，檐板雕刻双龙系珠，八仙过海等图案
结构形制：台基由青砖砌筑。前沿左右两柱竖立米多高的石柱础，与台基的转角石相连，形成一个牢固的框架。台顶歇山式，盖小青瓦
风格特色：明清时期建筑风格和深邃的传统文化精髓' WHERE name = '沧海宁氏宗祠古戏台';
UPDATE stages SET name_en = 'Li''s Ancestral Hall Stage in Dwo', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县大窝村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '大窝李氏宗祠古戏台';
UPDATE stages SET name_en = 'Fu''s Ancestral Hall Stage in Xiatang', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县夏塘村', heritage_batch = CASE WHEN heritage_batch = '' THEN '桂阳县第五批县保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2017.4.12' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '夏塘傅氏宗祠古戏台';
UPDATE stages SET name_en = 'Fu''s Ancestral Hall Stage in Jinhu', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县锦湖村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '傅氏宗祠' ELSE ancestral_hall END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清乾隆十一年（1746）', damage = CASE WHEN damage = '较好' THEN '保存完好' ELSE damage END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：基座高1.7米，前台面阔6.7米，进深为4.8米。
雕刻彩绘：戏台封檐板雕刻八仙过海，双龙戏珠；围石雕刻玉兔奔月，宗祠四壁彩绘戏曲人文故事。
结构形制：基座以料石叠砌，左右两厢置吊脚木楼。单檐歇山式顶，盖小青瓦。
匾额对联：台上内柱对联“笙磬同音，以雅以谷，舞台中金声玉振；妍共鉴，无古无今，环宇内舜日尧天。”
风格特色：明清时期优秀文化和建筑风格' WHERE name = '锦湖傅氏宗祠古戏台';
UPDATE stages SET name_en = 'Peng''s Ancestral Hall Stage in Liantang', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县莲塘村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '莲塘彭氏宗祠古戏台';
UPDATE stages SET name_en = 'Xia''s Ancestral Hall Stage in Dawan', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县大湾村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '夏氏宗祠' ELSE ancestral_hall END, heritage_batch = CASE WHEN heritage_batch = '' THEN '郴州市第四批市保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2018.8.10' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清乾隆末年', damage = CASE WHEN damage = '较好' THEN '保存完好' ELSE damage END, media_links = CASE WHEN media_links = '' THEN '【醉美大湾】https://www.meipian.cn/4xbb168x' ELSE media_links END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：前台面阔4.6米，进深4.4米。
雕刻彩绘：前台中两个转柱下部为条石刻两条青龙盘绕石柱上，上部木构件均雕刻龙凤等吉祥物。
结构形制：戏台底座为青砖筑砌，台面沿口用青条石覆盖。前台中有覆钵藻井，屋面歇山式顶盖小青瓦。
匾额对联：后台砖柱对联“祠曲谱声是达道思归广陵欲散；（有缺字）水有情。”
风格特色：明清时期古典建筑风格
关注情况：《夏寿田传》和MV《醉美大湾》；建立“院校志愿服务实践基地“（2023）' WHERE name = '大湾夏氏宗祠古戏台';
UPDATE stages SET name_en = 'Peng''s Ancestral Hall Stage in Dongliu', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县东流村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '东流彭氏宗祠古戏台';
UPDATE stages SET name_en = 'Yan''s Ancestral Hall Stage in Shebei Village, Zhuxi', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县竹溪社背村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '竹溪社背村颜氏宗祠古戏台';
UPDATE stages SET name_en = 'Yan''s Ancestral Hall Stage in Lingbei Village, Zhuxi', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县竹溪岭背村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '竹溪岭背村颜氏宗祠古戏台';
UPDATE stages SET name_en = 'Yan''s Ancestral Hall Stage in Laowu Village, Zhuxi', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县竹溪老屋村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '颜氏宗祠' ELSE ancestral_hall END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清嘉庆二十三年（1818）', damage = CASE WHEN damage = '较好' THEN '年久失修，屋背漏雨木方腐朽，彩绘模糊，部分精美构件在文化大革命中被毁。' ELSE damage END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台基高1.8米，台面至前檐横梁高5.8米；台面宽6.6米，深5.5米；后台宽11米，深3米。
雕刻彩绘：前檐斗拱飞檐、抬梁及横梁上有木雕花草及龙凤，左右两边绘有历史人物故事。
结构形制：戏台与两侧厢楼连为一体；台基用青砖砌墙，内有井字木架撑托台面；8根木柱支撑台顶；台前沿三面以0.3米青石围栏，台口石栏雕一对石狮；前、后台之间用木板构成屏风，两边置耳门，隔板有窗棂，后台两边有木梯通往两侧厢楼；戏台为单顶歇山式。
匾额对联：宗祠大门两边石刻对联：“道接尼山观旧绪，名齐灵运抚新猷”；后台隔板上和两边厢楼粉墙壁记载有昆曲、花灯、调班等演出事务题笔。
风格特色：单顶歇山式，青瓦屋面；前檐斗拱飞檐；木雕彩绘；与吊角厢楼连为一体，兼具实用与艺术价值。' WHERE name = '竹溪老屋村颜氏宗祠古戏台';
UPDATE stages SET name_en = 'Chen''s Ancestral Hall Stage in Sizhou Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县泗州村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '陈氏宗祠' ELSE ancestral_hall END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清嘉庆二十四年（1819）', damage = CASE WHEN damage = '较好' THEN '构件老化，但保存比较完整。' ELSE damage END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台基高1.7米；台面阔5.0米，进深7.8米。
雕刻彩绘：前台两角柱础上部圆柱雕刻多种花纹；台上木构件雕绘古代工艺美术图案。
结构形制：座西朝东；台基以砖石叠砌；整体均为木料构制；前台两角柱础底部为雕刻的方石墩，上部为圆柱。
风格特色：制作工艺精细，为明清时期建筑工艺与文化的实物载体。对研究明清时期的建筑工艺和文化有一定的启迪作用。
文化价值：对研究湘南古代宗祠、戏台建筑艺术及桂阳戏曲文化的发展，具有非常重要的价值。' WHERE name = '泗州村陈氏宗祠古戏台';
UPDATE stages SET name_en = 'Ouyang Ancestral Hall Stage in Xiayang Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县下阳村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '欧阳氏宗祠' ELSE ancestral_hall END, heritage_batch = CASE WHEN heritage_batch = '' THEN '第八批全国重点文保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2019.10.7' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清顺治十年（1653）', damage = CASE WHEN damage = '较好' THEN '保存完好' ELSE damage END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台座进深8.5米，面阔6.2米。
雕刻彩绘：两前角石柱础雕刻变形大象和麒麟，前台的围台石正中镶嵌一对石狮滚绣球。台上两根转柱精刻两条盘龙缠石柱，前檐方木镂雕“双龙争日"”。戏台两侧檐雕八仙过海，旁有花鸟虫鱼陪护。左右檐口以木质莲花叠成斗拱。宗祠墙壁彩绘精美画，屋面两端膏泥堆塑龙头。
结构形制：座南朝北，对应神堂。座为青料石叠筑台上两根转柱，下段以圆形汉白玉为座。前，后台以木板屏风相隔。后台为化妆室；台左右两厢伸出吊舞楼，供演员住宿和存放道具。戏台顶部为绘彩覆盆井。屋面为单檐歇山式，两端形成檐翅角，屋脊中央置陶质彩色葫芦钻赞尖顶。
匾额对联：大门首悬“进士第”匾额
风格特色：传统建筑风格' WHERE name = '下阳村欧阳宗祠古戏台';
UPDATE stages SET name_en = 'Ouyang Ancestral Hall Stage in Shangyang Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县上阳村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '欧阳氏宗祠' ELSE ancestral_hall END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清乾隆十七年（1752）', damage = CASE WHEN damage = '较好' THEN '保存完好' ELSE damage END, media_links = CASE WHEN media_links = '' THEN '上阳村欧阳氏据称是北宋欧阳修的后裔' ELSE media_links END, history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台基高1.7米，前台正面宽5.3米，两侧深4.8米，后台宽5.8米，深2.0米；上部高约5.0米。
雕刻彩绘：檐板刻有龙凤争舞及各种吉祥物图像，斗拱木雕凤头。
结构形制：座北朝南，台基为青条石叠筑。上部为木结构，中为木板和雕花窗棂相隔。
匾额对联：前后间两门“出将”、“入相”
风格特色：中国传统文化特色和古代建筑工艺风格
文化价值：对中国优秀文化起着承前启后的作用。' WHERE name = '上阳村欧阳宗祠古戏台';
UPDATE stages SET name_en = 'Yin''s Ancestral Hall Stage in Xiantian Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县现田村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '现田村尹氏宗祠古戏台';
UPDATE stages SET name_en = 'Yin''s Ancestral Hall Stage in Meihua Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县梅花村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '梅花村尹氏宗祠古戏台';
UPDATE stages SET name_en = 'Long''s Ancestral Hall Stage in Shuangran Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县双梁村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '双染村龙氏宗祠古戏台';
UPDATE stages SET name_en = 'Zhang''s Ancestral Hall Stage in Quanjin Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县泉金村', heritage_batch = CASE WHEN heritage_batch = '' THEN '湖南省第十批省保' ELSE heritage_batch END, heritage_date = CASE WHEN heritage_date = '' THEN '2019.2.28' ELSE heritage_date END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '泉金村张氏宗祠古戏台';
UPDATE stages SET name_en = 'Ouyang Ancestral Hall Stage in Tanbian Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县坛边村', heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '' WHERE name = '坛边村欧阳宗祠古戏台';
UPDATE stages SET name_en = 'Li''s Ancestral Hall Stage in Pantang Village', province = '湖南', city = '郴州', address = '湖南省郴州市桂阳县泮塘村', ancestral_hall = CASE WHEN ancestral_hall = '' THEN '李氏宗祠' ELSE ancestral_hall END, heritage_type = CASE WHEN heritage_type = '' THEN '古建筑' ELSE heritage_type END, era = CASE WHEN era = '' THEN '清代' ELSE era END, built_year = '清代', history_text = history_text || char(10) || char(10) || '【补充史料】' || char(10) || '尺寸：台基高约1.7米，面阔4.5米，进深3.5米。左右副台高出主台面0.5米。
雕刻彩绘：左右前木柱下有一米多高的云龙雕柱相托，台沿矮石栏雕有鸟兽花草。
结构形制：前后四柱为八字形，左右副台高出主台面，并有木栏分隔，左右设置厢楼。
匾额对联：后台墙上有光绪年间戏班题写的演出戏目，以及开台大吉等墨迹' WHERE name = '泮塘村李氏宗祠古戏台';
INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('吉冲头古戏台','','雷坪镇吉冲头村','','','','李氏宗祠','','','','','清乾隆八年（1743）','明清时期建筑风格','较完整保存','未定级','尺寸：台基高2米，戏台进深9米，面阔6.2米。
雕刻彩绘：彩绘覆钵藻井；前台口横梁两端雕刻两龙头望宝珠；左右檐下精雕龙凤呈祥；四瓴前端塑膏泥龙身。
结构形制：台基为砖石筑砌；前台沿以木方围置；由8根圆木柱支撑山字梁；顶为单檐歇山式，瓦瓴置陶质钻尖顶。
风格特色：明清时期建筑风格','',NULL,NULL,0);
INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('步云村古戏台','','流峰镇步云村','','','','尹氏宗祠','','','','','','','比较完好','未定级','尺寸：北面基墙距宗祠北墙1.9米。台基高1.65米，前台面阔5.2米，进深4.3米：后台面阔8米，进深2.0米。
雕刻彩绘：石栏石雕刻花鸟和鱼草；檐口拱棚彩绘八仙飘海。台顶蓬平板彩绘龙凤，花草图腾
结构形制：单檐歇山式盖小青瓦。戏台4根木柱横排到顶，中立木质屏壁。台基砖墙上面以料石围栏，前台4根木柱成"八"字支撑顶蓬。戏台两厢吊脚木楼延伸至享堂檐下，使戏台稳固。
匾额对联：前后台屏板上部正中“穆如清风”匾额，后台砖墙上留下清朝至民国多起戏剧班，调班，昆剧团演出活动题记的墨迹','',NULL,NULL,0);
INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('车溪村古戏台','','车溪村','','','','张氏宗祠','','','','','民国时期','翘角雄伟壮观；戏台面向宗祠享堂，厢楼廊道与天井齐平。','较好','未定级','尺寸：台基高1.6米；前台面阔5.6米，进深5.2米。
雕刻彩绘：台沿前三面青石围栏，台前石栏雕二龙戏珠；隔板绘福、禄、寿三星彩图；戏台前封檐板木雕刻图案。
结构形制：台基用青砖砌墙，台面用木板制作楼面；单顶歇山式。
匾额对联：左右耳门上书“出将”“入相”。
风格特色：翘角雄伟壮观；戏台面向宗祠享堂，厢楼廊道与天井齐平。','',NULL,NULL,0);
INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('仙堂村古戏台','','敖泉船山村仙堂自然村','','','','李氏宗祠','','','','','清同治元年（1862）','','比较完整','未定级','雕刻彩绘：龙凤狮象，花草虫鱼
结构形制：台基以砖石筑砌，上部为木结构。戏台两厢各建有木质吊脚楼。
匾额对联：前檐横梁上书“观今鉴古”匾额，屏风板书“泰天尊”，后台砖柱对联“是是非非即此知人天理；真真假假其间有古往今来”，板面留存多家昆，祁，花灯班、社演出留言。','',NULL,NULL,0);
INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('船山村古戏台','','敖泉镇船山村','','','','','','','','','','','较好','未定级','','',NULL,NULL,0);
INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('官仓村古戏台','','敖泉镇湘山村官仓自然村','','','','张氏宗祠','','','','','清顺治十五年（1658）','民族传统文化底蕴深厚','除部分雕刻损毁外，其它构件保存尚好','未定级','尺寸：台基高1.7米；戏台南北进深8.4米，东西面阔6.2米。
雕刻彩绘：东西北三面彩绘各种动物图案。
结构形制：台上木结构。戏台与宗祠连为一体。
匾额对联：后台左右砖墙对联（字迹模糊不清）
风格特色：民族传统文化底蕴深厚','',NULL,NULL,0);
INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('逢塘村古戏台','','敖泉镇逢塘村下户自然村','','','','张氏宗祠','','','','','清乾隆五十七年（1792）','明清建筑风格','雕刻有损毁','未定级','尺寸：台基高1.7米，进深8.3米，面阔7.0米。
雕刻彩绘：前檐卷棚有"八仙飘海"彩绘。
结构形制：台基为砖石筑砌，戏台单檐歇山式顶，飞檐翘角。
匾额对联：台基为砖石筑砌，戏台隔墙板上书“机趣横生”匾额，后台砖墙柱上对联“天之上地之下四海九洲止足台徵变化；古以来今以往千年万载只酒戏演情形。”
风格特色：明清建筑风格','',NULL,NULL,0);
INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('屈塘村古戏台','','欧阳海镇屈塘村','','','','宋氏宗祠','','','','','清道光年间（1821–1850）','木雕工艺精湛，装饰繁复，具有典型的清代南方宗祠戏台建筑风格。','整体保存较好','未定级','尺寸：台基高2米，台面南北进深6.7米，东西面阔5.5米。
雕刻彩绘：台前檐横梁镂雕二龙戏珠，垂檐镂雕飞禽走兽；三面垂柱镂雕圆鼓，斗拱以缠枝花卉陪衬。
结构形制：台基以料石筑砌，台上部为木结构；台顶中置八角藻井；屋面单檐歇山式，飞檐翘角。
匾额对联：台前左右石柱刻有对联（字迹模糊）；后台外侧砖柱刻有对联：“何处飞阳春烟景；楚曾觅海市蜃楼”。
风格特色：木雕工艺精湛，装饰繁复，具有典型的清代南方宗祠戏台建筑风格。','',NULL,NULL,0);
INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('四友村古戏台','','泗洲乡四友村','','','','吴氏宗祠','','','','','明崇祯时期（1627–1644）','具有明清时期建筑工艺特征。','桂阳县内古戏台遗存最早的建筑工程之一，整体建筑保存完好。','未定级','尺寸：台基高2.0米；木构件面阔5.8米，进深7.0米。
雕刻彩绘：檐下两柱间横梁镂雕“二龙戏珠”；前柱和转柱间分别雕刻“丹凤朝阳”、“龙凤呈祥”。
结构形制：座西朝东；台基为料石筑砌，上为木构件；戏台左右置有吊脚楼。
匾额对联：后台壁上留有很多昆、祁、花灯戏班演出书写的墨迹。
风格特色：具有明清时期建筑工艺特征。','',NULL,NULL,0);
INSERT INTO stages (name, name_en, town, province, city, address, ancestral_hall, heritage_batch, heritage_date, heritage_type, era, built_year, style, damage, heritage_level, history_text, media_links, lng, lat, is_red_site)
  VALUES ('麻布村古戏台（B）','','流峰镇麻布村','','','','廖氏宗祠','','','','','清嘉庆十四年（1808）','工艺精致，美观大方，民族传统特色突出。','较好','未定级','尺寸：台基高1.5米，面阔4.0米，进深3.5米。
雕刻彩绘：台口檐下凤鸟图形；侧面古树丛花、龙形（与云纹、水纹结合）、荷花、麻雀；台前牵梁游龙争戏；栋脊龙凤装饰。
结构形制：砖木结构，单檐歇山式顶；台面木板制作，台基及围栏为青石条；8根圆柱支撑上架，架顶八卦斗形；飞檐翘角。
风格特色：工艺精致，美观大方，民族传统特色突出。','',NULL,NULL,0);
