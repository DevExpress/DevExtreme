import { type Locator, type Page, expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const artifactsCandidates = [
  path.resolve(__dirname, '..', '..', 'packages', 'devextreme', 'artifacts'),
  path.resolve(__dirname, '..', '..', 'artifacts'),
];
const ARTIFACTS_DIR = artifactsCandidates.find((candidate) => fs.existsSync(candidate))
  ?? artifactsCandidates[0];
const css = (...segments: string[]) => path.join(ARTIFACTS_DIR, 'css', ...segments);
const js = (...segments: string[]) => path.join(ARTIFACTS_DIR, 'js', ...segments);
const TEST_PAGE_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>DataGrid repaintChangesOnly regression</title>
    <style>
      body { font-family: sans-serif; padding: 20px; }
      #grid { width: 600px; }
    </style>
  </head>
  <body>
    <div id="grid"></div>
  </body>
</html>`;

const nameEditor = (page: Page, rowIndex: number) => page.locator('.dx-data-row').nth(rowIndex).locator('.dx-texteditor-input').first();
const articleCell = (page: Page, rowIndex: number) => page.locator('.dx-data-row').nth(rowIndex).locator('td').nth(1);
const validationOverlay = (page: Page) => page.locator([
  '.dx-overlay-wrapper.dx-invalid-message',
  '.dx-overlay-wrapper .dx-invalid-message',
  '.dx-invalid-message',
  '.dx-overlay-wrapper .dx-revert-tooltip',
  '.dx-overlay-content .dx-revert-tooltip',
  '.dx-revert-tooltip',
].join(', ')).filter({ hasText: /Required field/i });

async function findCancelButton(page: Page, overlay?: Locator | null) {
  const overlayScoped = overlay
    ? [
        overlay.locator('[aria-label="Cancel changes"]'),
        overlay.locator('[title="Cancel changes"]'),
        overlay.locator('.dx-link-cancel'),
        overlay.locator('.dx-revert-button'),
        overlay.locator('.dx-link').filter({ hasText: /cancel changes/i }),
        overlay.locator('.dx-link').filter({ hasText: /discard/i }),
        overlay.locator('.dx-link').filter({ hasText: /revert/i }),
        overlay.locator('button').filter({ hasText: /cancel changes/i }),
        overlay.locator('button').filter({ hasText: /revert/i }),
      ]
    : [];

  const pageScoped = [
    page.getByRole('button', { name: /Press Escape to discard the changes/i }),
    page.locator('[aria-label="Cancel changes"]'),
    page.locator('[title="Cancel changes"]'),
    page.locator('.dx-link-cancel'),
    page.locator('.dx-revert-button'),
    page.locator('.dx-link').filter({ hasText: /cancel changes/i }),
    page.locator('.dx-link').filter({ hasText: /discard/i }),
    page.locator('.dx-link').filter({ hasText: /revert/i }),
    page.locator('button').filter({ hasText: /cancel changes/i }),
    page.locator('button').filter({ hasText: /revert/i }),
  ];

  const candidates: Locator[] = [...overlayScoped, ...pageScoped];

  for (const locator of candidates) {
    if (await locator.count()) {
      return locator.first();
    }
  }

  return null;
}

async function clearNameCellAndBlur(page: Page, rowIndex: number) {
  const editor = nameEditor(page, rowIndex);
  await editor.click();
  await page.keyboard.press('End');
  const currentValue = await editor.inputValue();
  for (let i = 0; i < currentValue.length; i += 1) {
    await page.keyboard.press('Backspace');
  }
  await page.keyboard.press('Tab');
  const blurTargetRowIndex = rowIndex === 0 ? rowIndex + 1 : rowIndex - 1;
  await articleCell(page, blurTargetRowIndex).click();
}

async function cancelInlineValidationMessage(page: Page) {
  const overlays = validationOverlay(page);
  const overlay = (await overlays.count()) > 0 ? overlays.last() : null;

  if (overlay) {
    await expect(overlay).toBeVisible({ timeout: 5_000 });
  } else {
    expect.soft(false, 'Validation tooltip not found while attempting to cancel edits');
  }

  const cancelButton = await findCancelButton(page, overlay);
  if (cancelButton) {
    await expect(cancelButton).toBeVisible({ timeout: 5_000 });
    await cancelButton.click();
  } else {
    expect.soft(false, 'Cancel button not found; falling back to grid.cancelEditData()');
    await page.evaluate(() => (window as any).__TEST_GRID__.cancelEditData());
  }

  if (overlay) {
    await expect(overlay).toBeHidden({ timeout: 5_000 });
  }
}

async function expectCellValue(page: Page, rowIndex: number, expected: string) {
  const editor = nameEditor(page, rowIndex);
  await expect(editor).toHaveValue(expected);
}

async function expectValidationMessageAfterBlur(page: Page) {
  const overlays = validationOverlay(page);
  if (await overlays.count()) {
    await expect.soft(overlays.last(), 'Validation message should appear after blurring an empty required cell').toBeVisible({ timeout: 2_000 });
  } else {
    expect.soft(false, 'Validation message should appear after blurring an empty required cell');
  }
}

test.describe('DataGrid repaintChangesOnly + cancelEditData', () => {
  test('should restore every edited cell after Cancel Changes', async ({ page }) => {
    page.on('console', (message) => console.log('[browser]', message.type(), message.text()));
    page.on('pageerror', (error) => console.error('[browser-error]', error));

    await page.setContent(TEST_PAGE_HTML, { waitUntil: 'domcontentloaded' });
    await page.addStyleTag({ path: css('dx.common.css') });
    await page.addStyleTag({ path: css('dx.light.css') });
    await page.addScriptTag({ path: js('jquery.min.js') });
    await page.addScriptTag({ path: js('jszip.min.js') });
    await page.addScriptTag({ path: js('dx.all.debug.js') });
    await page.evaluate(() => {
      const jobs = [
        { id: 1, name: 'Job 1', article: 'Article A' },
        { id: 2, name: 'Job 2', article: 'Article B' },
      ];

      const grid = (window as any).$('#grid').dxDataGrid({
        dataSource: jobs,
        keyExpr: 'id',
        repaintChangesOnly: true,
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        columns: [
          {
            dataField: 'name',
            caption: 'Name',
            showEditorAlways: true,
            validationRules: [{ type: 'required', message: 'Required field' }],
          },
          {
            dataField: 'article',
          },
        ],
      }).dxDataGrid('instance');

      (window as any).__TEST_GRID__ = grid;
    });
    await expect(page.locator('.dx-datagrid:not(.dx-context-menu)')).toBeVisible({ timeout: 15_000 });

    // Step set 1: row 1 behaves correctly.
    await clearNameCellAndBlur(page, 0);
    await nameEditor(page, 0).click();
    await cancelInlineValidationMessage(page);
    await expectCellValue(page, 0, 'Job 1');

    // Step set 2: row 2 reproduces the bug (validation should show on blur but only appears after refocus, cancel fails to restore value).
    await clearNameCellAndBlur(page, 1);
    await expectValidationMessageAfterBlur(page);
    await nameEditor(page, 1).click();
    await cancelInlineValidationMessage(page);
    await expectCellValue(page, 1, 'Job 2');
  });
});
