#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

import {
  BASE_API_URL,
  HOT_NEWS_SOURCES,
  generateSourcesDescription,
  getMaxSourceId,
} from "./config.js";

// Define interfaces for type safety
interface HotNewsSource {
  name: string;
  description: string;
}

interface HotNewsItem {
  index: number;
  title: string;
  url: string;
  hot?: string | number;
}

interface HotNewsResponse {
  success: boolean;
  message?: string;
  name: string;
  subtitle: string;
  update_time: string;
  data: HotNewsItem[];
}

class HotNewsServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "mcp-server/hotnewslist",
        version: "0.1.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      },
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_hot_news",
          description: "Get hot trending lists from various platforms",
          inputSchema: {
            type: "object",
            properties: {
              sources: {
                type: "array",
                description: generateSourcesDescription(),
                items: {
                  type: "number",
                  minimum: 1,
                  maximum: getMaxSourceId(),
                },
              },
            },
            required: ["sources"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== "get_hot_news") {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`,
        );
      }

      try {
        const sources = request.params.arguments?.sources as number[];
        if (!Array.isArray(sources) || sources.length === 0) {
          throw new Error("Please provide valid source IDs");
        }

        // Fetch multiple hot lists
        const results = await Promise.all(
          sources.map(async (sourceId) => {
            const source = HOT_NEWS_SOURCES[sourceId];
            if (!source) {
              return `Source ID ${sourceId} does not exist`;
            }

            try {
              const response = await axios.get<HotNewsResponse>(
                `${BASE_API_URL}/${source.name}`,
              );
              const news = response.data;

              if (!news.success) {
                return `Failed to fetch ${source.description}: ${news.message}`;
              }

              const newsList = news.data.map(
                (item: HotNewsItem) =>
                  `${item.index}. [${item.title}](${item.url}) ${
                    item.hot ? `<small>Heat: ${item.hot}</small>` : ""
                  }`,
              );

              return `
### ${news.name}:${news.subtitle}
> Last updated: ${news.update_time}
${newsList.join("\n")}
`;
            } catch (error) {
              return `Failed to fetch ${source.description}: ${
                axios.isAxiosError(error)
                  ? (error.response?.data.message ?? error.message)
                  : "Unknown error"
              }`;
            }
          }),
        );

        return {
          content: [
            {
              type: "text",
              text: results.join("\n\n"),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text",
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Hot news MCP server running on stdio");
  }
}

const server = new HotNewsServer();
server.run().catch(console.error);
