import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

// TODO: Write test with remote DataSource after remote grouping will be supported
// TODO: Write integration test with filtering after filtering will be implemented
// TODO: Enable page reloads after issue with ref options will be fixed
fixture`HeaderFilter.Functional`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('list should contain all column values', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const list = cardView.getHeaderFilterList();
  const itemCount = await list.getItems().count;

  await t.expect(itemCount).eql(5);

  for (let idx = 0; idx < 5; idx += 1) {
    await t.expect(list.getItem(idx).text).eql(`A_${idx}`);
  }

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

test('list should contain all column values from all pages', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const list = cardView.getHeaderFilterList();
  const itemCount = await list.getItems().count;

  await t.expect(itemCount).eql(5);

  for (let idx = 0; idx < 5; idx += 1) {
    await t.expect(list.getItem(idx).text).eql(`A_${idx}`);
  }

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  headerFilter: {
    visible: true,
  },
  paging: {
    pageSize: 1,
    pageIndex: 0,
  },
  height: 600,
}));

test('list should contain all values from computed column', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const list = cardView.getHeaderFilterList();
  const itemCount = await list.getItems().count;

  await t.expect(itemCount).eql(5);

  for (let idx = 0; idx < 3; idx += 1) {
    await t.expect(list.getItem(idx).text).eql(`A_${idx}_B_${idx}`);
  }

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  columns: [
    {
      caption: 'Computed',
      calculateCellValue: (data) => `${data.A}_${data.B}`,
    },
  ],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

test('should support custom dataSource', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const list = cardView.getHeaderFilterList();
  const itemCount = await list.getItems().count;

  await t.expect(itemCount).eql(3);

  for (let idx = 0; idx < 3; idx += 1) {
    await t.expect(list.getItem(idx).text).eql(`CUSTOM_${idx}`);
  }

  await t.click(cardView.element);
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: [
      { A: 'A_0', B: 'B_0', C: 'C_0' },
      { A: 'A_1', B: 'B_1', C: 'C_1' },
      { A: 'A_2', B: 'B_2', C: 'C_2' },
      { A: 'A_3', B: 'B_3', C: 'C_3' },
      { A: 'A_4', B: 'B_4', C: 'C_4' },
    ],
    columns: [
      {
        dataField: 'A',
        headerFilter: {
          dataSource: [
            { text: 'CUSTOM_0', value: 0 },
            { text: 'CUSTOM_1', value: 1 },
            { text: 'CUSTOM_2', value: 2 },
          ],
        },
      },
      'B',
      'C',
    ],
    headerFilter: {
      visible: true,
    },
    height: 600,
  });
});

test('should update column options with filterType and values (regular selection)', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const popup = cardView.getHeaderFilterPopup();
  const list = cardView.getHeaderFilterList();

  const okBtn = popup.getButton(0);
  const firstItem = list.getItem(0);
  const secondItem = list.getItem(1);

  await t.click(firstItem.element)
    .click(secondItem.element)
    .click(okBtn.element);

  const columnOptions = await cardView.getColumnOption('A');

  await t
    .expect(columnOptions.headerFilter.filterType).eql(undefined)
    .expect(columnOptions.headerFilter.values).eql(['A_0', 'A_1']);

  await t.click(cardView.element);
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: [
      { A: 'A_0', B: 'B_0', C: 'C_0' },
      { A: 'A_1', B: 'B_1', C: 'C_1' },
      { A: 'A_2', B: 'B_2', C: 'C_2' },
      { A: 'A_3', B: 'B_3', C: 'C_3' },
      { A: 'A_4', B: 'B_4', C: 'C_4' },
    ],
    headerFilter: {
      visible: true,
    },
    height: 600,
  });
});

test('should update column options with filterType and values (selectAll case #0)', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const popup = cardView.getHeaderFilterPopup();
  const list = cardView.getHeaderFilterList();

  const okBtn = popup.getButton(0);
  const selectAllCheckbox = list.selectAll.element;

  await t.click(selectAllCheckbox)
    .click(okBtn.element);

  const columnOptions = await cardView.getColumnOption('A');

  await t
    .expect(columnOptions.headerFilter.filterType).eql('exclude')
    .expect(columnOptions.headerFilter.values).eql(null);

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

test('should update column options with filterType and values (selectAll case #1)', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const popup = cardView.getHeaderFilterPopup();
  const list = cardView.getHeaderFilterList();

  const okBtn = popup.getButton(0);
  const selectAllCheckbox = list.selectAll.element;
  const firstItem = list.getItem(2);
  const secondItem = list.getItem(3);

  await t.click(selectAllCheckbox)
    .click(firstItem.element)
    .click(secondItem.element)
    .click(okBtn.element);

  const columnOptions = await cardView.getColumnOption('A');

  await t
    .expect(columnOptions.headerFilter.filterType).eql('exclude')
    .expect(columnOptions.headerFilter.values).eql(['A_2', 'A_3']);

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

test('should apply filter from options (type: "include" by default)', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const list = cardView.getHeaderFilterList();

  const firstItem = list.getItem(0);
  const secondItem = list.getItem(1);
  const thirdItem = list.getItem(2);

  await t
    .expect(firstItem.checkBox.isChecked).ok()
    .expect(secondItem.checkBox.isChecked).ok()
    .expect(thirdItem.checkBox.isChecked)
    .notOk();

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  columns: [
    {
      dataField: 'A',
      headerFilter: {
        values: ['A_0', 'A_1'],
      },
    },
    'B',
    'C',
  ],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

test('should apply filter from options (type: "include")', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const list = cardView.getHeaderFilterList();

  const firstItem = list.getItem(0);
  const secondItem = list.getItem(1);
  const thirdItem = list.getItem(2);

  await t
    .expect(firstItem.checkBox.isChecked).ok()
    .expect(secondItem.checkBox.isChecked).ok()
    .expect(thirdItem.checkBox.isChecked)
    .notOk();

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  columns: [
    {
      dataField: 'A',
      headerFilter: {
        filterType: 'include',
        values: ['A_0', 'A_1'],
      },
    },
    'B',
    'C',
  ],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

test('should apply filter from options (type: "exclude")', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await t.expect(cardView.getHeaderFilterPopup().element.visible).notOk();

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const list = cardView.getHeaderFilterList();

  const firstItem = list.getItem(0);
  const secondItem = list.getItem(1);
  const thirdItem = list.getItem(2);

  await t
    .expect(firstItem.checkBox.isChecked).ok()
    .expect(secondItem.checkBox.isChecked).ok()
    .expect(thirdItem.checkBox.isChecked)
    .notOk();

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  columns: [
    {
      dataField: 'A',
      headerFilter: {
        filterType: 'exclude',
        values: ['A_2', 'A_3', 'A_4'],
      },
    },
    'B',
    'C',
  ],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

test('should not update column options if popup cancel btn clicked', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const popup = cardView.getHeaderFilterPopup();
  const list = cardView.getHeaderFilterList();

  const cancelBtn = popup.getButton(1);
  const firstItem = list.getItem(0);
  const secondItem = list.getItem(1);

  await t
    .click(firstItem.element)
    .click(secondItem.element)
    .click(cancelBtn.element);

  const columnOptions = await cardView.getColumnOption('A');

  await t
    .expect(columnOptions.headerFilter.filterType).eql(undefined)
    .expect(columnOptions.headerFilter.values).eql(['A_4']);

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  columns: [
    {
      dataField: 'A',
      headerFilter: {
        values: ['A_4'],
      },
    },
    'B',
    'C',
  ],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

test('should support custom translations', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const popup = cardView.getHeaderFilterPopup();
  const list = cardView.getHeaderFilterList();
  const doneBtn = popup.getButton(0);
  const closeBtn = popup.getButton(1);
  const firstItem = list.getItem(0);

  await t.expect(doneBtn.text)
    .eql('TEST_OK')
    .expect(closeBtn.text)
    .eql('TEST_CANCEL')
    .expect(firstItem.text)
    .eql('TEST_EMPTY');

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  columns: [
    {
      dataField: 'A',
      calculateCellValue: () => undefined,
    },
    'B',
    'C',
  ],
  headerFilter: {
    visible: true,
    texts: {
      ok: 'TEST_OK',
      cancel: 'TEST_CANCEL',
      emptyValue: 'TEST_EMPTY',
    },
  },
  height: 600,
}));
