import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/drop_down_button';
import DropDownButton from '@js/ui/drop_down_button';

import { DropDownButtonModel } from '../drop_down_editor/__tests__/__mock__/model/drop_down_button';

const HINT = 'Exporting/Printing';

const instances: DropDownButton[] = [];

const createDropDownButton = (
  options: Partial<Properties> = {},
): { instance: DropDownButton; model: DropDownButtonModel } => {
  const $element = $('<div>').appendTo(document.body);

  const instance = new DropDownButton($element.get(0) as HTMLElement, options);

  instances.push(instance);

  return { instance, model: new DropDownButtonModel($element.get(0) as HTMLElement) };
};

describe('DropDownButton', () => {
  afterEach(() => {
    instances.forEach((instance) => instance.dispose());
    instances.length = 0;
    document.body.innerHTML = '';
  });

  describe('action button aria-label (T1337649)', () => {
    it('should be taken from the hint when the text is empty', () => {
      const { model } = createDropDownButton({ icon: 'export', hint: HINT });

      expect(model.getButtonElement()?.getAttribute('aria-label')).toBe(HINT);
    });

    it('should stay "dropdownbutton" when the hint is an empty string', () => {
      const { model } = createDropDownButton({ icon: 'export', hint: '' });

      expect(model.getButtonElement()?.getAttribute('aria-label')).toBe('dropdownbutton');
    });

    it('should stay "dropdownbutton" when the hint contains only spaces', () => {
      const { model } = createDropDownButton({ icon: 'export', hint: '   ' });

      expect(model.getButtonElement()?.getAttribute('aria-label')).toBe('dropdownbutton');
    });

    it('should stay the hint while the drop-down list is opened and after it is closed', async () => {
      const { instance, model } = createDropDownButton({ icon: 'export', hint: HINT });

      await instance.open();

      expect(model.getButtonElement()?.getAttribute('aria-expanded')).toBe('true');
      expect(model.getButtonElement()?.getAttribute('aria-label')).toBe(HINT);

      await instance.close();

      expect(model.getButtonElement()?.getAttribute('aria-expanded')).toBe('false');
      expect(model.getButtonElement()?.getAttribute('aria-label')).toBe(HINT);
    });

    it('should follow a hint change at runtime', () => {
      const { instance, model } = createDropDownButton({ icon: 'export', hint: HINT });

      instance.option('hint', 'Print or export');

      expect(model.getButtonElement()?.getAttribute('aria-label')).toBe('Print or export');
    });

    it('should follow a hint change while the drop-down list is opened and keep it expanded', async () => {
      const { instance, model } = createDropDownButton({ icon: 'export', hint: HINT });

      await instance.open();

      expect(model.getButtonElement()?.getAttribute('aria-expanded')).toBe('true');

      instance.option('hint', 'Print or export');

      expect(model.getButtonElement()?.getAttribute('aria-label')).toBe('Print or export');
      expect(model.getButtonElement()?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should be the visible text when both the text and the hint are set', () => {
      const { model } = createDropDownButton({ icon: 'export', text: 'Export', hint: HINT });

      expect(model.getButtonElement()?.getAttribute('aria-label')).toBe('Export');
    });
  });
});
