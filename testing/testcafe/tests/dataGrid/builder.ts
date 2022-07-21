import { Selector, ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import FilterBuilder from '../../model/filterBuilder';
import createWidget, { disposeWidgets } from '../../helpers/createWidget';

const scrollTo = ClientFunction((x, y) => {
  window.scrollTo(x, y);
});

fixture.disablePageReloads`Filter Builder`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => disposeWidgets());

test('Field menu should be opened on field click if window scroll exists (T852701)', async (t) => {
  const filterBuilder = new FilterBuilder('#container');
  const lastField = filterBuilder.getField(49);

  await scrollTo(0, 10000);
  await t.click(lastField.element);

  await t.expect(lastField.text).eql('Test 50');
  await t.expect(FilterBuilder.getPopupTreeView().visible).ok();
}).before(async () => {
  const filter = [] as any[];
  const fields = [] as any[];

  for (let i = 1; i <= 50; i += 1) {
    if (i > 1) {
      filter.push('or');
    }
    const name = `Test${i}`;
    filter.push([name, '=', 'Test']);
    fields.push({ dataField: name });
  }

  return createWidget('dxFilterBuilder', {
    fields,
    value: filter,
  });
});

test('DateBox should not close on click (T1051831)', async (t) => {
  await t
    .click(Selector('.dx-filterbuilder-item-value-text'))
    .click(Selector('.dx-datebox'))
    .click(Selector('.dx-popup-done'));

  const overlay = Selector('.dx-overlay-content');

  await t.expect(overlay.exists).ok();
}).before(async () => createWidget('dxFilterBuilder', {
  fields: [{
    dataField: 'datetime',
    dataType: 'datetime',
    editorOptions: {
      pickerType: 'rollers',
    },
  }],
  value: ['datetime', '=', new Date()],
}));
