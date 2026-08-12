import { defineConfig } from '@playwright/test';

import type { Framework, TestOptions } from './fixtures';

const FRAMEWORK_PORTS: Record<Framework, number> = {
    react19: 3030,
    angular: 3031,
    vue3: 3032,
};

const framework = (process.env.FRAMEWORK ?? 'react19') as Framework;
const port = FRAMEWORK_PORTS[framework];

if(!port) {
    throw new Error(`Unsupported framework: ${framework}. Expected one of: ${Object.keys(FRAMEWORK_PORTS).join(', ')}.`);
}

const baseURL = `http://localhost:${port}`;

export default defineConfig<TestOptions>({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    workers: 1,
    reporter: process.env.CI
        ? [['list'], ['html', { open: 'never' }]]
        : [['list']],
    timeout: 30000,
    expect: { timeout: 5000 },
    use: {
        framework,
        baseURL,
        channel: 'chrome',
        headless: true,
        viewport: { width: 1200, height: 800 },
        launchOptions: { args: ['--no-sandbox', '--disable-gpu'] },
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    webServer: {
        command: `node ./serve.js --framework=${framework} --port=${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30000,
    },
});
