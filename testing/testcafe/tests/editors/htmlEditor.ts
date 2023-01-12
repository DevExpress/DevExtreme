import { Selector } from 'testcafe';
import { createScreenshotsComparer } from '../../helpers/screenshot-comparer';
import SelectBox from '../../model/selectBox';
import url from '../../helpers/getPageUrl';

const pureClick = async (t, selector): Promise<void> => {
  await t
    .click(selector.element)
    .wait(500);
};

fixture`HtmlEditor`
  .page(url(__dirname, './pages/t1025549.html'));

[false, true].forEach((toolbar) => {
  const selector = toolbar ? '#htmleditor-toolbar' : '#htmleditor-simple';
  const clickTarget = toolbar ? '#htmleditor-toolbar .dx-bold-format' : '#htmleditor-simple';
  const baseScreenName = toolbar ? 'htmleditor-with-toolbar' : 'htmleditor-without-toolbar';

  test(`T1025549 - ${baseScreenName}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`${baseScreenName}.png`, selector))
      .ok()
      .click(Selector(clickTarget))
      .expect(await takeScreenshot(`${baseScreenName}-focused.png`, selector))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});

fixture`HtmlEditor - formats`
  .page(url(__dirname, './pages/t922236.html'));

test('HtmlEditor should keep actual format after "enter" key pressed (T922236)', async (t) => {
  const selectBox = new SelectBox('.dx-font-format');

  await pureClick(t, selectBox);

  const list = await selectBox.getList();

  await t.click(list.getItem().element);

  await t
    .expect(selectBox.value)
    .eql('Arial')
    .pressKey('k')
    .pressKey('enter')
    .expect(selectBox.value)
    .eql('Arial');
});
