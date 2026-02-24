import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { expect, test } from '@playwright/test';

test('DataGrid bulk delete should load next page', async ({ page }) => {
  const repoRoot = path.resolve(__dirname, '..', '..', '..');
  const fixturePath = path.join(
    repoRoot,
    'e2e',
    'playwright',
    'fixtures',
    'datagrid-bulk-delete.html'
  );

  const useCdn = process.env.DX_BISECT === '1';
  const dxVersion = process.env.DX_VERSION ?? '25.2.4';
  const dxScriptUrl = `https://cdn3.devexpress.com/jslib/${dxVersion}/js/dx.all.js`;
  const dxScriptCandidates = [
    path.join(repoRoot, 'packages', 'devextreme', 'artifacts', 'js', 'dx.all.debug.js'),
    path.join(repoRoot, 'artifacts', 'js', 'dx.all.debug.js')
  ];
  const dxScriptPath = dxScriptCandidates.find((candidate) => fs.existsSync(candidate));
  if (!useCdn && !dxScriptPath) {
    throw new Error(
      'DevExtreme debug bundle not found. Expected at ' +
        dxScriptCandidates.join(' or ') +
        '. Build artifacts before running this test.'
    );
  }

  await page.goto(pathToFileURL(fixturePath).toString());
  await page.addStyleTag({
    content: `
      html, body { height: 100%; margin: 0; }
      .demo { padding: 12px; font-family: sans-serif; }
      #grid { height: 480px; }
    `
  });

  if (useCdn) {
    await page.addScriptTag({ url: dxScriptUrl });
  } else {
    await page.addScriptTag({ path: dxScriptPath as string });
  }

  await page.evaluate(() => {
    const data = Array.from({ length: 45 }, (_, index) => ({
      id: index + 1,
      orderNumber: 35700 + index,
      city: 'City ' + (index + 1),
      amount: 1000 + index * 10
    }));

    let mutableData = data.slice();
    (window as any).__loadCalls = [];

    const store = new (window as any).DevExpress.data.CustomStore({
      key: 'id',
      load: (loadOptions: { skip?: number; take?: number }) => {
        const skip = loadOptions.skip ?? 0;
        const take = loadOptions.take ?? 20;
        (window as any).__loadCalls.push({ skip, take });
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(mutableData.slice(skip, skip + take));
          }, 50);
        });
      },
      remove: (key: number) => {
        mutableData = mutableData.filter((item) => item.id !== key);
        return Promise.resolve();
      }
    });

    const dataSource = new (window as any).DevExpress.data.DataSource({
      store,
      paginate: true,
      pageSize: 20,
      requireTotalCount: false
    });

    const grid = new (window as any).DevExpress.ui.dxDataGrid(
      document.getElementById('grid'),
      {
        dataSource,
        keyExpr: 'id',
        remoteOperations: true,
        selection: { mode: 'multiple' },
        paging: { pageSize: 20 },
        columns: [
          { dataField: 'orderNumber', caption: 'Order Number' },
          { dataField: 'city', caption: 'City' },
          { dataField: 'amount', caption: 'Amount', format: 'currency' }
        ]
      }
    );

    (window as any).__grid = grid;
    document.getElementById('delete-selected')?.addEventListener('click', () => {
      grid.deleteSelectedRows();
    });
  });

  await expect.poll(async () => {
    return await page.evaluate(() => (window as any).__loadCalls.length);
  }).toBeGreaterThan(0);

  await expect.poll(async () => {
    return await page.evaluate(() => (window as any).__grid.getVisibleRows().length);
  }).toBe(20);

  await page.locator('.dx-data-row td').first().click();
  await page.evaluate(() => (window as any).__grid.selectAll());

  await expect.poll(async () => {
    return await page.evaluate(() => (window as any).__grid.getSelectedRowKeys().length);
  }).toBe(20);

  await page.getByRole('button', { name: 'Delete selected items' }).click();

  await page.waitForFunction(() => {
    return (window as any).__loadCalls.some((call: { skip: number }) => call.skip === 20);
  });

  await expect.poll(async () => {
    return await page.evaluate(() => (window as any).__grid.getVisibleRows().length);
  }).toBe(20);
});
