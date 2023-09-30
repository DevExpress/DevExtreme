// eslint-disable-next-line forbidden-imports/no-restricted-imports
import { popupUtils } from '../m_utils';

describe('utils', () => {
  describe('popup dialogs', () => {
    test('done button should be have shortcut=done', () => {
      const result = popupUtils.createDoneButton({});
      expect(result).toHaveProperty('shortcut', 'done');
    });
    test('cancel button should be have shortcut=cancel', () => {
      const result = popupUtils.createCancelButton({});
      expect(result).toHaveProperty('shortcut', 'cancel');
    });
  });
});
