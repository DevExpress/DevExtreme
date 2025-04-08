/* eslint-disable spellcheck/spell-checker, @typescript-eslint/no-non-null-assertion */

import {
  beforeEach,
  describe, expect, it, jest,
} from '@jest/globals';

import { createComponentMock } from './component.mock';
import { OptionsController } from './options_controller_base';

const setup = <TOptions extends Record<string, any>>(
  options: TOptions,
  defaultOptions: TOptions,
) => {
  const onOptionChangedMock = jest.fn();

  const component = createComponentMock(options, defaultOptions);
  const optionsController = new OptionsController<TOptions>(component);

  return {
    component,
    optionsController,
    onOptionChangedMock,
  };
};

describe('oneWay', () => {
  interface PlainOptions {
    value?: string;
    optionalValue?: string;
  }

  interface ObjectOptions {
    nested?: {
      value?: string;
      optionalValue?: string;
    };
  }

  interface ArrayOptions {
    value?: string[];
    optionalValue?: string[];
  }

  interface FunctionOptions {
    value?: () => void;
    optionalValue?: () => void;
  }

  interface MixedOptions {
    value?: string | { valueA?: string; valueB?: string };
    optionalValue?: string | { valueA?: string; valueB?: string };
  }

  const plainOptions: PlainOptions = {
    value: 'ABC',
  };

  const defaultPlainOptions: PlainOptions = {
    value: 'default_ABC',
  };

  const nestedPlainOptions: ObjectOptions = {
    nested: {
      value: 'ABC',
    },
  };
  const defaultNestedPlainOptions: ObjectOptions = {
    nested: {
      value: 'default_ABC',
    },
  };

  const arrayOptions: ArrayOptions = {
    value: ['A', 'B', 'C'],
  };
  const defaultArrayOptions: ArrayOptions = {
    value: ['A_default', 'B_default'],
  };

  const functionOptions: FunctionOptions = {
    value: function fnValue() {},
  };
  const defaultFunctionOptions: FunctionOptions = {
    value: function defaultFnValue() {},
  };

  const mixedPlainOptions: MixedOptions = {
    value: 'default',
  };
  const mixedComplexOptions: MixedOptions = {
    value: { valueA: 'A', valueB: 'B' },
  };

  describe('initial values', () => {
    describe('plain options', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(plainOptions, defaultPlainOptions);

        const value = optionsController.oneWay('value');

        expect(value.unreactive_get()).toBe(plainOptions.value);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, defaultPlainOptions);

        const value = optionsController.oneWay('value');

        expect(value.unreactive_get()).toBe(defaultPlainOptions.value);
      });

      it('should have initial value same as passed in config if default not specified', () => {
        const optionalOptions = { optionalValue: 'ABC' };
        const { optionsController } = setup<PlainOptions>(optionalOptions, defaultPlainOptions);

        const value = optionsController.oneWay('optionalValue');

        expect(value.unreactive_get()).toBe(optionalOptions.optionalValue);
      });

      it('should have undefined value if options not passed with config and doesnt have default value', () => {
        const { optionsController } = setup<PlainOptions>(plainOptions, defaultPlainOptions);

        const value = optionsController.oneWay('optionalValue');

        expect(value.unreactive_get()).toBe(undefined);
      });
    });

    describe('object options child subscription', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(nestedPlainOptions, defaultNestedPlainOptions);

        const value = optionsController.oneWay('nested.value');

        expect(value.unreactive_get()).toBe(nestedPlainOptions.nested!.value);
      });

      it('should have initial default value if parent config option is undefined', () => {
        const { optionsController } = setup({}, defaultNestedPlainOptions);

        const value = optionsController.oneWay('nested.value');

        expect(value.unreactive_get()).toBe(defaultNestedPlainOptions.nested?.value);
      });

      it('should have initial default value if plain config option is undefined', () => {
        const { optionsController } = setup(
          { nested: { value: undefined } },
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.value');

        expect(value.unreactive_get()).toBe(defaultNestedPlainOptions.nested?.value);
      });

      it('should have initial value same as passed in config if default not specified', () => {
        const optionalOptions = { nested: { optionalValue: 'ABC' } };
        const { optionsController } = setup<ObjectOptions>(
          optionalOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('optionalValue');

        expect(value.unreactive_get()).toBe(defaultNestedPlainOptions.nested?.optionalValue);
      });

      it('should have undefined value if options not passed with config and doesnt have default value', () => {
        const { optionsController } = setup<ObjectOptions>(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.optionalValue');

        expect(value.unreactive_get()).toBe(undefined);
      });
    });

    describe('object options self subscription', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(nestedPlainOptions, defaultNestedPlainOptions);

        const value = optionsController.oneWay('nested');

        expect(value.unreactive_get()).toStrictEqual(nestedPlainOptions.nested);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, defaultNestedPlainOptions);

        const value = optionsController.oneWay('nested');

        expect(value.unreactive_get()).toStrictEqual(defaultNestedPlainOptions.nested);
      });

      it('should have initial default value if child config option is undefined', () => {
        const { optionsController } = setup(
          { nested: { value: undefined } },
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested');

        expect(value.unreactive_get()).toStrictEqual(defaultNestedPlainOptions.nested);
      });

      it('should merge passed optional values with default ones', () => {
        const optionalOptions = { nested: { optionalValue: 'ABC' } };
        const { optionsController } = setup<ObjectOptions>(
          optionalOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested');

        expect(value.unreactive_get()).toStrictEqual({
          ...defaultNestedPlainOptions.nested,
          ...optionalOptions.nested,
        });
      });
    });

    describe('array options', () => {
      // NOTE: We don't merge arrays with default values
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('value');

        expect(value.unreactive_get()).toStrictEqual(arrayOptions.value);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, defaultArrayOptions);

        const value = optionsController.oneWay('value');

        expect(value.unreactive_get()).toStrictEqual(defaultArrayOptions.value);
      });

      it('should have initial value same as passed in config if default not specified', () => {
        const optionalOptions = { optionalValue: ['A_optional', 'B_optional'] };
        const { optionsController } = setup<ArrayOptions>(optionalOptions, defaultArrayOptions);

        const value = optionsController.oneWay('optionalValue');

        expect(value.unreactive_get()).toStrictEqual(optionalOptions.optionalValue);
      });

      it('should have undefined value if options not passed with config and doesnt have default value', () => {
        const { optionsController } = setup<ArrayOptions>(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('optionalValue');

        expect(value.unreactive_get()).toBe(undefined);
      });
    });

    describe('function options', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(functionOptions, defaultFunctionOptions);

        const value = optionsController.oneWay('value');

        expect(value.unreactive_get()?.name).toBe(functionOptions.value?.name);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, defaultFunctionOptions);

        const value = optionsController.oneWay('value');

        expect(value.unreactive_get()?.name).toBe(defaultFunctionOptions.value?.name);
      });

      it('should have initial value same as passed in config if default not specified', () => {
        const optionalOptions = { optionalValue: function optionalFnValue() {} };
        const { optionsController } = setup<FunctionOptions>(
          optionalOptions,
          defaultFunctionOptions,
        );

        const value = optionsController.oneWay('optionalValue');

        expect(value.unreactive_get()?.name).toBe('optionalFnValue');
      });

      it('should have undefined value if options not passed with config and doesnt have default value', () => {
        const { optionsController } = setup<FunctionOptions>(
          functionOptions,
          defaultFunctionOptions,
        );

        const value = optionsController.oneWay('optionalValue');

        expect(value.unreactive_get()).toBe(undefined);
      });
    });

    describe('mixed options child subscription', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(mixedComplexOptions, mixedPlainOptions);

        const value = optionsController.oneWay('value.valueA');

        expect(value.unreactive_get()).toStrictEqual((mixedComplexOptions.value as any).valueA);
      });

      it('should have initial value undefined if parent is plain value', () => {
        const { optionsController } = setup(mixedPlainOptions, mixedComplexOptions);

        const value = optionsController.oneWay('value.valueA');

        expect(value.unreactive_get()).toBe(undefined);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, mixedComplexOptions);

        const value = optionsController.oneWay('value.valueA');

        expect(value.unreactive_get()).toBe((mixedComplexOptions.value as any).valueA);
      });
    });

    describe('mixed options self subscription', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(mixedComplexOptions, mixedPlainOptions);

        const value = optionsController.oneWay('value');

        expect(value.unreactive_get()).toStrictEqual(mixedComplexOptions.value);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, mixedPlainOptions);

        const value = optionsController.oneWay('value');

        expect(value.unreactive_get()).toBe(mixedPlainOptions.value);
      });
    });
  });

  describe('update values', () => {
    describe('plain options', () => {
      it('should update on option changed', () => {
        const { component, optionsController } = setup(plainOptions, defaultPlainOptions);

        const value = optionsController.oneWay('value');
        component.option('value', 'newValue');

        expect(value.unreactive_get()).toBe('newValue');
      });

      it('should update boolean plain option on option changed', () => {
        const { component, optionsController } = setup({}, { value: true });

        const value = optionsController.oneWay('value');
        component.option('value', false);

        expect(value.unreactive_get()).toBe(false);
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(plainOptions, defaultPlainOptions);

        const value = optionsController.oneWay('value');
        component.option('value', undefined);

        expect(value.unreactive_get()).toBe(defaultPlainOptions.value);
      });

      it('should update initial undefined value to updated value', () => {
        const { component, optionsController } = setup(plainOptions, defaultPlainOptions);

        const value = optionsController.oneWay('optionalValue');
        component.option('optionalValue', 'newValue');

        expect(value.unreactive_get()).toBe('newValue');
      });
    });

    describe('object options child subscription', () => {
      it('should update on option changed', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.value');
        component.option('nested.value', 'newValue');

        expect(value.unreactive_get()).toBe('newValue');
      });

      it('should update on parent option changed', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.value');
        component.option('nested', { value: 'newValue' });

        expect(value.unreactive_get()).toBe('newValue');
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.value');
        component.option('nested.value', undefined);

        expect(value.unreactive_get()).toBe(defaultNestedPlainOptions.nested?.value);
      });

      it('should update to default value if parent option updated to undefined', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.value');
        component.option('nested', undefined);

        expect(value.unreactive_get()).toBe(defaultNestedPlainOptions.nested?.value);
      });

      it('should update initial undefined value to updated value', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.optionalValue');
        component.option('nested.optionalValue', 'newValue');

        expect(value.unreactive_get()).toBe('newValue');
      });

      it('should update initial undefined value to updated value on parent option update', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.optionalValue');
        component.option('nested', { optionalValue: 'newValue' });

        expect(value.unreactive_get()).toBe('newValue');
      });
    });

    describe('object options self subscription', () => {
      it('should update on option changed', () => {
        const updatedOptions = { value: 'newValue', optionalValue: 'newValue_2' };
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested');
        component.option('nested', updatedOptions);

        expect(value.unreactive_get()).toStrictEqual(updatedOptions);
      });

      it('should update on child option changed', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested');
        component.option('nested.value', 'newValue');

        expect(value.unreactive_get()).toStrictEqual({ value: 'newValue' });
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested');
        component.option('nested', undefined);

        expect(value.unreactive_get()).toStrictEqual(defaultNestedPlainOptions.nested);
      });
    });

    describe('array options', () => {
      it('should update on whole array option changed', () => {
        const { component, optionsController } = setup(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('value');
        component.option('value', ['F', 'E']);

        expect(value.unreactive_get()).toStrictEqual(['F', 'E']);
      });

      it('should update on array element option changed', () => {
        const { component, optionsController } = setup(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('value');
        component.option('value[0]', 'F');

        expect(value.unreactive_get()).toStrictEqual(['F', 'B', 'C']);
      });

      it('should update on array element child option changed', () => {
        const { component, optionsController } = setup(
          { value: [{ A: 'A_0', B: 'B_0' }, { A: 'A_1', B: 'B_1' }] },
          {},
        );

        const value = optionsController.oneWay('value');
        component.option('value[0].A', 'F');

        expect(value.unreactive_get()).toStrictEqual([{ A: 'F', B: 'B_0' }, { A: 'A_1', B: 'B_1' }]);
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('value');
        component.option('value', undefined);

        expect(value.unreactive_get()).toStrictEqual(defaultArrayOptions.value);
      });

      it('should update initial undefined value to updated value', () => {
        const { component, optionsController } = setup(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('optionalValue');
        component.option('optionalValue', ['F', 'E']);

        expect(value.unreactive_get()).toStrictEqual(['F', 'E']);
      });
    });

    describe('function options', () => {
      it('should update on option changed', () => {
        const { component, optionsController } = setup(functionOptions, defaultFunctionOptions);

        const value = optionsController.oneWay('value');
        // eslint-disable-next-line prefer-arrow-callback
        component.option('value', function newFn() {});

        expect(value.unreactive_get()?.name).toBe('newFn');
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(functionOptions, defaultFunctionOptions);

        const value = optionsController.oneWay('value');
        component.option('value', undefined);

        expect(value.unreactive_get()?.name).toBe(defaultFunctionOptions.value?.name);
      });

      it('should update initial undefined value to updated value', () => {
        const { component, optionsController } = setup(functionOptions, defaultFunctionOptions);

        const value = optionsController.oneWay('optionalValue');
        // eslint-disable-next-line prefer-arrow-callback
        component.option('optionalValue', function newFn() {});

        expect(value.unreactive_get()?.name).toBe('newFn');
      });
    });

    describe('mixed options child subscription', () => {
      it('should update on option changed', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedPlainOptions,
        );

        const value = optionsController.oneWay('value.valueA');
        component.option('value.valueA', 'newValue');

        expect(value.unreactive_get()).toBe('newValue');
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedComplexOptions,
        );

        const value = optionsController.oneWay('value.valueA');
        component.option('value.valueA', undefined);

        expect(value.unreactive_get()).toBe((mixedComplexOptions.value as any)?.valueA);
      });

      it('should update to undefined if parent option update to plain one', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedPlainOptions,
        );

        const value = optionsController.oneWay('value.valueA');
        component.option('value', 'plain');

        expect(value.unreactive_get()).toBe(undefined);
      });

      it('should update to default value if parent updated to undefined', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedComplexOptions,
        );

        const value = optionsController.oneWay('value.valueA');
        component.option('value', undefined);

        expect(value.unreactive_get()).toBe((mixedComplexOptions.value as any)?.valueA);
      });

      it('should update to undefined if default value is plain', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedPlainOptions,
        );

        const value = optionsController.oneWay('value.valueA');
        component.option('value', undefined);

        expect(value.unreactive_get()).toBe(undefined);
      });
    });

    describe('mixed options self subscription', () => {
      it('should update on option changed', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedPlainOptions,
        );

        const value = optionsController.oneWay('value');
        component.option('value', { valueA: '1', valueB: '2' });

        expect(value.unreactive_get()).toStrictEqual({ valueA: '1', valueB: '2' });
      });

      it('should update on option changed to plain', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedPlainOptions,
        );

        const value = optionsController.oneWay('value');
        component.option('value', 'newValue');

        expect(value.unreactive_get()).toBe('newValue');
      });

      it('should update on child option changed', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedComplexOptions,
        );

        const value = optionsController.oneWay('value');
        component.option('value.valueA', 'newValue');

        expect(value.unreactive_get()).toStrictEqual({ valueA: 'newValue', valueB: 'B' });
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedPlainOptions,
        );

        const value = optionsController.oneWay('value');
        component.option('value', undefined);

        expect(value.unreactive_get()).toStrictEqual(mixedPlainOptions.value);
      });
    });
  });
});

describe('twoWay', () => {
  interface TestOptions {
    value?: string;
    objectValue?: {
      nestedValue?: string;
    };
    onOptionChanged?: () => void;
  }

  const onOptionChangedTestMock = jest.fn();
  const testOptions: TestOptions = {
    value: 'initialValue',
    objectValue: {
      nestedValue: 'initialNestedValue',
    },
    onOptionChanged: onOptionChangedTestMock,
  };
  const defaultTestOptions: TestOptions = {
    value: 'value_default',
    objectValue: {
      nestedValue: 'nestedValue_default',
    },
  };

  beforeEach(() => {
    onOptionChangedTestMock.mockClear();
  });

  it('should have initial value', () => {
    const { optionsController } = setup(testOptions, defaultTestOptions);

    const value = optionsController.twoWay('value');
    expect(value.unreactive_get()).toBe('initialValue');
  });

  it('should update on options changed', () => {
    const { component, optionsController } = setup(testOptions, defaultTestOptions);

    const value = optionsController.twoWay('value');
    const fn = jest.fn();

    value.subscribe(fn);

    component.option('value', 'newValue');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('newValue');
  });

  it('should return new value after update', () => {
    const { optionsController } = setup(testOptions, defaultTestOptions);

    const value = optionsController.twoWay('value');
    value.update('newValue');

    expect(value.unreactive_get()).toBe('newValue');
  });

  it('should call optionChanged on update', () => {
    const { component, optionsController } = setup(testOptions, defaultTestOptions);

    const value = optionsController.twoWay('value');
    value.update('newValue');

    expect(testOptions.onOptionChanged).toHaveBeenCalledTimes(1);
    expect(testOptions.onOptionChanged).toHaveBeenCalledWith({
      component,
      fullName: 'value',
      name: 'value',
      previousValue: 'initialValue',
      value: 'newValue',
    });
  });
});
