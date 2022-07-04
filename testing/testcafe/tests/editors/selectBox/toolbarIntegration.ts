import url from '../../../helpers/getPageUrl';
import SelectBox from '../../../model/selectBox';
import createWidget from '../../../helpers/createWidget';

fixture`SelectBox as Toolbar item`
  .page(url(__dirname, '../../container.html'));

test('SelectBox should correctly render its buttons if editor is rendered as a Toolbar item with fieldTemplate (T949859)', async (t) => {
  const selectBox = new SelectBox('#editor');
  const actionButton = selectBox.getButton(0);

  await t
    .expect(actionButton.getText().innerText)
    .eql('test');
}).before(async () => createWidget('dxToolbar', {
  items: [
    {
      widget: 'dxSelectBox',
      options: {
        elementAttr: { id: 'editor' },
        buttons: [
          {
            name: 'test',
            options: {
              text: 'test',
            },
          },
        ],
        fieldTemplate: (_, wrapper) => {
          ($('<div>').appendTo(wrapper) as any).dxTextBox();
        },
        items: [1, 2, 3, 4],
      },
    },
  ],
}));
