import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import FilterBuilder from '../../model/filterBuilder';

const scrollTo = ClientFunction((x, y) => {
  window.scrollTo(x, y);
});

fixture`Filter Builder with scroll`
  .page(url(__dirname, './pages/T852701.html'));

test('Field menu should be opened on field click if window scroll exists (T852701)', async (t) => {
  const filterBuilder = new FilterBuilder('#filter-builder');
  const lastField = filterBuilder.getField(49);

  await scrollTo(0, 10000);
  await t.click(lastField.element);

  await t.expect(lastField.text).eql('Test 50');
  await t.expect(FilterBuilder.getPopupTreeView().visible).ok();
});
