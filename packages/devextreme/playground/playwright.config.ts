import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'http://localhost:3000',
    },
    webServer: {
        command: 'pnpm run dev:playground',
        port: 3000,
        reuseExistingServer: true,
    },
});
