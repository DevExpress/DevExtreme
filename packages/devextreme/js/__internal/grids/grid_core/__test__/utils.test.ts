// eslint-disable-next-line forbidden-imports/no-restricted-imports
import { popupUtils } from '../m_utils';

describe('utils', () => {
  test('done button should be return valid obj', () => {
    const result = popupUtils.createDoneButton({});

    const expected = {
      location: 'after',
      shortcut: 'done',
      toolbar: 'bottom',
      options: {},
    };

    expect(result).toEqual(expected);
  });
  test('cancel button should be return valid obj', () => {
    const result = popupUtils.createCancelButton({});

    const expected = {
      location: 'after',
      shortcut: 'cancel',
      toolbar: 'bottom',
      options: {},
    };

    expect(result).toEqual(expected);
  });
});
