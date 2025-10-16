import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`CardView - ColumnChooser.Functional`
  .page(url(__dirname, '../../container.html'));

function testsFactory(testModel: {
  name: string;
  hideFirstColumn: (t: TestController, cardView: CardView) => Promise<void>;
  showFirstColumn: (t: TestController, cardView: CardView) => Promise<void>;
  assertFirstColumnVisible: (t: TestController, cardView: CardView) => Promise<void>;
  assertFirstColumnHidden: (t: TestController, cardView: CardView) => Promise<void>;
  config: any; // TODO: add typing
}) {
  test(`column chooser in ${testModel.name} mode should work after multiple hide/show actions`, async (t) => {
    const cardView = new CardView('#container');

    await cardView.apiShowColumnChooser();

    await testModel.hideFirstColumn(t, cardView);
    await testModel.assertFirstColumnHidden(t, cardView);

    await testModel.showFirstColumn(t, cardView);

    await testModel.assertFirstColumnVisible(t, cardView);

    await testModel.hideFirstColumn(t, cardView);
    await testModel.assertFirstColumnHidden(t, cardView);

    await testModel.showFirstColumn(t, cardView);
    await testModel.assertFirstColumnVisible(t, cardView);
  }).before(async () => createWidget('dxCardView', {
    dataSource: [
      { a: 1, b: 2, c: 3 },
      { a: 1, b: 2, c: 3 },
      { a: 1, b: 2, c: 3 },
    ],
    columns: [
      'a', 'b', 'c',
    ],
    ...testModel.config,
  }));
}

testsFactory({
  name: 'select',
  config: {
    columnChooser: {
      enabled: true,
      mode: 'select',
    },
  },
  async hideFirstColumn(t: TestController, cardView: CardView) {
    await t.click(
      cardView.getColumnChooser().getCheckbox(0),
    );
  },
  async showFirstColumn(t: TestController, cardView: CardView) {
    await t.click(
      cardView.getColumnChooser().getCheckbox(0),
    );
  },
  async assertFirstColumnVisible(t: TestController, cardView: CardView) {
    await t.expect(cardView.getColumnChooser().getColumnsCount()).eql(3);

    await t.expect(
      cardView.getColumnChooser().isCheckboxChecked(0),
    ).ok();
    await t.expect(
      cardView.getColumnChooser().isCheckboxChecked(1),
    ).ok();
    await t.expect(
      cardView.getColumnChooser().isCheckboxChecked(2),
    ).ok();
  },
  async assertFirstColumnHidden(t: TestController, cardView: CardView) {
    await t.expect(cardView.getColumnChooser().getColumnsCount()).eql(3);

    await t.expect(
      cardView.getColumnChooser().isCheckboxChecked(0),
    ).notOk();
    await t.expect(
      cardView.getColumnChooser().isCheckboxChecked(1),
    ).ok();
    await t.expect(
      cardView.getColumnChooser().isCheckboxChecked(2),
    ).ok();
  },
});

testsFactory({
  name: 'dragAndDrop',
  config: {
    columnChooser: {
      enabled: true,
      mode: 'dragAndDrop',
    },
  },
  async hideFirstColumn(t: TestController, cardView: CardView) {
    await t.dragToElement(
      cardView.getHeaderPanel().getHeaderItem(0).element,
      cardView.getColumnChooser().content,
    );
  },
  async showFirstColumn(t: TestController, cardView: CardView) {
    await t.dragToElement(
      cardView.getColumnChooser().getColumn(0),
      cardView.getHeaderPanel().element,
    );
  },
  async assertFirstColumnVisible(t: TestController, cardView: CardView) {
    await t.expect(
      cardView.getHeaderPanel().getHeaderItemsCount(),
    ).eql(3);

    await t.expect(
      cardView.getHeaderPanel().getHeaderItem(0).element.textContent,
    ).eql('A');
    await t.expect(
      cardView.getHeaderPanel().getHeaderItem(1).element.textContent,
    ).eql('B');
    await t.expect(
      cardView.getHeaderPanel().getHeaderItem(2).element.textContent,
    ).eql('C');
  },
  async assertFirstColumnHidden(t: TestController, cardView: CardView) {
    await t.expect(
      cardView.getHeaderPanel().getHeaderItemsCount(),
    ).eql(2);

    await t.expect(
      cardView.getHeaderPanel().getHeaderItem(0).element.textContent,
    ).eql('B');
    await t.expect(
      cardView.getHeaderPanel().getHeaderItem(1).element.textContent,
    ).eql('C');

    await t.expect(
      cardView.getColumnChooser().getColumnsCount(),
    ).eql(1);

    await t.expect(
      cardView.getColumnChooser().getColumn(0).textContent,
    ).eql('A');
  },
});

test('ColumnChooser should receive and render custom texts', async (t) => {
  const cardView = new CardView('#container');

  const columnChooserBtn = cardView.getColumnChooserButton();
  await t.click(columnChooserBtn);
  const columnChooser = cardView.getColumnChooser();
  const title = columnChooser.getTitle();
  const emptyMessage = columnChooser.getEmptyMessage();
  const titleText = await title.innerText;
  const emptyMessageText = await emptyMessage.innerText;

  await t.expect(titleText).eql('customTitle');
  await t.expect(emptyMessageText).eql('customEmptyText');
}).before(async (t) => {
  await t.eval(() => {
    (window as any).DevExpress.localization.loadMessages({
      en: {
        'dxDataGrid-columnChooserTitle': 'customTitle',
        'dxDataGrid-columnChooserEmptyText': 'customEmptyText',
      },
    });
  });

  await createWidget('dxCardView', {
    dataSource: [],
    keyExpr: 'ID',
    cardsPerRow: 'auto',
    cardMinWidth: 300,
    columnChooser: {
      enabled: true,
      mode: 'dragAndDrop',
      height: '340px',
    },
    columns: [],
  });
}).after(async (t) => {
  await t.eval(() => location.reload());
});
