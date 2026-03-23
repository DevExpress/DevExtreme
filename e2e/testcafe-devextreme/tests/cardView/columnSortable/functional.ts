import CardView from 'devextreme-testcafe-models/cardView';
import TreeView from 'devextreme-testcafe-models/treeView';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getCardFieldCaptions } from '../helpers/cardUtils';
import {
  arrayMoveToGap,
  dragToColumnChooser,
  dragToHeaderPanel,
  expectColumns,
  getColumnItem,
  triggerDragStart,
  SELECTORS,
} from './utils';

fixture.disablePageReloads`CardView - ColumnSortable.Functional`
  .page(url(__dirname, '../../container.html'));

[
  { allowColumnReordering: false, allowReordering: false, result: false },
  { allowColumnReordering: false, allowReordering: true, result: false },
  { allowColumnReordering: true, allowReordering: false, result: false },
  { allowColumnReordering: true, allowReordering: true, result: true },
].forEach(({ allowColumnReordering, allowReordering, result }) => {
  test(`header column is draggable: ${result}, when allowColumnReordering: ${allowColumnReordering}, allowReordering: ${allowReordering}`, async (t) => {
    const cardView = new CardView('#container');
    const columnElement = cardView.getHeaders().getHeaderItemNth(0).element;

    await triggerDragStart(columnElement);

    const draggingElement = Selector(SELECTORS.dragging);

    if (result) {
      await t.expect(draggingElement.exists).ok();
    } else {
      await t.expect(draggingElement.exists).notOk();
    }
  }).before(async () => createWidget('dxCardView', {
    allowColumnReordering,
    columns: [{
      dataField: 'test',
      allowReordering,
    }],
  }));
});

[
  { columnChooserMode: 'dragAndDrop', allowHiding: false, result: false },
  { columnChooserMode: 'dragAndDrop', allowHiding: true, result: true },
  { columnChooserMode: 'select', allowHiding: false, result: false },
  { columnChooserMode: 'select', allowHiding: true, result: false },
].forEach(({ columnChooserMode, allowHiding, result }) => {
  test(`headerPanel column is draggable: ${result}, when allowReodering: false, allowHiding: ${allowHiding}, columnChooserMode: ${columnChooserMode}`, async (t) => {
    const cardView = new CardView('#container');
    const columnElement = cardView.getHeaders().getHeaderItemNth(0).element;

    await cardView.apiShowColumnChooser();

    await triggerDragStart(columnElement);

    const draggingElement = Selector(SELECTORS.dragging);

    if (result) {
      await t.expect(draggingElement.exists).ok();
    } else {
      await t.expect(draggingElement.exists).notOk();
    }
  }).before(async () => createWidget('dxCardView', {
    allowColumnReordering: true,
    columns: [{
      dataField: 'test',
      allowReordering: false,
      allowHiding,
    }],
    columnChooser: {
      enabled: true,
      mode: columnChooserMode,
    },
  }));
});

[0, 1, 2, 3].forEach((columnIndex) => {
  [0, 1, 2, 3, 4].forEach((gapIndex) => {
    test(`drag from headerPanel to headerPanel: from index ${columnIndex} to index ${gapIndex}`, async (t) => {
      const cardView = new CardView('#container');

      const columnIndices = [0, 1, 2, 3];
      const expectedColumns = arrayMoveToGap(columnIndices, columnIndex, gapIndex);

      const columnElement = getColumnItem(cardView, columnIndex);

      await dragToHeaderPanel(t, cardView, columnElement, gapIndex);

      await expectColumns(t, cardView, expectedColumns);
    }).before(async () => createWidget('dxCardView', {
      allowColumnReordering: true,
      columns: ['Column 0', 'Column 1', 'Column 2', 'Column 3'],
    }));
  });
});

[0, 1].forEach((columnIndex) => {
  [0, 1, 2].forEach((gapIndex) => {
    test(`drag from columnChooser to headerPanel: from index ${columnIndex} to index ${gapIndex}`, async (t) => {
      const cardView = new CardView('#container');
      await cardView.apiShowColumnChooser();

      const columnElement = getColumnItem(cardView, columnIndex, 'columnChooser');

      await dragToHeaderPanel(t, cardView, columnElement, gapIndex);

      const headerPanelColumns = [2, 3, 4];
      headerPanelColumns.splice(gapIndex, 0, columnIndex);

      const chooserColumns = [0, 1, 2, 3, 4].filter((c) => !headerPanelColumns.includes(c));

      await expectColumns(t, cardView, headerPanelColumns);
      await expectColumns(t, cardView, chooserColumns, 'columnChooser');
    }).before(async () => createWidget('dxCardView', {
      allowColumnReordering: true,
      columns: [
        { dataField: 'Column 0', visible: false },
        { dataField: 'Column 1', visible: false },
        { dataField: 'Column 2' },
        { dataField: 'Column 3' },
        { dataField: 'Column 4' },
      ],
    }));
  });
});

[0, 1, 2, 3].forEach((columnIndex) => {
  test(`drag from headerPanel to columnChooser: from index ${columnIndex}`, async (t) => {
    const cardView = new CardView('#container');
    await cardView.apiShowColumnChooser();

    const columnElement = getColumnItem(cardView, columnIndex);

    await dragToColumnChooser(t, cardView, columnElement);

    const chooserColumns = [columnIndex, 4];
    const headerPanelColumns = [0, 1, 2, 3, 4].filter((c) => !chooserColumns.includes(c));

    await expectColumns(t, cardView, headerPanelColumns);
    await expectColumns(t, cardView, chooserColumns, 'columnChooser');
  }).before(async () => createWidget('dxCardView', {
    allowColumnReordering: true,
    columns: [
      { dataField: 'Column 0' },
      { dataField: 'Column 1' },
      { dataField: 'Column 2' },
      { dataField: 'Column 3' },
      { dataField: 'Column 4', visible: false },
    ],
  }));
});

[
  { gapIndex: 0, result: false },
  { gapIndex: 1, result: true },
  { gapIndex: 2, result: true },
  { gapIndex: 3, result: true },
  { gapIndex: 4, result: true },
  { gapIndex: 5, result: false },
  { gapIndex: 6, result: true },
  { gapIndex: 7, result: true },
  { gapIndex: 8, result: true },
  { gapIndex: 9, result: false },
].forEach(({ gapIndex, result }) => {
  test(`drag from headerPanel to headerPanel: with unreordarable columns when dragging to index: ${gapIndex}`, async (t) => {
    const draggingColumnIndex = 2;
    const columnIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const expectedColumns = result
      ? arrayMoveToGap(columnIndices, draggingColumnIndex, gapIndex)
      : columnIndices;

    const cardView = new CardView('#container');
    const columnElement = getColumnItem(cardView, draggingColumnIndex);

    await dragToHeaderPanel(t, cardView, columnElement, gapIndex);

    await expectColumns(t, cardView, expectedColumns);
  }).before(async () => createWidget('dxCardView', {
    allowColumnReordering: true,
    columns: [
      { dataField: 'Column 0', allowReordering: false },
      { dataField: 'Column 1' },
      { dataField: 'Column 2' },
      { dataField: 'Column 3' },
      { dataField: 'Column 4', allowReordering: false },
      { dataField: 'Column 5', allowReordering: false },
      { dataField: 'Column 6' },
      { dataField: 'Column 7' },
      { dataField: 'Column 8', allowReordering: false },
    ],
  }));
});

test('drag from columnChooser to headerPanel: when columnChooser.sortOrder is defined', async (t) => {
  const expectedColumns = [0, 1, 3];

  const cardView = new CardView('#container');
  const columnElement = getColumnItem(cardView, 0, 'columnChooser');

  await cardView.apiShowColumnChooser();

  await dragToHeaderPanel(t, cardView, columnElement, 2);

  await expectColumns(t, cardView, expectedColumns);
}).before(async () => createWidget('dxCardView', {
  allowColumnReordering: true,
  columns: [
    { dataField: 'Column 0' },
    { dataField: 'Column 1' },
    { dataField: 'Column 2', visible: false },
    { dataField: 'Column 3', visible: false },
  ],
  columnChooser: {
    enabled: true,
    mode: 'dragAndDrop',
    sortOrder: 'desc',
  },
}));

test('drag from columnChooser to headerPanel: when columnChooser searchPanel has value', async (t) => {
  const expectedColumns = [0, 1, 3];

  const cardView = new CardView('#container');
  const columnElement = getColumnItem(cardView, 0, 'columnChooser');

  await cardView.apiShowColumnChooser();

  const treeView = new TreeView(cardView.getColumnChooser().element.find(SELECTORS.treeView));
  const input = treeView.getSearchTextBox().getInput();

  await t.typeText(input, '3');

  await dragToHeaderPanel(t, cardView, columnElement, 2);

  await expectColumns(t, cardView, expectedColumns);
}).before(async () => createWidget('dxCardView', {
  allowColumnReordering: true,
  columns: [
    { dataField: 'Column 0' },
    { dataField: 'Column 1' },
    { dataField: 'Column 2', visible: false },
    { dataField: 'Column 3', visible: false },
  ],
  columnChooser: {
    enabled: true,
    mode: 'dragAndDrop',
    search: {
      enabled: true,
      timeout: 0,
    },
  },
}));

test('drag from headerPanel to columnChooser: when allowHiding: false', async (t) => {
  const expectedColumns = [0, 1, 2];

  const cardView = new CardView('#container');
  const columnElement = getColumnItem(cardView, 0);

  await cardView.apiShowColumnChooser();

  await dragToColumnChooser(t, cardView, columnElement);

  await expectColumns(t, cardView, expectedColumns);
}).before(async () => createWidget('dxCardView', {
  allowColumnReordering: true,
  columns: [
    { dataField: 'Column 0', allowHiding: false },
    { dataField: 'Column 1' },
    { dataField: 'Column 2' },
  ],
  columnChooser: {
    enabled: true,
    mode: 'dragAndDrop',
  },
}));

test('drag from columnChooser to headerPanel: when allowReordering: false', async (t) => {
  const expectedColumns = [0, 1, 2];

  const cardView = new CardView('#container');
  const columnElement = getColumnItem(cardView, 0, 'columnChooser');

  await cardView.apiShowColumnChooser();

  await dragToHeaderPanel(t, cardView, columnElement, 2);

  await expectColumns(t, cardView, expectedColumns);
}).before(async () => createWidget('dxCardView', {
  allowColumnReordering: true,
  columns: [
    {
      dataField: 'Column 0', allowReordering: false, visible: false, visibleIndex: 0,
    },
    { dataField: 'Column 1' },
    { dataField: 'Column 2' },
  ],
  columnChooser: {
    enabled: true,
    mode: 'dragAndDrop',
  },
}));

test('cards should update when columns are reordered (T1324855)', async (t) => {
  const cardView = new CardView('#container');

  const initialCaptions = await getCardFieldCaptions(t, cardView, 3);
  await t.expect(initialCaptions).eql(['A', 'B', 'C']);

  const headerPanel = cardView.getHeaderPanel();
  const firstHeader = headerPanel.getHeaderItem(0).element;
  const secondHeader = headerPanel.getHeaderItem(1).element;

  await t.dragToElement(firstHeader, secondHeader, {
    destinationOffsetX: -5,
    destinationOffsetY: -20,
    speed: 0.5,
  });

  const headerCaptions: string[] = [];
  const headersCount = await cardView.getHeaders().getHeaderItemsElements().count;
  for (let i = 0; i < headersCount; i += 1) {
    headerCaptions.push(await cardView.getHeaders().getHeaderItemNth(i).element.innerText);
  }

  const cardCaptions = await getCardFieldCaptions(t, cardView, headersCount);
  await t.expect(cardCaptions).eql(headerCaptions);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { a: 1, b: 2, c: 3 },
  ],
  columns: ['a', 'b', 'c'],
  allowColumnReordering: true,
}));
