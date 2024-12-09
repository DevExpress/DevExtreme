/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/init-declarations */
import {
  beforeEach,
  describe, expect, it, jest,
} from '@jest/globals';
import { Component } from '@js/core/component';

import { OptionsController } from './options_controller_base';

interface Options {
  value?: string;

  objectValue?: {
    nestedValue?: string;
  };

  onOptionChanged?: () => void;
}

const onOptionChanged = jest.fn();
let component: Component<Options>;
let optionsController: OptionsController<Options>;

beforeEach(() => {
  component = new Component<Options>({
    value: 'initialValue',
    objectValue: { nestedValue: 'nestedInitialValue' },
    onOptionChanged,
  });
  optionsController = new OptionsController<Options>(component);
  onOptionChanged.mockReset();
});

describe('oneWay', () => {
  describe('plain', () => {
    it('should have initial value', () => {
      const value = optionsController.oneWay('value');
      expect(value.unreactive_get()).toBe('initialValue');
    });

    it('should update on options changed', () => {
      const value = optionsController.oneWay('value');
      const fn = jest.fn();

      value.subscribe(fn);

      component.option('value', 'newValue');
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith('newValue');
    });
  });

  describe('nested', () => {
    it('should have initial value', () => {
      const a = optionsController.oneWay('objectValue.nestedValue');
      expect(a.unreactive_get()).toBe('nestedInitialValue');
    });
  });
});

describe('twoWay', () => {
  it('should have initial value', () => {
    const value = optionsController.twoWay('value');
    expect(value.unreactive_get()).toBe('initialValue');
  });

  it('should update on options changed', () => {
    const value = optionsController.twoWay('value');
    const fn = jest.fn();

    value.subscribe(fn);

    component.option('value', 'newValue');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('newValue');
  });

  it('should return new value after update', () => {
    const value = optionsController.twoWay('value');
    value.update('newValue');

    expect(value.unreactive_get()).toBe('newValue');
  });

  it('should call optionChanged on update', () => {
    const value = optionsController.twoWay('value');
    value.update('newValue');

    expect(onOptionChanged).toHaveBeenCalledTimes(1);
    expect(onOptionChanged).toHaveBeenCalledWith({
      component,
      fullName: 'value',
      name: 'value',
      previousValue: 'initialValue',
      value: 'newValue',
    });
  });
});
