import FilterBuilder from 'devextreme-testcafe-models/filterBuilder';
import url from '../../../helpers/getPageUrl';

fixture`XSS`
  .page('about:blank')
  .beforeEach(async (t) => {
    await t
      .setNativeDialogHandler((type) => {
        if (type === 'alert') {
          throw Error('XSS alert was invoked!');
        }
      })
      .navigateTo(url(__dirname, '../security/pages/XSS.html'));
  })
  .afterEach(async (t) => {
    await t.navigateTo(url(__dirname, '../../container.html'));
  });

test('The XSS script does not run when the markup has been replaced with text', async (t) => {
  const filterBuilder = new FilterBuilder('#filter-builder');
  const group = filterBuilder.getField(0, 'groupOperation');

  await t
    .click(group.element)
    .expect(FilterBuilder.getPopupTreeView().visible).ok()
    .click(FilterBuilder.getPopupTreeViewNode())
    .expect(true)
    .ok();
});
