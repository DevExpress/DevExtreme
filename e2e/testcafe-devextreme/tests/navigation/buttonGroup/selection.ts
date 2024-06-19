import ButtonGroup from 'devextreme-testcafe-models/buttonGroup';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`ButtonGroup_Selection`
  .page(url(__dirname, '../../container.html'));

test('selected class should not be added to the button after hovering (T1222079)', async (t) => {
  const buttonGroup = new ButtonGroup('#container');

  await buttonGroup.option('disabled', false);

  await t
    .click(buttonGroup.getItem(1).element);

  await t
    .expect(buttonGroup.getItem(1).isSelected)
    .ok()
    .expect(buttonGroup.isItemSelected(1))
    .ok();

  await t
    .hover(buttonGroup.getItem(0).element);

  await t
    .expect(buttonGroup.getItem(0).isSelected)
    .notOk()
    .expect(buttonGroup.isItemSelected(0))
    .notOk();
}).before(async () => createWidget('dxButtonGroup', {
  items: [
    { text: 'Button_1' },
    { text: 'Button_2' },
  ],
  selectedItemKeys: ['Button_1'],
  disabled: true,
}));
