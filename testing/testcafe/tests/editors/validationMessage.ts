import url from '../../helpers/getPageUrl';
import CheckBox from '../../model/checkBox';

fixture`ValidationMessage`
  .page(url(__dirname, './pages/T941581.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('ValidationMessage integrated in editor should not raise any errors when it is placed inside of form and has name "style"', async (t) => {
  const checkBox = new CheckBox('#checkBox');
  await t
    .click(checkBox.element)
    .click(checkBox.element)
    .expect(true).ok();
});
