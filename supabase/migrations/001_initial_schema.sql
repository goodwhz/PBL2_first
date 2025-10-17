-- 创建朝代表
CREATE TABLE IF NOT EXISTS dynasties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  period VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 创建作者表
CREATE TABLE IF NOT EXISTS authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dynasty_id UUID REFERENCES dynasties(id),
  birth_year INTEGER,
  death_year INTEGER,
  biography TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 创建诗歌表
CREATE TABLE IF NOT EXISTS poems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author_id UUID REFERENCES authors(id),
  dynasty_id UUID REFERENCES dynasties(id),
  content TEXT NOT NULL,
  background TEXT,
  analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 创建诗歌标签关联表
CREATE TABLE IF NOT EXISTS poem_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(poem_id, tag_id)
);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_poems_author_id ON poems(author_id);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty_id ON poems(dynasty_id);
CREATE INDEX IF NOT EXISTS idx_poems_title ON poems(title);
CREATE INDEX IF NOT EXISTS idx_authors_dynasty_id ON authors(dynasty_id);
CREATE INDEX IF NOT EXISTS idx_poem_tags_poem_id ON poem_tags(poem_id);
CREATE INDEX IF NOT EXISTS idx_poem_tags_tag_id ON poem_tags(tag_id);

-- 启用行级安全策略
ALTER TABLE dynasties ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_tags ENABLE ROW LEVEL SECURITY;

-- 创建允许匿名读取的策略（公开数据）
CREATE POLICY "允许匿名读取朝代" ON dynasties FOR SELECT USING (true);
CREATE POLICY "允许匿名读取作者" ON authors FOR SELECT USING (true);
CREATE POLICY "允许匿名读取标签" ON tags FOR SELECT USING (true);
CREATE POLICY "允许匿名读取诗歌" ON poems FOR SELECT USING (true);
CREATE POLICY "允许匿名读取诗歌标签" ON poem_tags FOR SELECT USING (true);

-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要更新时间的表创建触发器
CREATE TRIGGER update_dynasties_updated_at BEFORE UPDATE ON dynasties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入初始数据
INSERT INTO dynasties (name, period, description) VALUES 
('唐', '618-907', '唐朝是中国历史上最强盛的时期之一，诗歌创作达到巅峰'),
('宋', '960-1279', '宋代诗词并重，词的发展达到高峰'),
('元', '1271-1368', '元代戏曲繁荣，诗歌风格多样'),
('明', '1368-1644', '明代诗歌继承传统，又有创新'),
('清', '1644-1912', '清代诗歌题材广泛，风格各异')
ON CONFLICT (name) DO NOTHING;

INSERT INTO tags (name, description) VALUES 
('思乡', '表达对故乡的思念之情'),
('爱情', '描写爱情和情感的诗歌'),
('自然', '描绘自然风光和景物的诗歌'),
('哲理', '蕴含人生哲理和智慧的诗歌'),
('边塞', '描写边塞生活和战争的诗歌'),
('田园', '描绘田园生活和乡村风光的诗歌')
ON CONFLICT (name) DO NOTHING;