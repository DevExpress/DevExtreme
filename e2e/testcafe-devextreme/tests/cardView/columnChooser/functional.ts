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

    await t.debug();

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
    await t.expect(
      cardView.getColumnChooser().isCheckboxChecked(0),
    ).ok();
  },
  async assertFirstColumnHidden(t: TestController, cardView: CardView) {
    await t.expect(
      cardView.getColumnChooser().isCheckboxChecked(0),
    ).notOk();
  },
});

// TODO: unskip
/*
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
      cardView.getColumnChooser().element,
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
      cardView.getHeaderPanel().getHeaderItem(0).element.count,
    ).eql(1);
    await t.expect(
      cardView.getColumnChooser().getColumn(0).count,
    ).eql(0);
  },
  async assertFirstColumnHidden(t: TestController, cardView: CardView) {
    await t.expect(
      cardView.getHeaderPanel().getHeaderItem(0).element.count,
    ).eql(0);
    await t.expect(
      cardView.getColumnChooser().getColumn(0).count,
    ).eql(1);
  },
});
*/
