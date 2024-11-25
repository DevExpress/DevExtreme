import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TreeList from 'devextreme-testcafe-models/treeList';
import { Selector } from 'testcafe';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { changeTheme } from '../../../helpers/changeTheme';
import { Themes } from '../../../helpers/themes';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

const TREE_LIST_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Drag and Drop`
  .page(url(__dirname, '../../container.html'));

[Themes.genericLight, Themes.materialBlue, Themes.fluentBlue].forEach((theme) => {
  safeSizeTest(`Header hover should display correctly when there are fixed columns (${theme} theme)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const headerCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(13);

    await t.expect(treeList.isReady()).ok();

    await t.hover(headerCell.element);

    await t.expect(headerCell.isHovered()).ok();

    await takeScreenshot(`treelist_header_hover_with_fixed_columns_(${theme}).png`, treeList.element);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800])
    .before(async () => {
      await changeTheme(theme);
      await createWidget('dxTreeList', {
        dataSource: new Array(20).fill(null).map((_, index) => {
          const item = {
            id: index + 1,
            parentId: index % 5,
          };

          for (let i = 0; i < 13; i += 1) {
            item[`field${i}`] = `test ${i} ${index + 2}`;
          }

          return item;
        }),
        keyExpr: 'id',
        columnFixing: {
          enabled: true,
        },
        width: 850,
        autoExpandAll: true,
        columnAutoWidth: true,
        customizeColumns(columns) {
          columns[5].fixed = true;
          columns[6].fixed = true;

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      });
    })
    .after(async (t) => {
      await t.hover(Selector('body'));
      await changeTheme(Themes.genericLight);
    });

  safeSizeTest(`Row hover should display correctly when there are fixed columns (${theme} theme)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const dataRow = treeList.getDataRow(1);

    await t.expect(treeList.isReady()).ok();

    await t.hover(dataRow.element);

    await t.expect(dataRow.isHovered).ok();

    await takeScreenshot(`treelist_row_hover_with_fixed_columns_(${theme}).png`, treeList.element);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800])
    .before(async () => {
      await changeTheme(theme);
      await createWidget('dxTreeList', {
        dataSource: new Array(20).fill(null).map((_, index) => {
          const item = {
            id: index + 1,
            parentId: index % 5,
          };

          for (let i = 0; i < 13; i += 1) {
            item[`field${i}`] = `test ${i} ${index + 2}`;
          }

          return item;
        }),
        keyExpr: 'id',
        columnFixing: {
          enabled: true,
        },
        width: 850,
        autoExpandAll: true,
        columnAutoWidth: true,
        hoverStateEnabled: true,
        customizeColumns(columns) {
          columns[5].fixed = true;
          columns[6].fixed = true;

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      });
    })
    .after(async (t) => {
      await t.hover(Selector('body'));
      await changeTheme(Themes.genericLight);
    });
});
