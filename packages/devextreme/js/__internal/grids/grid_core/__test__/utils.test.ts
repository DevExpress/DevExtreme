// eslint-disable-next-line forbidden-imports/no-restricted-imports
import { popupUtils } from '../m_utils';

describe('utils', () => {
  test('popup buttons', () => {
    const result = popupUtils.createDoneButton({});

    expect(result).toEqual({});
  });
});
