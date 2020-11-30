import url from '../../helpers/getPageUrl';
import DateBox from '../../model/dateBox';
import asyncForEach from '../../helpers/asyncForEach';

fixture`DateBox`
  .page(url(__dirname, './pages/T948310.html'));

const TIME_TO_WAIT = 501;
const ITEM_HEIGHT = 40;

const getViews = (): {
  day: number;
  month: number;
  year: number;
} => {
  const today = new Date();
  today.setMonth(today.getMonth() - 1);
  today.setDate(today.getDate() - 1);
  today.setFullYear(today.getFullYear() - 1);

  return {
    day: today.getDate() - 1,
    month: today.getMonth(),
    year: today.getFullYear() - 1900,
  };
};

test('Rollers should be scrolled correctly when value is changed using kbn and valueChangeEvent=keyup (T948310)', async (t) => {
  const dateBox = new DateBox('#dateBox');
  const { dropDownEditorButton } = dateBox;

  await t
    .click(dropDownEditorButton)
    .wait(TIME_TO_WAIT)
    .click(DateBox.getDoneButton())
    .wait(TIME_TO_WAIT);

  await t
    .pressKey('down')
    .pressKey('right')
    .pressKey('down')
    .pressKey('right')
    .pressKey('down');

  await t
    .click(dropDownEditorButton)
    .wait(TIME_TO_WAIT);

  const views = getViews();
  await asyncForEach(Object.keys(views), async (viewName) => {
    const scrollTop = await DateBox.getRollerScrollTop(viewName);
    await t
      .expect(scrollTop)
      .eql(views[viewName] * ITEM_HEIGHT);
  });
});
