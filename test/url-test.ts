import axios, { AxiosError } from "axios";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { BASE_API_URL, HOT_NEWS_SOURCES } from "../src/config.js";

interface TestResult {
  sourceName: string;
  apiEndpoint: string;
  timestamp: string;
  status: "success" | "fail";
  responseData?: any;
  error?: string;
}

async function testEndpoint(source: {
  name: string;
  description: string;
}): Promise<TestResult> {
  try {
    const response = await axios.get(`${BASE_API_URL}/${source.name}`, {
      timeout: 10000,
      validateStatus: null,
    });

    return {
      sourceName: source.description,
      apiEndpoint: `${BASE_API_URL}/${source.name}`,
      timestamp: new Date().toISOString(),
      status: response.data.success ? "success" : "fail",
      responseData: response.data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      sourceName: source.description,
      apiEndpoint: `${BASE_API_URL}/${source.name}`,
      timestamp: new Date().toISOString(),
      status: "fail",
      error: errorMessage,
    };
  }
}

async function runTests() {
  const results: TestResult[] = [];

  for (const [id, source] of Object.entries(HOT_NEWS_SOURCES)) {
    console.log(`Testing ${source.description}...`);
    const result = await testEndpoint(source);
    results.push(result);
  }

  // 获取当前文件的目录路径
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // 确保results目录存在
  const resultsDir = join(__dirname, "results");
  if (!existsSync(resultsDir)) {
    mkdirSync(resultsDir, { recursive: true });
  }

  // 写入测试结果
  const resultsPath = join(resultsDir, "api-test-results.json");
  writeFileSync(resultsPath, JSON.stringify(results, null, 2), "utf-8");

  // 输出统计信息
  const summary = {
    total: results.length,
    success: results.filter((r) => r.status === "success").length,
    fail: results.filter((r) => r.status === "fail").length,
  };

  console.log("\nTest Summary:");
  console.log(summary);

  // 输出失败的测试详情
  const failedTests = results.filter((r) => r.status === "fail");
  if (failedTests.length > 0) {
    console.log("\nFailed Tests Details:");
    failedTests.forEach((test) => {
      console.log(`\n${test.sourceName}:`);
      console.log(`Endpoint: ${test.apiEndpoint}`);
      console.log(`Error: ${test.error || "Unknown error"}`);
    });
  }
}

// 运行测试
runTests().catch((error) => {
  console.error("Test execution failed:", error);
  process.exit(1);
});
