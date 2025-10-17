-- 插入示例数据到Supabase数据库
-- 在创建表结构后执行此脚本

-- 插入示例作者数据
INSERT INTO authors (name, dynasty_id, birth_year, death_year, biography) VALUES
('李白', (SELECT id FROM dynasties WHERE name = '唐'), 701, 762, '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。'),
('杜甫', (SELECT id FROM dynasties WHERE name = '唐'), 712, 770, '唐代伟大的现实主义诗人，被后人誉为"诗圣"。'),
('王维', (SELECT id FROM dynasties WHERE name = '唐'), 701, 761, '唐代著名诗人、画家，被誉为"诗佛"。'),
('白居易', (SELECT id FROM dynasties WHERE name = '唐'), 772, 846, '唐代伟大的现实主义诗人，新乐府运动的倡导者。'),
('苏轼', (SELECT id FROM dynasties WHERE name = '宋'), 1037, 1101, '北宋文学家、书画家，豪放派词人的代表。')
ON CONFLICT DO NOTHING;

-- 插入示例诗歌数据
INSERT INTO poems (title, author_id, dynasty_id, content, background, analysis) VALUES
('静夜思', 
 (SELECT id FROM authors WHERE name = '李白'),
 (SELECT id FROM dynasties WHERE name = '唐'),
 '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
 '这首诗写于开元十四年（726年）九月十五日的扬州旅舍，时李白26岁。',
 '通过明月意象，表达了游子思乡之情，语言清新朴素，韵味含蓄无穷。'),

('春晓',
 (SELECT id FROM authors WHERE name = '孟浩然'),
 (SELECT id FROM dynasties WHERE name = '唐'), 
 '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
 '这首诗是诗人隐居在鹿门山时所作，意境十分优美。',
 '语言平易浅近，自然天成，言浅意浓，景真情真。'),

('登鹳雀楼',
 (SELECT id FROM authors WHERE name = '王之涣'),
 (SELECT id FROM dynasties WHERE name = '唐'),
 '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
 '此诗不仅刻画了祖国的壮丽山河，而且蕴含着登高才能望远的哲理。',
 '画面宽广辽远，气势雄浑豪放，哲理与景物水乳交融。'),

('相思',
 (SELECT id FROM authors WHERE name = '王维'), 
 (SELECT id FROM dynasties WHERE name = '唐'),
 '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
 '这是借咏物而寄相思的诗，是眷怀友人之作。',
 '语言朴素无华，韵律和谐柔美，感情真挚，委婉含蓄。'),

('水调歌头',
 (SELECT id FROM authors WHERE name = '苏轼'),
 (SELECT id FROM dynasties WHERE name = '宋'),
 '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。',
 '这首词是中秋望月怀人之作，表达了对胞弟苏辙的无限怀念。',
 '意境豪放阔大，情怀乐观旷达，对明月的向往之情，对人间的眷恋之意。')
ON CONFLICT DO NOTHING;

-- 为诗歌添加标签关联
INSERT INTO poem_tags (poem_id, tag_id) VALUES
((SELECT id FROM poems WHERE title = '静夜思'), (SELECT id FROM tags WHERE name = '思乡')),
((SELECT id FROM poems WHERE title = '静夜思'), (SELECT id FROM tags WHERE name = '自然')),
((SELECT id FROM poems WHERE title = '春晓'), (SELECT id FROM tags WHERE name = '自然')),
((SELECT id FROM poems WHERE title = '春晓'), (SELECT id FROM tags WHERE name = '春天')),
((SELECT id FROM poems WHERE title = '登鹳雀楼'), (SELECT id FROM tags WHERE name = '哲理')),
((SELECT id FROM poems WHERE title = '登鹳雀楼'), (SELECT id FROM tags WHERE name = '自然')),
((SELECT id FROM poems WHERE title = '相思'), (SELECT id FROM tags WHERE name = '爱情')),
((SELECT id FROM poems WHERE title = '相思'), (SELECT id FROM tags WHERE name = '思念')),
((SELECT id FROM poems WHERE title = '水调歌头'), (SELECT id FROM tags WHERE name = '哲理')),
((SELECT id FROM poems WHERE title = '水调歌头'), (SELECT id FROM tags WHERE name = '自然'))
ON CONFLICT DO NOTHING;

-- 验证数据插入
SELECT 
  p.title as "诗歌标题",
  a.name as "作者", 
  d.name as "朝代",
  string_agg(t.name, ', ') as "标签"
FROM poems p
LEFT JOIN authors a ON p.author_id = a.id
LEFT JOIN dynasties d ON p.dynasty_id = d.id
LEFT JOIN poem_tags pt ON p.id = pt.poem_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.title, a.name, d.name
ORDER BY d.name, a.name;