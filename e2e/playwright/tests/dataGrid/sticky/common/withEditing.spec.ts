/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import type { DataRenderMode } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { defaultConfig } from '../helpers/data';

test.describe('Sticky columns - Editing', () => {
  test.use({ browserSize: [800, 800] });

  test('The row edit mode: Edit row when there are sticky columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...defaultConfig,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      scrolling: {
        showScrollbar: 'never',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const editCell = dataGrid.getDataCell(1, 1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiEditRow(1);
    await expect(dataGrid.getDataCell(1, 0).getEditor().element).toBeFocused();

    await editCell.element.click();
    await expect(editCell.getEditor().element).toBeFocused();

    await testScreenshot(page, 'edit_row_with_sticky_columns_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'edit_row_with_sticky_columns_2.png', { element: dataGrid.element });
  });

  test('The form edit mode: Edit row when there are sticky columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...defaultConfig,
      editing: {
        mode: 'form',
        allowUpdating: true,
      },
      scrolling: {
        showScrollbar: 'never',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiEditRow(1);
    await expect(dataGrid.getEditForm().element).toBeVisible();

    await testScreenshot(page, 'edit_form_with_sticky_columns_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'edit_form_with_sticky_columns_2.png', { element: dataGrid.element });
  });

  test('The batch edit mode: Edit cell when there are sticky columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      scrolling: {
        showScrollbar: 'never',
      },
      customizeColumns(columns) {
        columns[1].fixed = true;
        columns[1].fixedPosition = 'left';
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const editCell = dataGrid.getDataCell(0, 2);

    await editCell.element.click();

    await editCell.expectEditCell();
    await expect(editCell.getEditor().element).toBeFocused();

    await testScreenshot(page, 'edit_cell_with_sticky_columns_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'edit_cell_with_sticky_columns_2.png', { element: dataGrid.element });
  });

  test('The batch edit mode: Edit fixed cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      scrolling: {
        showScrollbar: 'never',
      },
      customizeColumns(columns) {
        columns[1].fixed = true;
        columns[1].fixedPosition = 'left';
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const editCell = dataGrid.getDataCell(0, 1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await editCell.element.click();
    await expect(editCell.getEditor().element).toBeFocused();

    await testScreenshot(page, 'edit_fixed_cell_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'edit_fixed_cell_2.png', { element: dataGrid.element });
  });

  test('The batch edit mode: Edit fixed cell with sticky position', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      scrolling: {
        showScrollbar: 'never',
      },
      customizeColumns(columns) {
        columns[1].fixed = true;
        columns[1].fixedPosition = 'left';
        columns[3].fixed = true;
        columns[3].fixedPosition = 'sticky';
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const editCell = dataGrid.getDataCell(0, 3);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await editCell.element.click();
    await expect(editCell.getEditor().element).toBeFocused();

    await testScreenshot(page, 'edit_fixed_cell_with_sticky_position_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'edit_fixed_cell_with_sticky_position_2.png', { element: dataGrid.element });
  });

  test('The cell edit mode: Edit fixed cell with validation rule', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columnWidth: 200,
      scrolling: {
        showScrollbar: 'never',
      },
      customizeColumns(columns) {
        columns[0].validationRules = [{ type: 'required' }];
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const editCell = dataGrid.getDataCell(0, 0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiCellValue(0, 0, '');
    await editCell.element.click();
    await expect(editCell.getEditor().element).toBeFocused();
    await expect(dataGrid.getOverlay().getInvalidMessage()).toBeVisible();
    await expect(dataGrid.getOverlay().getRevertTooltip()).toBeVisible();

    await testScreenshot(page, 'edit_fixed_cell_with_validation_rule_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'edit_fixed_cell_with_validation_rule_2.png', { element: dataGrid.element });
  });

  test('The cell edit mode: Edit fixed cell with the sticky position and validation rule', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columnWidth: 200,
      scrolling: {
        showScrollbar: 'never',
      },
      customizeColumns(columns) {
        columns[2].fixed = true;
        columns[2].fixedPosition = 'sticky';
        columns[2].validationRules = [{ type: 'required' }];
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const editCell = dataGrid.getDataCell(0, 2);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiCellValue(0, 2, '');
    await editCell.element.click();
    await expect(editCell.getEditor().element).toBeFocused();
    await expect(dataGrid.getOverlay().getInvalidMessage()).toBeVisible();
    await expect(dataGrid.getOverlay().getRevertTooltip()).toBeVisible();

    await testScreenshot(page, 'edit_fixed_cell_with_sticky_position_and_validation_rule_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'edit_fixed_cell_with_sticky_position_and_validation_rule_2.png', { element: dataGrid.element });
  });

  test('The cell edit mode: Edit cell with validation rule when there fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      scrolling: {
        showScrollbar: 'never',
      },
      columnWidth: 150,
      customizeColumns(columns) {
        columns[1].validationRules = [{ type: 'required' }];
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const editCell = dataGrid.getDataCell(0, 1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiCellValue(0, 1, '');
    await editCell.element.click();
    await expect(editCell.getEditor().element).toBeFocused();
    await expect(dataGrid.getOverlay().getInvalidMessage()).toBeVisible();
    await expect(dataGrid.getOverlay().getRevertTooltip()).toBeVisible();

    await testScreenshot(page, 'edit_cell_with_validation_rule_and_fixed_columns_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 200 });

    await testScreenshot(page, 'edit_cell_with_validation_rule_and_fixed_columns_2.png', { element: dataGrid.element });
  });

  test('The cell edit mode: Edit last unfixed cell with validation rule when there are fixed columns on the right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      scrolling: {
        showScrollbar: 'never',
      },
      columnWidth: 200,
      customizeColumns(columns) {
        columns[5].validationRules = [{ type: 'required' }];
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const editCell = dataGrid.getDataCell(0, 5);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 10000 });
    await dataGrid.apiCellValue(0, 5, '');
    await editCell.element.click();
    await expect(editCell.getEditor().element).toBeFocused();
    await expect(dataGrid.getOverlay().getInvalidMessage()).toBeVisible();
    await expect(dataGrid.getOverlay().getRevertTooltip()).toBeVisible();

    await testScreenshot(page, 'edit_last_unfixed_cell_with_validation_rule_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 350 });

    await testScreenshot(page, 'edit_last_unfixed_cell_with_validation_rule_2.png', { element: dataGrid.element });
  });

  test('The cell edit mode: The validation message and a revert button should scroll vertically', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      scrolling: {
        showScrollbar: 'never',
      },
      columnWidth: 200,
      customizeColumns(columns) {
        columns[0].validationRules = [{ type: 'required' }];
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const editCell = dataGrid.getDataCell(5, 0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiCellValue(5, 0, '');
    await editCell.element.click();
    await expect(editCell.getEditor().element).toBeFocused();
    await expect(dataGrid.getOverlay().getInvalidMessage()).toBeVisible();
    await expect(dataGrid.getOverlay().getRevertTooltip()).toBeVisible();

    await testScreenshot(page, 'vertical_scroll_and_fixed_column_with_validation_message_and_revert_button_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ top: 10000 });

    await testScreenshot(page, 'vertical_scroll_and_fixed_column_with_validation_message_and_revert_button_2.png', { element: dataGrid.element });
  });

  (['standard', 'virtual'] as DataRenderMode[]).forEach((rowRenderingMode) => {
    test(`The cell edit mode: The focus overlay element should scroll vertically (rowRenderingMode=${rowRenderingMode})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        ...defaultConfig,
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        scrolling: {
          showScrollbar: 'never',
          rowRenderingMode,
        },
        columnWidth: 200,
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const editCell = dataGrid.getDataCell(5, 0);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await editCell.element.click();
      await expect(editCell.getEditor().element).toBeFocused();

      await testScreenshot(page, 'vertical_scroll_and_focused_fixed_column_1.png', { element: dataGrid.element });

      await dataGrid.scrollTo({ top: 10000 });

      await testScreenshot(page, 'vertical_scroll_and_focused_fixed_column_2.png', { element: dataGrid.element });
    });
  });
});
