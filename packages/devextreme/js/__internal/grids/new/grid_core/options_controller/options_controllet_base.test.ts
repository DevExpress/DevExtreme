/* eslint-disable spellcheck/spell-checker */
import { Component } from '@js/core/component';

import { OptionsController } from './options_controller_base';

interface Options {
  value?: string;

  objectValue?: {
    nestedValue?: string;
  };
}

describe('oneWay', () => {
  const component = new Component<Options>({ value: 'initial', objectValue: { nestedValue: 'nestedInitial' } });
  const optionsController = new OptionsController<Options>(component);

  describe('plain', () => {
    it('should have initial value', () => {
      const value = optionsController.oneWay('value');
      expect(value.unreactive_get()).toBe('initial');
    });

    it('should update on options changed', () => {
      const value = optionsController.oneWay('value');
      const fn = jest.fn();

      value.subscribe(fn);

      component.option('value', 'updated');
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith('updated');
    });
  });

  describe('nested', () => {
    it('should have initial value', () => {
      const a = optionsController.oneWay('objectValue.nestedValue');
      expect(a.unreactive_get()).toBe('nestedInitial');
    });
  });
});
