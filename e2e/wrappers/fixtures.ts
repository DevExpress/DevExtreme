import { test as base } from '@playwright/test';

export type Framework = 'react19' | 'vue3' | 'angular';

export interface TestOptions {
    framework: Framework;
}

export const test = base.extend<TestOptions>({
    framework: ['react19', { option: true }],
});

export { expect } from '@playwright/test';
