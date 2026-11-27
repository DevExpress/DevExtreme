import { expect, test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { getThemeName } from '../../../helpers/themeUtils';
import CardView from '../../../models/cardView';
import { getColumnItem, triggerDragEnd, triggerDragStart } from '../../cardView/columnSortable/utils';

const DROPZONE_SELECTOR = `${DEFAULT_SELECTOR} .dx-cardview-dropzone`;

test('headerPanel dragging column when it has sorting and headerFilter', async ({ page, theme }) => {
  await createWidget(page, 'dxCardView', {
    allowColumnReordering: true,
    columnChooser: {
      enabled: true,
    },
    headerFilter: {
      visible: true,
    },
    columns: [{
      dataField: 'test',
      allowReordering: true,
      sortOrder: 'asc',
    }],
  });

  const cardView = new CardView(page, DEFAULT_SELECTOR);
  const columnElement = cardView.getHeaderPanel().getHeaderItem(0).element;

  await triggerDragStart(columnElement);

  const a11yCheckConfig = {
    rules: {
      ...(getThemeName(theme) === 'fluent-next' ? {} : { 'color-contrast': { enabled: false } }),
    },
  };
  await a11yCheck(page, a11yCheckConfig, DEFAULT_SELECTOR);
});

test('dropzone appear in headerPanel when drag from columnChooser a column', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    allowColumnReordering: true,
    columnChooser: {
      enabled: true,
    },
    height: 600,
    columns: [
      { dataField: 'Column 1', visible: false },
    ],
  });

  const cardView = new CardView(page, DEFAULT_SELECTOR);
  const columnElement = getColumnItem(cardView, 0, 'columnChooser');
  const dropzone = page.locator(DROPZONE_SELECTOR);

  await cardView.apiShowColumnChooser();

  await triggerDragStart(columnElement);
  // wait for dropzone animation to finish
  await expect(dropzone).toHaveCSS('opacity', '1');

  await triggerDragEnd(columnElement);
  // wait for dropzone animation to finish
  await expect(dropzone).toHaveCSS('opacity', '0');

  const a11yCheckConfig = {};
  await a11yCheck(page, a11yCheckConfig, DEFAULT_SELECTOR);
});

test('dropzone appears in headerPanel when drag from columnChooser a column with allowReordering: false', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    allowColumnReordering: true,
    columnChooser: {
      enabled: true,
    },
    height: 600,
    columns: [
      { dataField: 'Column 1' },
      { dataField: 'Column 2', visible: false, allowReordering: false },
    ],
  });

  const cardView = new CardView(page, DEFAULT_SELECTOR);
  const columnElement = getColumnItem(cardView, 0, 'columnChooser');
  const dropzone = page.locator(DROPZONE_SELECTOR);

  await cardView.apiShowColumnChooser();

  await triggerDragStart(columnElement);
  // wait for dropzone animation to finish
  await expect(dropzone).toHaveCSS('opacity', '1');

  await triggerDragEnd(columnElement);
  // wait for dropzone animation to finish
  await expect(dropzone).toHaveCSS('opacity', '0');

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});
