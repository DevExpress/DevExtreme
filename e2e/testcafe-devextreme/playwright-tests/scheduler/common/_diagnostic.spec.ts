import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, adjustViewportForContent } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

async function logDims(page: any, label: string): Promise<void> {
  const dims = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyClientWidth: document.body.clientWidth,
    containerWidth: document.getElementById('container')?.offsetWidth,
    scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
    bodyMarginL: parseInt(getComputedStyle(document.body).marginLeft),
    bodyMarginR: parseInt(getComputedStyle(document.body).marginRight),
    bodyScrollHeight: document.body.scrollHeight,
    windowHeight: window.innerHeight,
    hasVerticalScroll: document.body.scrollHeight > window.innerHeight,
    htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
    workspaceWidth: document.querySelector('.dx-scheduler-work-space')?.getBoundingClientRect().width ?? 'N/A',
    workspaceOffsetWidth: (document.querySelector('.dx-scheduler-work-space') as HTMLElement)?.offsetWidth ?? 'N/A',
  }));
  const viewport = page.viewportSize();
  console.log(`[${label}] viewport: ${viewport?.width}x${viewport?.height}`);
  console.log(`[${label}] dims:`, JSON.stringify(dims));
}

test.describe('DIAGNOSTIC: viewport and screenshot dimensions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('log dimensions at each stage', async ({ page }) => {
    console.log('=== STAGE 1: After page load, before widget ===');
    await logDims(page, 'STAGE1-before-widget');

    console.log('=== STAGE 2: After adjustViewport (before widget) ===');
    await adjustViewportForContent(page);
    await logDims(page, 'STAGE2-after-adjust-before-widget');

    console.log('=== STAGE 3: After widget creation ===');
    await createWidget(page, 'dxScheduler', {
      views: [{ type: 'week', name: 'Horizontal Grouping', groupOrientation: 'horizontal', cellDuration: 30, intervalCount: 2 }],
      currentView: 'Horizontal Grouping', crossScrollingEnabled: true, currentDate: new Date(2021, 3, 21),
      groups: ['priorityId'],
      resources: [{ fieldExpr: 'priorityId', allowMultiple: false, dataSource: [{ text: 'Low Priority', id: 1, color: '#1e90ff' }, { text: 'High Priority', id: 2, color: '#ff9747' }], label: 'Priority' }],
      height: 600,
    });
    await logDims(page, 'STAGE3-after-widget');

    console.log('=== STAGE 4: After adjustViewport (after widget) ===');
    await adjustViewportForContent(page);
    await logDims(page, 'STAGE4-after-adjust-after-widget');

    console.log('=== STAGE 5: After resize event + double rAF ===');
    await page.evaluate(() => new Promise<void>((resolve) => {
      window.dispatchEvent(new Event('resize'));
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    }));
    await logDims(page, 'STAGE5-after-resize');

    console.log('=== STAGE 6: After 500ms wait ===');
    await page.waitForTimeout(500);
    await logDims(page, 'STAGE6-after-wait');

    // Now try the screenshot — should show expected vs received
    await testScreenshot(page, 'cross-scrolling-sync.png', { element: page.locator('.dx-scheduler-work-space') });
  });
});
