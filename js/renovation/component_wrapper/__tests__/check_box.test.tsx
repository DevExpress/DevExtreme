import each from 'jest-each';
import CheckBox from '../check_box';

describe('Accessibility', () => {
  each([
    { ariaName: 'id', ariaValue: 'someID', expectedAttributeName: 'id' },
    { ariaName: 'role', ariaValue: 'someRole', expectedAttributeName: 'role' },
    { ariaName: 'required', ariaValue: 'true', expectedAttributeName: 'aria-required' },
    { ariaName: 'labeledby', ariaValue: 'some text', expectedAttributeName: 'aria-labeledby' },
    { ariaName: 'describedby', ariaValue: 'some new text', expectedAttributeName: 'aria-describedby' },
  ]).describe('testConfig: %o', (testConfig) => {
    it('setAria', () => {
      // eslint-disable-next-line
      CheckBox.prototype._getDefaultOptions = jest.fn();
      CheckBox.prototype.endUpdate = jest.fn();

      const container = document.createElement('div');
      const instance = new CheckBox(container);

      instance.setAria(testConfig.ariaName, testConfig.ariaValue);
      expect(container.getAttribute(testConfig.expectedAttributeName))
        .toEqual(testConfig.ariaValue);
    });
  });
});
