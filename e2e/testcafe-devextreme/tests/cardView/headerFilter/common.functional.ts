import CardView from 'devextreme-testcafe-models/cardView';
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
