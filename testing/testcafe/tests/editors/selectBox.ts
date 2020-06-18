import url from '../../helpers/getPageUrl';
import SelectBox from '../../model/selectBox';

fixture `SelectBox`
    .page(url(__dirname, './pages/selectBox.html'));

test('Click on action button should correctly work with SelectBox containing the field template (T811890)', async (t) => {
    const selectBox = new SelectBox('#editor');

    await t
        .click(selectBox.element)
        .pressKey('alt+up')
        .expect(selectBox.isFocused).ok()
        .expect(selectBox.opened).notOk();

    const actionButton = await selectBox.getButton(0);

    await t
        .click(actionButton.element)
        .expect(selectBox.isFocused).ok()
        .expect(selectBox.value).eql("item2");
});


test('Click on action button after typing should correctly work with SelectBox containing the field template (T811890)', async (t) => {
    const selectBox = new SelectBox('#editor');

    await t
        .click(selectBox.element)
        .pressKey('alt+up')
        .expect(selectBox.isFocused).ok()
        .expect(selectBox.opened).notOk();

    const actionButton = await selectBox.getButton(0);

    await t
        .typeText(selectBox.input, "tt")
        .click(actionButton.element)
        .expect(selectBox.isFocused).ok()
        .expect(selectBox.value).eql("item2");
});
