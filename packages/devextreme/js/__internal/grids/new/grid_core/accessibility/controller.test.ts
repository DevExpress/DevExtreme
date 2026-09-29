import { describe, expect, it } from '@jest/globals';

import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { AccessibilityController } from './controller';

const setup = (config: Options = {}) => {
  const context = getContext(config);

  return {
    optionsController: context.get(OptionsControllerMock),
    accessibilityController: context.get(AccessibilityController),
  };
};

describe('AccessibilityController', () => {
  describe('componentStatus', () => {
    // The status is announced only after the description changes, so the effect tracking the
    // description is the only thing that can ever take the status out of its initial empty state.
    it('should report the description after a column is hidden', () => {
      const { optionsController, accessibilityController } = setup({
        dataSource: [{ a: 'a_0', b: 'b_0' }],
        columns: ['a', 'b'],
      });

      expect(accessibilityController.componentStatus.value).toBe('');

      optionsController.option('columns', ['a']);

      expect(accessibilityController.componentStatus.value)
        .toBe(accessibilityController.componentDescription.peek());
      expect(accessibilityController.componentStatus.value).not.toBe('');
    });
  });
});
