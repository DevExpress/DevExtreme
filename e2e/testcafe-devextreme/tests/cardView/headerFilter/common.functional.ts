import CardView from 'devextreme-testcafe-models/cardView';
import FilterBuilder from 'devextreme-testcafe-models/filterBuilder';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { baseConfig } from './helpers/baseConfig';

fixture.disablePageReloads`HeaderFilter.Common.Functional`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

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
      calculateFieldValue: () => undefined,
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

test('Filtering different data types', async (t) => {
  const cardView = new CardView('#container');
  const headerPanel = cardView.getHeaderPanel();

  const list = cardView.getHeaderFilterList();
  const firstItem = list.getItem(0);

  const treeView = cardView.getHeaderFilterTreeView();

  const popup = cardView.getHeaderFilterPopup();
  const doneBtn = popup.getButton(0);

  // Number type
  await t
    .click(headerPanel.getHeaderItem(0).getFilterIcon())
    .click(firstItem.element)
    .click(doneBtn.element)
    .expect(cardView.getCards().count)
    .eql(1)
    .expect(cardView.getCard(0).getFieldValueCell('Id').textContent)
    .eql('1');
  await cardView.apiClearFilter();

  // String type
  await t
    .click(headerPanel.getHeaderItem(1).getFilterIcon())
    .click(firstItem.element)
    .click(doneBtn.element)
    .expect(cardView.getCards().count)
    .eql(3)
    .expect(cardView.getCard(0).getFieldValueCell('Id').textContent)
    .eql('1')
    .expect(cardView.getCard(1).getFieldValueCell('Id').textContent)
    .eql('3')
    .expect(cardView.getCard(2).getFieldValueCell('Id').textContent)
    .eql('4');
  await cardView.apiClearFilter();

  // Date type
  await t
    .click(headerPanel.getHeaderItem(4).getFilterIcon())
    .click(treeView.getNode(0).getExpandButton())
    .click(treeView.getNode(1).getExpandButton())
    .click(treeView.getNode(2).getCheckBox().element)
    .click(doneBtn.element)
    .expect(cardView.getCards().count)
    .eql(1)
    .expect(cardView.getCard(0).getFieldValueCell('Id').textContent)
    .eql('2');
  await cardView.apiClearFilter();

  // Boolean type
  await t
    .click(headerPanel.getHeaderItem(5).getFilterIcon())
    .click(firstItem.element)
    .click(doneBtn.element)
    .expect(cardView.getCards().count)
    .eql(2)
    .expect(cardView.getCard(0).getFieldValueCell('Id').textContent)
    .eql('2')
    .expect(cardView.getCard(1).getFieldValueCell('Id').textContent)
    .eql('4');
  await cardView.apiClearFilter();
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      columns: [
        {
          dataField: 'id',
          dataType: 'number',
        },
        {
          dataField: 'title',
        },
        {
          dataField: 'name',
        },
        {
          dataField: 'lastName',
        },
        {
          dataField: 'birthDate',
          dataType: 'date',
          groupInterval: 'day',
        },
        {
          dataField: 'hasOrders',
          dataType: 'boolean',
        },
      ],
    },
  });
});

test('Should apply filter to values in another column', async (t) => {
  const cardView = new CardView('#container');

  const popup = cardView.getHeaderFilterPopup();
  const doneBtn = popup.getButton(0);
  const cancelBtn = popup.getButton(1);

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon())
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(4)
    .click(cancelBtn.element);

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(1).getFilterIcon())
    .click(cardView.getHeaderFilterList().getItem(0).element)
    .click(doneBtn.element)

    .expect(cardView.getCards().count)
    .eql(3);

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon())
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(3);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
  });
});

test('Filter values should not filter themselves', async (t) => {
  const cardView = new CardView('#container');

  const popup = cardView.getHeaderFilterPopup();
  const doneBtn = popup.getButton(0);
  const cancelBtn = popup.getButton(1);

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon())
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(4)
    .click(cancelBtn.element);

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(1).getFilterIcon())
    .click(cardView.getHeaderFilterList().getItem(0).element)
    .click(doneBtn.element)
    .expect(cardView.getCards().count)
    .eql(3);

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon())
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(3)
    .click(cardView.getHeaderFilterList().getItem(0).element)
    .click(doneBtn.element)
    .expect(cardView.getCards().count)
    .eql(1);

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon())
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(3);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
  });
});

test('Filter values should be filtered by SearchPanel', async (t) => {
  const cardView = new CardView('#container');

  const popup = cardView.getHeaderFilterPopup();
  const cancelBtn = popup.getButton(1);

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon())
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(4)
    .click(cancelBtn.element);

  await t
    .typeText(cardView.getSearchBox().getInput(), 'rt')
    .expect(cardView.getCards().count)
    .eql(2);

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon())
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(2)
    .expect(cardView.getHeaderFilterList().getItem(0).text)
    .eql('1')
    .expect(cardView.getHeaderFilterList().getItem(1).text)
    .eql('3');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      searchPanel: {
        visible: true,
      },
    },
  });
});

test('The item\'s selection state should be correct if a custom data source is specified', async (t) => {
  // arrange
  const cardView = new CardView('#container');

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon());

  const firstHeaderFilterItem = cardView.getHeaderFilterList().getItem(0);

  // assert
  await t
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(2)
    .expect(firstHeaderFilterItem.text)
    .eql('Test1')
    .expect(firstHeaderFilterItem.isSelected)
    .ok();
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    columns: [
      {
        dataField: 'id',
        filterValues: [1],
        headerFilter: {
          dataSource: [{
            text: 'Test1',
            value: 1,
          }, {
            text: 'Test2',
            value: 2,
          }],
        },
      },
      {
        dataField: 'title',
      },
      {
        dataField: 'name',
      },
      {
        dataField: 'lastName',
      },
    ],
  });
});

test('The item\'s selection state should be correct after search', async (t) => {
  // arrange
  const cardView = new CardView('#container');

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon());

  const headerFilterList = cardView.getHeaderFilterList();

  // assert
  await t
    .expect(headerFilterList.getItems().count)
    .eql(4);

  const firstHeaderFilterItem = headerFilterList.getItem(0);

  // act
  await t
    .click(firstHeaderFilterItem.element);

  // assert
  await t
    .expect(firstHeaderFilterItem.isSelected)
    .ok();

  // act
  await t
    .typeText(headerFilterList.searchInput, '1');

  // assert
  await t
    .expect(headerFilterList.getItems().count)
    .eql(1)
    .expect(headerFilterList.getItem(0).isSelected)
    .ok();
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    headerFilter: {
      visible: true,
      search: {
        enabled: true,
      },
    },
  });
});

test('The item\'s selection state should be correct after resetting the search', async (t) => {
  // arrange
  const cardView = new CardView('#container');

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon());

  const headerFilterList = cardView.getHeaderFilterList();

  // assert
  await t
    .expect(headerFilterList.getItems().count)
    .eql(4);

  // act
  await t
    .typeText(headerFilterList.searchInput, '1');

  // assert
  await t
    .expect(headerFilterList.getItems().count)
    .eql(1);

  const firstHeaderFilterItem = headerFilterList.getItem(0);

  // act
  await t
    .click(firstHeaderFilterItem.element);

  // assert
  await t
    .expect(firstHeaderFilterItem.isSelected)
    .ok();

  // act
  await t
    .click(headerFilterList.searchInput)
    .selectText(headerFilterList.searchInput)
    .pressKey('backspace');

  // assert
  await t
    .expect(headerFilterList.getItems().count)
    .eql(4)
    .expect(headerFilterList.getItem(0).isSelected)
    .ok();
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    headerFilter: {
      visible: true,
      search: {
        enabled: true,
      },
    },
  });
});

test('FilterBuilder should work with custom headerFilter data source', async (t) => {
  const cardView = new CardView('#container');
  const IS_ANY_OPERATION_ITEM_INDEX = 9;
  const ADD_CONDITION_ITEM_INDEX = 0;

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon());

  await t
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(3)
    .click(cardView.getHeaderFilterPopup().getOkButton().element);

  const filterBuilderPopup = await cardView.getFilterPanel().openFilterBuilderPopup(t);
  const filterBuilder = filterBuilderPopup.getFilterBuilder();
  await t
    .click(filterBuilder.getAddButton())
    .expect(FilterBuilder.getPopupTreeView().visible).ok()
    .click(FilterBuilder.getPopupTreeViewNode(ADD_CONDITION_ITEM_INDEX))
    .click(filterBuilder.getField(0, 'itemOperation').element)
    .click(FilterBuilder.getPopupTreeViewNode(IS_ANY_OPERATION_ITEM_INDEX))
    .click(filterBuilder.getField(0, 'itemValue').element)
    .click(cardView.getHeaderFilterList().getItem(1).element)
    .click(cardView.getHeaderFilterList().getItem(2).element)
    .click(cardView.getHeaderFilterPopup().getOkButton().element)
    .click(filterBuilderPopup.asPopup().getOkButton().element);

  await t
    .expect(cardView.getCards().count)
    .eql(2)
    .expect(cardView.getCard(0).getFieldValueCell('Id').textContent)
    .eql('2')
    .expect(cardView.getCard(1).getFieldValueCell('Id').textContent)
    .eql('3');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    columns: [
      {
        dataField: 'id',
        headerFilter: {
          dataSource: [
            { value: 1, text: '1' },
            { value: 2, text: '2' },
            { value: 3, text: '3' },
          ],
        },
      },
      {
        dataField: 'title',
      },
      {
        dataField: 'name',
      },
      {
        dataField: 'lastName',
      },
    ],
    filterPanel: { visible: true },
  });
});

test('Filtering should work when a custom data source is specified as an array of filter expressions', async (t) => {
  // arrange
  const cardView = new CardView('#container');

  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon());

  // assert
  await t
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(2);

  // act
  await t
    .click(cardView.getHeaderFilterList().getItem(0).element)
    .click(cardView.getHeaderFilterPopup().getOkButton().element);

  // assert
  await t
    .expect(cardView.getCards().count)
    .eql(1)
    .expect(cardView.apiGetCombinedFilter())
    .eql(['id', '=', 1]);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    remoteOperations: true, // NOTE: for more easy match of selector. If local, selector is func
    columns: [
      {
        dataField: 'id',
        headerFilter: {
          dataSource: [
            { value: ['id', '=', 1], text: '1' },
            { value: ['id', '=', 2], text: '2' },
          ],
        },
      },
      {
        dataField: 'title',
      },
      {
        dataField: 'name',
      },
      {
        dataField: 'lastName',
      },
    ],
  });
});

test('Filtering should work with computed column', async (t) => {
  const cardView = new CardView('#container');

  await t.click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon());

  await t
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(4);

  await t
    .click(cardView.getHeaderFilterList().getItem(0).element)
    .click(cardView.getHeaderFilterPopup().getOkButton().element);

  await t
    .expect(cardView.getCards().count)
    .eql(1)
    .expect(cardView.getCard(0).getFieldValueCell('Computed').textContent)
    .eql('str_0');

  await t.click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon());
  await t
    .click(cardView.getHeaderFilterList().getItem(2).element)
    .click(cardView.getHeaderFilterPopup().getOkButton().element);

  await t
    .expect(cardView.getCards().count)
    .eql(2)
    .expect(cardView.getCard(0).getFieldValueCell('Computed').textContent)
    .eql('str_0')
    .expect(cardView.getCard(1).getFieldValueCell('Computed').textContent)
    .eql('str_2');
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: [
      { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 },
    ],
    keyExpr: 'id',
    headerFilter: { visible: true },
    columns: [
      {
        caption: 'Computed',
        allowFiltering: true,
        calculateFieldValue: ({ id }) => `str_${id}`,
      },
    ],
  });
});

test('The item\'s selection state should be correct when a custom data source is specified as an array of filter expressions', async (t) => {
  // arrange
  const cardView = new CardView('#container');

  // assert
  await t
    .expect(cardView.getCards().count)
    .eql(1)
    .expect(cardView.apiGetCombinedFilter())
    .eql(['id', '=', 1]);

  // act
  await t
    .click(cardView.getHeaderPanel().getHeaderItem(0).getFilterIcon());

  const firstHeaderFilterItem = cardView.getHeaderFilterList().getItem(0);

  // assert
  await t
    .expect(cardView.getHeaderFilterList().getItems().count)
    .eql(2)
    .expect(firstHeaderFilterItem.text)
    .eql('1')
    .expect(firstHeaderFilterItem.isSelected)
    .ok();
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    remoteOperations: true, // NOTE: for more easy match of selector. If local, selector is func
    columns: [
      {
        dataField: 'id',
        filterValues: [['id', '=', 1]],
        headerFilter: {
          dataSource: [
            { value: ['id', '=', 1], text: '1' },
            { value: ['id', '=', 2], text: '2' },
          ],
        },
      },
      {
        dataField: 'title',
      },
      {
        dataField: 'name',
      },
      {
        dataField: 'lastName',
      },
    ],
  });
});
