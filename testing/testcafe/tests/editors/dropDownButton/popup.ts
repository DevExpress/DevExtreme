import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import DropDownButton from '../../../model/dropDownButton';
import createWidget from '../../../helpers/createWidget';

fixture`Drop Down Button's Popup`
  .page(url(__dirname, '../../container.html'));

test('Popup should have correct position when DropDownButton is placed in the right bottom(T1034931)', async (t) => {
  const dropDownButton = new DropDownButton('#container');
  const dropDownButtonRect = {
    top: await dropDownButton.element.getBoundingClientRectProperty('top'),
    left: await dropDownButton.element.getBoundingClientRectProperty('left'),
  };

  const popupContent = Selector('.dx-overlay-content');
  const popupContentRect = {
    bottom: await popupContent.getBoundingClientRectProperty('bottom'),
    left: await popupContent.getBoundingClientRectProperty('left'),
  };

  await t
    .expect(Math.abs(dropDownButtonRect.left - popupContentRect.left))
    .lt(1)
    .expect(Math.abs(dropDownButtonRect.left - popupContentRect.left))
    .lt(1);
}).before(async () => createWidget('dxDropDownButton', {
  items: [1, 2, 3, 4, 5, 6, 7],
  elementAttr: { style: 'position: absolute; right: 10px; bottom: 10px;' },
  opened: true,
}));
