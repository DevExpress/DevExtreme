/* eslint-disable */
import { createServer, type ViteDevServer } from 'vite';
import { chromium, type Browser, type Page } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';

interface TestResult {
  name: string;
  module: string;
  failed: number;
  passed: number;
  total: number;
  runtime: number;
  source?: string;
  assertions: {
    result: boolean;
    message: string;
    expected?: unknown;
    actual?: unknown;
  }[];
}

interface SuiteResult {
  category: string;
  file: string;
  tests: TestResult[];
  totalPassed: number;
  totalFailed: number;
  totalTests: number;
  runtime: number;
  error?: string;
}

function parseArgs(): {
  filter?: string;
  constellation?: string;
  file?: string;
  timeout: number;
  headed: boolean;
} {
  const args = process.argv.slice(2);
  const parsed: ReturnType<typeof parseArgs> = { timeout: 60000, headed: false };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--filter':
        parsed.filter = args[++i];
        break;
      case '--constellation':
        parsed.constellation = args[++i];
        break;
      case '--file':
        parsed.file = args[++i];
        break;
      case '--timeout':
        parsed.timeout = parseInt(args[++i], 10);
        break;
      case '--headed':
        parsed.headed = true;
        break;
    }
  }

  return parsed;
}

interface TestSuiteInfo {
  category: string;
  file: string;
  constellation: string;
}

function discoverTests(testsDir: string): TestSuiteInfo[] {
  const suites: TestSuiteInfo[] = [];
  const categories = fs.readdirSync(testsDir).filter((d) => {
    const fullPath = path.join(testsDir, d);
    return fs.statSync(fullPath).isDirectory() && d.startsWith('DevExpress.');
  });

  for (const category of categories) {
    const catDir = path.join(testsDir, category);
    const metaPath = path.join(catDir, '__meta.json');
    let constellation = 'misc';

    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        if (meta.constellation) {
          constellation = String(meta.constellation);
        }
      } catch {}
    }

    const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.tests.js'));
    for (const file of files) {
      suites.push({ category, file, constellation });
    }

    const subDirs = fs.readdirSync(catDir).filter((d) => {
      const subPath = path.join(catDir, d);
      return fs.statSync(subPath).isDirectory() && !d.startsWith('__');
    });

    for (const subDir of subDirs) {
      const subFiles = fs.readdirSync(path.join(catDir, subDir)).filter((f) => f.endsWith('.tests.js'));
      for (const file of subFiles) {
        suites.push({ category, file: `${subDir}/${file}`, constellation });
      }
    }
  }

  return suites;
}

async function runTestSuite(
  page: Page,
  baseUrl: string,
  suite: TestSuiteInfo,
  timeout: number,
): Promise<SuiteResult> {
  const url = `${baseUrl}/qunit/${suite.category}/${suite.file}`;
  const result: SuiteResult = {
    category: suite.category,
    file: suite.file,
    tests: [],
    totalPassed: 0,
    totalFailed: 0,
    totalTests: 0,
    runtime: 0,
  };

  let resolveDone: () => void;
  const donePromise = new Promise<void>((resolve) => { resolveDone = resolve; });

  await page.exposeFunction('__qunitTestDone', (details: TestResult) => {
    result.tests.push(details);
  });

  await page.exposeFunction('__qunitDone', (details: { failed: number; passed: number; total: number; runtime: number }) => {
    result.totalPassed = details.passed;
    result.totalFailed = details.failed;
    result.totalTests = details.total;
    result.runtime = details.runtime;
    resolveDone();
  });

  await page.addInitScript(() => {
    (window as any).__qunitRunnerMode = true;
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!result.error) {
        result.error = text.substring(0, 500);
      }
    }
  });

  page.on('pageerror', (err) => {
    if (!result.error) {
      result.error = `Page error: ${err.message.substring(0, 500)}`;
    }
  });

  try {
    page.on('response', (response) => {
      if (response.status() >= 400) {
        const failUrl = response.url();
        if (!result.error) {
          result.error = `HTTP ${response.status()}: ${failUrl.substring(failUrl.lastIndexOf('/') + 1)}`;
        }
        console.log(`         \x1b[33m${response.status()} ${failUrl}\x1b[0m`);
      }
    });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout });

    const waitStart = Date.now();
    while (Date.now() - waitStart < timeout) {
      try {
        await page.waitForFunction(
          () => typeof QUnit !== 'undefined' && (window as any).__testModuleLoaded === true,
          { timeout: Math.max(timeout - (Date.now() - waitStart), 1000), polling: 200 },
        );
        break;
      } catch (e: any) {
        if (e.message?.includes('navigat') || e.message?.includes('context')) {
          continue;
        }
        throw e;
      }
    }

    const loadError = await page.evaluate(() => (window as any).__testLoadError);
    if (loadError) {
      result.error = `Module load error: ${loadError}`;
      result.totalFailed = 1;
      result.totalTests = 1;
      return result;
    }

    await page.evaluate(() => {
      const win = window as any;
      QUnit.testDone((details: any) => {
        win.__qunitTestDone({
          name: details.name,
          module: details.module,
          failed: details.failed,
          passed: details.passed,
          total: details.total,
          runtime: details.runtime,
          assertions: (details.assertions || []).map((a: any) => ({
            result: a.result,
            message: a.message,
            expected: String(a.expected),
            actual: String(a.actual),
          })),
        });
      });

      QUnit.done((details: any) => {
        win.__qunitDone({
          failed: details.failed,
          passed: details.passed,
          total: details.total,
          runtime: details.runtime,
        });
      });

      QUnit.start();
    });

    await Promise.race([
      donePromise,
      new Promise<void>((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)),
    ]);
  } catch (err: any) {
    result.error = err.message;
    if (result.totalTests === 0) {
      result.totalFailed = 1;
      result.totalTests = 1;
    }
  }

  return result;
}

function printResult(result: SuiteResult): void {
  const status = result.totalFailed > 0 || result.error ? '\x1b[31mFAIL\x1b[0m' : '\x1b[32mPASS\x1b[0m';
  const time = (result.runtime / 1000).toFixed(1);
  const testInfo = result.totalFailed > 0
    ? `${result.totalFailed} failed / ${result.totalTests} total`
    : `${result.totalTests} tests`;

  console.log(`  ${status}  ${result.category}/${result.file} (${testInfo}, ${time}s)`);

  if (result.error && result.totalTests <= 1) {
    console.log(`         \x1b[31mError: ${result.error}\x1b[0m`);
  }

  for (const test of result.tests) {
    if (test.failed > 0) {
      console.log(`         \x1b[31m✗ ${test.module} > ${test.name}\x1b[0m`);
      for (const assertion of test.assertions) {
        if (!assertion.result) {
          console.log(`           ${assertion.message}`);
          if (assertion.expected !== undefined) {
            console.log(`           Expected: ${assertion.expected}`);
            console.log(`           Actual:   ${assertion.actual}`);
          }
        }
      }
    }
  }
}

function printSummary(results: SuiteResult[], totalTime: number): void {
  const passed = results.filter((r) => r.totalFailed === 0 && !r.error).length;
  const failed = results.filter((r) => r.totalFailed > 0 || !!r.error).length;
  const totalTests = results.reduce((sum, r) => sum + r.totalTests, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.totalFailed, 0);
  const totalPassed = results.reduce((sum, r) => sum + r.totalPassed, 0);

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`\nSuites:  ${failed > 0 ? `\x1b[31m${failed} failed\x1b[0m, ` : ''}${passed} passed, ${results.length} total`);
  console.log(`Tests:   ${totalFailed > 0 ? `\x1b[31m${totalFailed} failed\x1b[0m, ` : ''}${totalPassed} passed, ${totalTests} total`);
  console.log(`Time:    ${(totalTime / 1000).toFixed(1)}s`);
  console.log('');
}

async function main(): Promise<void> {
  const args = parseArgs();
  const packageRoot = path.resolve(__dirname, '..');

  console.log('\nStarting Vite dev server...');

  const server: ViteDevServer = await createServer({
    configFile: path.resolve(packageRoot, 'vite-qunit.config.ts'),
    server: { port: 0 },
  });
  await server.listen();

  const address = server.httpServer?.address();
  const port = typeof address === 'object' && address ? address.port : 3939;
  const baseUrl = `http://localhost:${port}`;

  console.log(`Vite server running at ${baseUrl}`);

  const testsDir = path.join(packageRoot, 'testing/tests');
  let suites = discoverTests(testsDir);

  if (args.file) {
    const parts = args.file.split('/');
    if (parts.length >= 2) {
      const category = parts[0];
      const file = parts.slice(1).join('/');
      suites = suites.filter((s) => s.category === category && s.file === file);
    } else {
      suites = suites.filter((s) => s.file.includes(args.file!));
    }
  } else if (args.constellation) {
    suites = suites.filter((s) => s.constellation === args.constellation);
  } else if (args.filter) {
    const pattern = args.filter.toLowerCase();
    suites = suites.filter((s) => s.category.toLowerCase().includes(pattern) || s.file.toLowerCase().includes(pattern));
  }

  if (suites.length === 0) {
    console.log('\nNo test suites found matching the criteria.');
    await server.close();
    process.exit(1);
  }

  console.log(`\nRunning ${suites.length} test suite(s)...\n`);

  const browser: Browser = await chromium.launch({
    headless: !args.headed,
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  });

  const results: SuiteResult[] = [];
  const startTime = Date.now();

  for (const suite of suites) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const result = await runTestSuite(page, baseUrl, suite, args.timeout);
    results.push(result);
    printResult(result);
    await context.close();
  }

  const totalTime = Date.now() - startTime;
  printSummary(results, totalTime);

  await browser.close();
  await server.close();

  const hasFailures = results.some((r) => r.totalFailed > 0 || !!r.error);
  process.exit(hasFailures ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
