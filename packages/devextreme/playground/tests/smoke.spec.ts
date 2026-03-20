import { test, expect } from '@playwright/test';
import { widgetIds } from '../widget-ids';

for (const widgetId of widgetIds) {
    test(`${widgetId} renders without console errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
        page.on('pageerror', (err) => errors.push(err.message));

        await page.goto(`/#${widgetId}`);
        await page.waitForTimeout(800);

        expect(errors, `Console errors for ${widgetId}: ${errors.join('\n')}`).toHaveLength(0);
    });
}
