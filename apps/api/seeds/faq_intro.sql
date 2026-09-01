-- 台小湘介绍语（编号 0，列表置顶）；移除旧的短版「你好呀」条目避免重复
INSERT INTO faq_entries (id, question, keywords, answer) VALUES
(0, '你好呀', '你好,您好,hello,hi,嗨,哈喽,介绍,自我介绍', '你好呀！我是台小湘 🎭
我能带你走进湘昆的世界，分享有趣的戏曲知识，也能帮你快速了解本站功能：研学预约、戏台档案馆、三维展厅等等。我还会讲述台前幕后的访谈故事，带你浏览官方推文、新闻报道，认识上海大学的红色公益项目。
挑一个你感兴趣的话题，或者随便问我，咱们边聊边逛～');

DELETE FROM faq_entries WHERE question = '你好呀' AND id <> 0;
