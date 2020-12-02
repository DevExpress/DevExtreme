import url from '../../helpers/getPageUrl';
import SelectBox from '../../model/selectBox';

fixture`SelectBox`
  .page(url(__dirname, './pages/selectBox.html'));

const pureClick = async (t, selector): Promise<void> => {
  await t
    .click(selector.element)
    .wait(500);
};

const purePressKey = async (t, key): Promise<void> => {
  await t
    .pressKey(key)
    .wait(500);
};

test('Click on action button should correctly work with SelectBox containing the field template (T811890)', async (t) => {
  const selectBox = new SelectBox('#editor');

  await pureClick(t, selectBox);
  await purePressKey(t, 'alt+up');
  await t
    .expect(selectBox.isFocused).ok()
    .expect(await selectBox.isOpened())
    .notOk();

  const actionButton = await selectBox.getButton(0);
  await pureClick(t, actionButton);
  await t
    .expect(selectBox.isFocused).ok()
    .expect(selectBox.value)
    .eql('item2');
});

test('Click on action button after typing should correctly work with SelectBox containing the field template (T811890)', async (t) => {
  const selectBox = new SelectBox('#editor');

  await pureClick(t, selectBox);
  await purePressKey(t, 'alt+up');
  await t
    .expect(selectBox.isFocused).ok()
    .expect(await selectBox.isOpened())
    .notOk();

  const actionButton = await selectBox.getButton(0);

  await t
    .typeText(selectBox.input, 'tt');
  await pureClick(t, actionButton);
  await t
    .expect(selectBox.isFocused).ok()
    .expect(selectBox.value)
    .eql('item2');
});

fixture`SelectBox as Toolbar item`
  .page(url(__dirname, './pages/t949859.html'));

test('SelectBox should correctly render his buttons when editor rendered as Toolbar item with fieldTemplate(T949859)', async (t) => {
  const selectBox = new SelectBox('#editor');
  const actionButton = await selectBox.getButton(0);

  await t
    .expect(actionButton.getText().innerText)
    .eql('test');
});
