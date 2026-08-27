import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import PivotGrid from '../../../../models/pivotGrid';
import HeaderFilter from '../../../../models/dataGrid/headers/headerFilter';

const PIVOT_GRID_SELECTOR = '#container';

// Chrome turns a real Shift+F10 into a "contextmenu" event of its own, which would open the menu
// even if the widget ignored the shortcut; the keydown is dispatched instead so the assertion is
// about the widget, the way the TestCafe test meant it.
const SHIFT_F10_KEYDOWN = {
  key: 'F10', code: 'F10', shiftKey: true, bubbles: true, cancelable: true,
};

const createConfig = (): any => ({
  width: 1000,
  allowSortingBySummary: true,
  allowSorting: true,
  allowExpandAll: true,
  allowFiltering: true,
  showBorders: true,
  fieldChooser: {
    enabled: true,
    height: 500,
  },
  fieldPanel: {
    visible: true,
  },
  dataSource: {
    fields: [{
      dataField: 'country',
      area: 'filter',
    }, {
      dataField: 'city',
      area: 'filter',
    }, {
      caption: 'Region',
      width: 120,
      dataField: 'region',
      area: 'row',
    }, {
      caption: 'City',
      dataField: 'city',
      width: 150,
      area: 'row',
    }, {
      dataField: 'id',
      area: 'column',
    }, {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    }, {
      groupName: 'date',
      groupInterval: 'year',
      expanded: true,
      area: 'column',
    }, {
      caption: 'Relative Sales',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      area: 'data',
      summaryDisplayMode: 'percentOfColumnGrandTotal',
    }, {
      dataField: 'data1',
      dataType: 'number',
      area: 'data',
    }],
    store: [{
      id: 10887,
      region: 'Africa',
      country: 'Egypt',
      city: 'Cairo',
      amount: 500,
      date: new Date('2015-05-26'),
    }, {
      id: 10888,
      region: 'South America',
      country: 'Argentina',
      city: 'Buenos Aires',
      amount: 780,
      date: '2015-05-07',
    }],
  },
});

[true, false].forEach((isFieldChooser) => {
  const getField = (pivotGrid: PivotGrid, area: string, index: number): Locator => {
    switch (area) {
      case 'filter':
        return isFieldChooser
          ? pivotGrid.getFieldChooser().getFilterAreaItem(index)
          : pivotGrid.getFilterHeaderArea().getField(index);
      case 'data':
        return isFieldChooser
          ? pivotGrid.getFieldChooser().getDataFields().nth(index)
          : pivotGrid.getDataHeaderArea().getField(index);
      case 'column':
        return isFieldChooser
          ? pivotGrid.getFieldChooser().getColumnAreaItem(index)
          : pivotGrid.getColumnHeaderArea().getField(index);
      case 'row':
        return isFieldChooser
          ? pivotGrid.getFieldChooser().getRowAreaItem(index)
          : pivotGrid.getRowHeaderArea().getField(index);
      default:
        throw new Error(`Unknown area: ${area}`);
    }
  };

  const testTitlePrefix = isFieldChooser ? 'Field Chooser' : 'PivotGrid';

  const getAreaFieldsContainer = (pivotGrid: PivotGrid, area: string): Locator => (isFieldChooser
    ? pivotGrid.page.locator(`.dx-pivotgridfieldchooser .dx-area-fields[group="${area}"]`)
    : pivotGrid.page.locator(`.dx-pivotgrid-fields-area[group="${area}"]`));

  test(`${testTitlePrefix}: Fields should be exposed as menu items of an area menubar`, async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', createConfig());

    const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

    if (isFieldChooser) {
      await pivotGrid.getFieldChooserButton().click();
    }

    const rowAreaContainer = getAreaFieldsContainer(pivotGrid, 'row');
    const menubar = rowAreaContainer.locator('[role="menubar"]');
    const firstField = getField(pivotGrid, 'row', 0);

    await expect(menubar, 'the area has a single menubar').toHaveCount(1);
    await expect(menubar, 'the menubar is labelled with the area name').toHaveAttribute('aria-label', 'Row Fields');

    await expect(firstField, 'a field is exposed as a menu item').toHaveAttribute('role', 'menuitem');
    await expect(firstField, 'the field label includes the name and the sorting state').toHaveAttribute('aria-label', 'Field: Region, Sort order: ascending');
  });

  ['filter', 'data', 'column', 'row'].forEach((area) => {
    test(`${testTitlePrefix}: Fields in ${area} area should form a single tab stop`, async ({ page }) => {
      await createWidget(page, 'dxPivotGrid', createConfig());

      const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

      if (isFieldChooser) {
        await pivotGrid.getFieldChooserButton().click();
      }

      const areaContainer = getAreaFieldsContainer(pivotGrid, area);

      await expect(
        areaContainer.locator('.dx-area-field[tabindex="0"]'),
        'only one field of the area is in the tab order',
      ).toHaveCount(1);

      const firstField = getField(pivotGrid, area, 0);
      const secondField = getField(pivotGrid, area, 1);

      await secondField.click();

      await expect(secondField, 'second field is focused after click').toBeFocused();
      await expect(secondField, 'focused field is the tab stop').toHaveAttribute('tabindex', '0');
      await expect(firstField, 'first field is removed from the tab order').toHaveAttribute('tabindex', '-1');

      await expect(
        areaContainer.locator('.dx-area-field[tabindex="0"]'),
        'the focused field is the only tab stop',
      ).toHaveCount(1);
    });

    test(`${testTitlePrefix}: Fields in ${area} area should be navigable by arrows`, async ({ page }) => {
      await createWidget(page, 'dxPivotGrid', createConfig());

      const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

      if (isFieldChooser) {
        await pivotGrid.getFieldChooserButton().click();
      }

      const firstField = getField(pivotGrid, area, 0);
      const secondField = getField(pivotGrid, area, 1);

      await firstField.click();

      await expect(firstField, 'first field is focused after click').toBeFocused();

      await page.keyboard.press('ArrowRight');

      await expect(secondField, 'second field is focused after ArrowRight').toBeFocused();

      await page.keyboard.press('ArrowLeft');

      await expect(firstField, 'first field is focused after ArrowLeft').toBeFocused();

      await page.keyboard.press('ArrowDown');

      await expect(secondField, 'second field is focused after ArrowDown').toBeFocused();

      await page.keyboard.press('ArrowUp');

      await expect(firstField, 'first field is focused after ArrowUp').toBeFocused();

      await page.keyboard.press('ArrowUp');

      await expect(firstField, 'focus stays on the first field at the area boundary').toBeFocused();
    });
  });

  ['filter', 'column', 'row'].forEach((area) => {
    test(`${testTitlePrefix}: Fields in ${area} area on enter key press`, async ({ page }) => {
      await createWidget(page, 'dxPivotGrid', createConfig());

      const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

      if (isFieldChooser) {
        await pivotGrid.getFieldChooserButton().click();
      }

      const firstField = getField(pivotGrid, area, 0);
      const secondField = getField(pivotGrid, area, 1);

      await firstField.click();
      await page.keyboard.press('ArrowRight');

      await expect(secondField, 'second field is focused after ArrowRight').toBeFocused();
      await expect(secondField.locator('.dx-sort-up'), 'second field has asc sort indicator initially').toBeAttached();

      await page.keyboard.press('Enter');

      await expect(secondField, 'second field is focused after Enter').toBeFocused();
      await expect(secondField.locator('.dx-sort-down'), 'second field has desc sort indicator after Enter').toBeAttached();

      await page.keyboard.press('Enter');

      await expect(secondField, 'second field is focused after second Enter').toBeFocused();
      await expect(secondField.locator('.dx-sort-up'), 'second field has asc sort indicator after second Enter').toBeAttached();
    });

    test(`${testTitlePrefix}: Fields in ${area} area on space key press`, async ({ page }) => {
      await createWidget(page, 'dxPivotGrid', createConfig());

      const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

      if (isFieldChooser) {
        await pivotGrid.getFieldChooserButton().click();
      }

      const firstField = getField(pivotGrid, area, 0);
      const secondField = getField(pivotGrid, area, 1);

      await firstField.click();
      await page.keyboard.press('ArrowRight');

      await expect(secondField, 'second field is focused after ArrowRight').toBeFocused();
      await expect(secondField.locator('.dx-sort-up'), 'second field has asc sort indicator initially').toBeAttached();

      await page.keyboard.press('Space');

      await expect(secondField, 'second field is focused after Space').toBeFocused();
      await expect(secondField.locator('.dx-sort-down'), 'second field has desc sort indicator after Space').toBeAttached();

      await page.keyboard.press('Space');

      await expect(secondField, 'second field is focused after second Space').toBeFocused();
      await expect(secondField.locator('.dx-sort-up'), 'second field has asc sort indicator after second Space').toBeAttached();
    });

    test(`${testTitlePrefix}: Field in ${area} should open header filter by alt+ArrowDown`, async ({ page }) => {
      await createWidget(page, 'dxPivotGrid', createConfig());

      const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
      const headerFilter = new HeaderFilter(page);

      if (isFieldChooser) {
        await pivotGrid.getFieldChooserButton().click();
      }

      const firstField = getField(pivotGrid, area, 0);

      await firstField.click();

      await expect(firstField, 'field is focused after click').toBeFocused();

      await page.keyboard.press('Alt+ArrowDown');

      await expect(headerFilter.element, 'header filter popup is shown after Alt+ArrowDown').toBeAttached();
    });

    test(`${testTitlePrefix}: Field in ${area} should have focus after header filter is closed`, async ({ page }) => {
      await createWidget(page, 'dxPivotGrid', createConfig());

      const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
      const headerFilter = new HeaderFilter(page);

      if (isFieldChooser) {
        await pivotGrid.getFieldChooserButton().click();
      }

      const firstField = getField(pivotGrid, area, 0);

      await firstField.click();
      await page.keyboard.press('Alt+ArrowDown');

      await expect(headerFilter.element, 'header filter popup is shown after Alt+ArrowDown').toBeAttached();

      await page.keyboard.press('Escape');

      await expect(firstField, 'first field is focused after header filter is closed').toBeFocused();
    });

    test(`${testTitlePrefix}: Field in ${area} should have focus after header filter is applied`, async ({ page }) => {
      await createWidget(page, 'dxPivotGrid', createConfig());

      const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
      const headerFilter = new HeaderFilter(page);

      if (isFieldChooser) {
        await pivotGrid.getFieldChooserButton().click();
      }

      const firstField = getField(pivotGrid, area, 0);

      await firstField.click();
      await page.keyboard.press('Alt+ArrowDown');

      await expect(headerFilter.element, 'header filter popup is shown after Alt+ArrowDown').toBeAttached();

      const list = headerFilter.getList();
      const okButton = headerFilter.getButtons().nth(0);

      await list.getItem(0).element.click();
      await okButton.click();

      await expect(firstField, 'first field is focused after header filter is applied').toBeFocused();
    });
  });
});

test('PivotGrid: Should traverse fields in all areas by tab', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

  const filterFirstField = pivotGrid.getFilterHeaderArea().getField(0);
  const dataFirstField = pivotGrid.getDataHeaderArea().getField(0);
  const columnFirstField = pivotGrid.getColumnHeaderArea().getField(0);
  const rowFirstField = pivotGrid.getRowHeaderArea().getField(0);

  await filterFirstField.click();

  await expect(filterFirstField, 'first field in filter area is focused after click').toBeFocused();

  await page.keyboard.press('Tab');

  await expect(dataFirstField, 'first field in data area is focused').toBeFocused();

  await page.keyboard.press('Tab');

  await expect(columnFirstField, 'first field in column area is focused').toBeFocused();

  await page.keyboard.press('Tab');

  await expect(rowFirstField, 'first field in row area is focused').toBeFocused();
});

test('FieldChooser: Should traverse fields in all areas by tab', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const fieldChooser = pivotGrid.getFieldChooser();

  await pivotGrid.getFieldChooserButton().click();

  const rowFirstField = fieldChooser.getRowAreaItem(0);
  const columnFirstField = fieldChooser.getColumnAreaItem(0);
  const filterFirstField = fieldChooser.getFilterAreaItem(0);
  const dataFirstField = fieldChooser.getDataAreaItem(0);

  await rowFirstField.click();

  await expect(rowFirstField, 'first field in row area is focused after click').toBeFocused();

  await page.keyboard.press('Tab');

  await expect(columnFirstField, 'first field in column area is focused').toBeFocused();

  await page.keyboard.press('Tab');

  await expect(filterFirstField, 'first field in filter area is focused').toBeFocused();

  await page.keyboard.press('Tab');

  await expect(dataFirstField, 'first field in data area is focused').toBeFocused();
});

test('PivotGrid: Should open the context menu by Shift+F10 on a field', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const firstField = pivotGrid.getRowHeaderArea().getField(0);
  const contextMenuItem = page.locator('.dx-context-menu .dx-menu-item-text').filter({ hasText: 'Show Field Chooser' });

  await firstField.click();

  await expect(firstField, 'field is focused after click').toBeFocused();

  await firstField.dispatchEvent('keydown', SHIFT_F10_KEYDOWN);

  await expect(contextMenuItem.first(), 'the field context menu is shown after Shift+F10').toBeVisible();
});

test('PivotGrid: Field should have focus after the context menu is closed', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const firstField = pivotGrid.getRowHeaderArea().getField(0);
  const contextMenuItem = page.locator('.dx-context-menu .dx-menu-item-text').filter({ hasText: 'Show Field Chooser' });

  await firstField.click();
  await firstField.dispatchEvent('keydown', SHIFT_F10_KEYDOWN);

  await expect(contextMenuItem.first(), 'the field context menu is shown after Shift+F10').toBeVisible();

  await page.keyboard.press('Escape');

  await expect(firstField, 'the field is focused after the context menu is closed').toBeFocused();
});

test('FieldChooser: Shift+F10 on a popup field should not open the grid context menu', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const fieldChooser = pivotGrid.getFieldChooser();
  const contextMenu = page.locator('.dx-context-menu .dx-menu-item-text');

  await pivotGrid.getFieldChooserButton().click();

  const firstField = fieldChooser.getRowAreaItem(0);

  await firstField.click();
  await firstField.dispatchEvent('keydown', SHIFT_F10_KEYDOWN);

  await expect(contextMenu.first(), 'the grid context menu is not shown for a field chooser popup field').toBeHidden();
});
