import SelectBox from '../../model/selectBox';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';

fixture`HtmlEditor - formats`
  .page(url(__dirname, '../containerQuill.html'));

test('HtmlEditor should keep actual format after "enter" key pressed (T922236)', async (t) => {
  const selectBox = new SelectBox('.dx-font-format');

  await t
    .click(selectBox.element);

  const list = await selectBox.getList();

  await t.click(list.getItem().element);

  await t
    .expect(selectBox.value)
    .eql('Arial')
    .pressKey('k')
    .pressKey('enter')
    .expect(selectBox.value)
    .eql('Arial');
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 400,
    width: 200,
    toolbar: {
      items: [
        'bold',
        {
          name: 'font',
          acceptedValues: ['Arial', 'Terminal'],
        },
      ],
    },
  });
});
