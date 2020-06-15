import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import DropDownButton from '../../model/dropDownButton';

fixture `Drop Down Button`
    .page(url(__dirname, './pages/t817436.html'));

test('Item collection should be updated after direct option changing (T817436)', async (t) => {
    const dropDownButton1 = new DropDownButton('#drop-down-button1');
    const dropDownButton2 = new DropDownButton('#drop-down-button2');
    const disableFirstItems = Selector('#disable');

    await t.click(dropDownButton1.element)
    const list1 = await dropDownButton1.getList();
    await t.click(dropDownButton2.element);
    const list2 = await dropDownButton2.getList();

    await t
        .expect(list1.getItem().isDisabled).notOk()
        .expect(list2.getItem().isDisabled).notOk()
        .click(disableFirstItems)

        .click(dropDownButton1.element)
        .expect(list1.getItem().isDisabled).ok()
        .click(dropDownButton2.element)
        .expect(list2.getItem().isDisabled).ok();
});
