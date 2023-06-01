import { shallow, ShallowWrapper } from 'enzyme';
import { Button } from '../../../../button';
import { viewFunction } from '../delete_button';

describe('Delete button', () => {
  describe('Render', () => {
    const render = (): ShallowWrapper => shallow(viewFunction());

    it('it should have correct render', () => {
      const buttonContainer = render();
      const button = buttonContainer.childAt(0);

      expect(buttonContainer.is('div'))
        .toBe(true);

      expect(buttonContainer.hasClass('dx-tooltip-appointment-item-delete-button-container'))
        .toBe(true);

      expect(button.is(Button))
        .toBe(true);
    });
  });
});
