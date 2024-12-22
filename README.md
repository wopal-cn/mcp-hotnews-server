# HotNews MCP Server

A Model Context Protocol (MCP) server that provides real-time hot trending topics from major Chinese social platforms and news sites.

## Features

- Real-time hot topics from 9 major Chinese platforms
- MCP protocol compatible
- Easy integration with AI models
- Markdown formatted output with clickable links
- Heat index support (where available)

## Supported Platforms

1. Zhihu Hot List (知乎热榜)
2. 36Kr Hot List (36氪热榜)
3. Baidu Hot Discussion (百度热点)
4. Bilibili Hot List (B站热榜)
5. Weibo Hot Search (微博热搜)
6. Douyin Hot List (抖音热点)
7. Hupu Hot List (虎扑热榜)
8. Douban Hot List (豆瓣热榜)
9. IT News (IT新闻)

> API Source, This project uses the `api.vvhan.com` service for fetching hot topics data.

## Available Tools
- `get_hot_news`
  - `sources` - Required arguments: Platform ID list
- Example usage:
  - `get_hot_news([3])` : Get Baidu Hot Discussion only
  - `get_hot_news([1,3,7])` : Get hot lists from zhihuHot, Baidu, and huPu
  - `get_hot_news([1,2,3,4])` : Get hot lists from zhihuHot, 36Kr, Baidu, and Bilibili`

## Installation

### NPX

```json
{
  "mcpServers": {
    "mcp-server-hotnews": {
      "command": "npx",
      "args": [
        "-y",
        "@wopal/mcp-server-hotnews"
      ]
    }
  }
}
```

### Docker 
（ Docker image not uploaded to Docker Hub, need to build it yourself. ）

```json
{
  "mcpServers": {
    "mcp-server-hotnews": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "wopal/mcp-server-hotnews"
      ]
    }
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Watch mode
npm run watch

# Build
npm run build

# Test URLs
npm run test:urls
```

Docker build:

```bash
docker build -t wopal/mcp-server-hotnews:latest -f Dockerfile .
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
