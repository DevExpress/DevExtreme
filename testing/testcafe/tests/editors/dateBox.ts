import url from '../../helpers/getPageUrl';
import DateBox from '../../model/dateBox';
import asyncForEach from '../../helpers/asyncForEach';

fixture`DateBox`
  .page(url(__dirname, './pages/T948310.html'));

const TIME_TO_WAIT = 1500;
const ITEM_HEIGHT = 40;

[[11, 12, 1925], [10, 23, 2001]].forEach(([month, day, year]) => {
  test(`Rollers should be scrolled correctly when value is changed to ${day}/${month}/${year} using kbn and valueChangeEvent=keyup (T948310)`, async (t) => {
    const dateBox = new DateBox('#dateBox');
    const { dropDownEditorButton } = dateBox;

    await t
      .click(dropDownEditorButton)
      .wait(TIME_TO_WAIT)
      .click(DateBox.getDoneButton())
      .wait(TIME_TO_WAIT);

    await t
      .typeText(dateBox.input, `${month}${day}${year}`);

    await t
      .click(dropDownEditorButton)
      .wait(TIME_TO_WAIT);

    const views = {
      month: month - 1,
      day: day - 1,
      year: year - 1900,
    };
    await asyncForEach(Object.keys(views), async (viewName) => {
      const scrollTop = await DateBox.getRollerScrollTop(viewName);

      await t
        .expect(scrollTop)
        .eql(views[viewName] * ITEM_HEIGHT, `${viewName} view is scrolled correctly`);
    });
  });
});
