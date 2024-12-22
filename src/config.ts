export const BASE_API_URL = "https://api.vvhan.com/api/hotlist";

export interface HotNewsSource {
  name: string;
  description: string;
}

export const HOT_NEWS_SOURCES: Record<number, HotNewsSource> = {
  1: { name: "zhihuHot", description: "Zhihu Hot List (知乎热榜)" },
  2: { name: "36Ke", description: "36Kr Hot List (36氪热榜)" },
  3: { name: "baiduRD", description: "Baidu Hot Discussion (百度热点)" },
  4: { name: "bili", description: "Bilibili Hot List (B站热榜)" },
  5: { name: "wbHot", description: "Weibo Hot Search (微博热搜)" },
  6: { name: "douyinHot", description: "Douyin Hot List (抖音热点)" },
  7: { name: "huPu", description: "Hupu Hot List (虎扑热榜)" },
  8: { name: "douban", description: "Douban Hot List (豆瓣热榜)" },
  9: { name: "itNews", description: "IT News (IT新闻)" },
};

// 新增生成描述的函数
export function generateSourcesDescription(): string {
  const sourcesList = Object.entries(HOT_NEWS_SOURCES)
    .map(([id, source]) => `{ID: ${id}, Platform: "${source.description}"}`)
    .join(",\n");

  return `Available HotNews sources (ID: Platform):\n
${sourcesList}\n
Example usage:
- [3]: Get Baidu Hot Discussion only
- [1,3,7]: Get hot lists from zhihuHot, Baidu, and huPu
- [1,2,3,4]: Get hot lists from zhihuHot, 36Kr, Baidu, and Bilibili`;
}

// 新增获取最大源 ID 的函数
export function getMaxSourceId(): number {
  return Math.max(...Object.keys(HOT_NEWS_SOURCES).map(Number));
}
