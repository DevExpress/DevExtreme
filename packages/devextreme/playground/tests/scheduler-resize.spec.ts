import { test, expect } from '@playwright/test';

test.describe('Scheduler appointment resize', () => {
    test.beforeEach(async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (err) => errors.push(err.message));

        await page.goto('/demos/Scheduler/Editing/');
        await page.waitForSelector('.dx-scheduler-appointment', { timeout: 10000 });
    });

    test('appointments render with correct geometry', async ({ page }) => {
        const appointments = page.locator('.dx-scheduler-appointment');

        const count = await appointments.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < Math.min(count, 5); i++) {
            const box = await appointments.nth(i).boundingBox();
            expect(box).not.toBeNull();
            expect(box!.width).toBeGreaterThan(0);
            expect(box!.height).toBeGreaterThan(0);
        }
    });

    test('appointment has resize handles', async ({ page }) => {
        const appointment = page.locator('.dx-scheduler-appointment').first();
        await appointment.hover();

        const topHandle = appointment.locator('.dx-resizable-handle-top');
        const bottomHandle = appointment.locator('.dx-resizable-handle-bottom');

        await expect(topHandle).toBeVisible();
        await expect(bottomHandle).toBeVisible();
    });

    test('resize appointment by dragging bottom handle changes height', async ({ page }) => {
        const appointment = page.locator('.dx-scheduler-appointment').first();
        await appointment.hover();

        const boxBefore = await appointment.boundingBox();
        expect(boxBefore).not.toBeNull();

        const bottomHandle = appointment.locator('.dx-resizable-handle-bottom');
        const handleBox = await bottomHandle.boundingBox();
        expect(handleBox).not.toBeNull();

        const cellHeight = await page.locator('.dx-scheduler-date-table-cell').first().evaluate(
            (el) => el.getBoundingClientRect().height,
        );

        await bottomHandle.hover();
        await page.mouse.down();
        await page.mouse.move(
            handleBox!.x + handleBox!.width / 2,
            handleBox!.y + cellHeight,
            { steps: 5 },
        );
        await page.mouse.up();

        const boxAfter = await appointment.boundingBox();
        expect(boxAfter).not.toBeNull();
        expect(boxAfter!.height).toBeGreaterThan(boxBefore!.height);
    });

    test('resize snaps to cell boundaries', async ({ page }) => {
        const appointment = page.locator('.dx-scheduler-appointment').first();
        await appointment.hover();

        const cellHeight = await page.locator('.dx-scheduler-date-table-cell').first().evaluate(
            (el) => el.getBoundingClientRect().height,
        );

        const bottomHandle = appointment.locator('.dx-resizable-handle-bottom');
        const handleBox = await bottomHandle.boundingBox();
        expect(handleBox).not.toBeNull();

        await bottomHandle.hover();
        await page.mouse.down();
        await page.mouse.move(
            handleBox!.x + handleBox!.width / 2,
            handleBox!.y + cellHeight * 2,
            { steps: 5 },
        );
        await page.mouse.up();

        const boxAfter = await appointment.boundingBox();
        expect(boxAfter).not.toBeNull();
        const heightRatio = boxAfter!.height / cellHeight;
        expect(Math.abs(heightRatio - Math.round(heightRatio))).toBeLessThan(0.15);
    });

    test('appointment position aligns with cell grid after resize', async ({ page }) => {
        const appointment = page.locator('.dx-scheduler-appointment').first();
        await appointment.hover();

        const boxBefore = await appointment.boundingBox();
        expect(boxBefore).not.toBeNull();

        const cells = page.locator('.dx-scheduler-date-table-cell');
        const firstCellBox = await cells.first().boundingBox();
        expect(firstCellBox).not.toBeNull();

        expect(boxBefore!.left).toBeGreaterThanOrEqual(firstCellBox!.left - 1);

        const bottomHandle = appointment.locator('.dx-resizable-handle-bottom');
        const handleBox = await bottomHandle.boundingBox();

        const cellHeight = firstCellBox!.height;
        await bottomHandle.hover();
        await page.mouse.down();
        await page.mouse.move(
            handleBox!.x + handleBox!.width / 2,
            handleBox!.y + cellHeight,
            { steps: 5 },
        );
        await page.mouse.up();

        const boxAfter = await appointment.boundingBox();
        expect(boxAfter).not.toBeNull();
        expect(boxAfter!.left).toBeCloseTo(boxBefore!.left, 0);
    });

    test('container resize triggers appointment repositioning', async ({ page }) => {
        const appointment = page.locator('.dx-scheduler-appointment').first();
        const boxBefore = await appointment.boundingBox();
        expect(boxBefore).not.toBeNull();

        await page.setViewportSize({ width: 800, height: 600 });
        await page.waitForTimeout(500);

        const boxAfter = await appointment.boundingBox();
        expect(boxAfter).not.toBeNull();
        expect(boxAfter!.width).not.toBe(boxBefore!.width);
        expect(boxAfter!.height).toBeGreaterThan(0);
        expect(boxAfter!.width).toBeGreaterThan(0);
    });

    test('drag appointment to different cell updates position', async ({ page }) => {
        const appointment = page.locator('.dx-scheduler-appointment').first();
        const boxBefore = await appointment.boundingBox();
        expect(boxBefore).not.toBeNull();

        const cellHeight = await page.locator('.dx-scheduler-date-table-cell').first().evaluate(
            (el) => el.getBoundingClientRect().height,
        );

        await appointment.hover();
        await page.mouse.down();
        await page.mouse.move(
            boxBefore!.x + boxBefore!.width / 2,
            boxBefore!.y + cellHeight * 2,
            { steps: 10 },
        );
        await page.mouse.up();

        await page.waitForTimeout(300);

        const boxAfter = await appointment.boundingBox();
        expect(boxAfter).not.toBeNull();
        expect(Math.abs(boxAfter!.y - boxBefore!.y)).toBeGreaterThan(cellHeight * 0.5);
    });
});
