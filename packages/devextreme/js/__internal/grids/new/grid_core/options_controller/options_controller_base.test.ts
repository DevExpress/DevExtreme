/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

        expect(value.peek()).toBe(plainOptions.value);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, defaultPlainOptions);

        const value = optionsController.oneWay('value');

        expect(value.peek()).toBe(defaultPlainOptions.value);
      });

      it('should have initial value same as passed in config if default not specified', () => {
        const optionalOptions = { optionalValue: 'ABC' };
        const { optionsController } = setup<PlainOptions>(optionalOptions, defaultPlainOptions);

        const value = optionsController.oneWay('optionalValue');

        expect(value.peek()).toBe(optionalOptions.optionalValue);
      });

      it('should have undefined value if options not passed with config and doesnt have default value', () => {
        const { optionsController } = setup<PlainOptions>(plainOptions, defaultPlainOptions);

        const value = optionsController.oneWay('optionalValue');

        expect(value.peek()).toBe(undefined);
      });
    });

    describe('object options child subscription', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(nestedPlainOptions, defaultNestedPlainOptions);

        const value = optionsController.oneWay('nested.value');

        expect(value.peek()).toBe(nestedPlainOptions.nested!.value);
      });

      it('should have initial default value if parent config option is undefined', () => {
        const { optionsController } = setup({}, defaultNestedPlainOptions);

        const value = optionsController.oneWay('nested.value');

        expect(value.peek()).toBe(defaultNestedPlainOptions.nested?.value);
      });

      it('should have initial default value if plain config option is undefined', () => {
        const { optionsController } = setup(
          { nested: { value: undefined } },
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.value');

        expect(value.peek()).toBe(defaultNestedPlainOptions.nested?.value);
      });

      it('should have initial value same as passed in config if default not specified', () => {
        const optionalOptions = { nested: { optionalValue: 'ABC' } };
        const { optionsController } = setup<ObjectOptions>(
          optionalOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('optionalValue');

        expect(value.peek()).toBe(defaultNestedPlainOptions.nested?.optionalValue);
      });

      it('should have undefined value if options not passed with config and doesnt have default value', () => {
        const { optionsController } = setup<ObjectOptions>(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.optionalValue');

        expect(value.peek()).toBe(undefined);
      });
    });

    describe('object options self subscription', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(nestedPlainOptions, defaultNestedPlainOptions);

        const value = optionsController.oneWay('nested');

        expect(value.peek()).toStrictEqual(nestedPlainOptions.nested);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, defaultNestedPlainOptions);

        const value = optionsController.oneWay('nested');

        expect(value.peek()).toStrictEqual(defaultNestedPlainOptions.nested);
      });

      it('should have initial default value if child config option is undefined', () => {
        const { optionsController } = setup(
          { nested: { value: undefined } },
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested');

        expect(value.peek()).toStrictEqual(defaultNestedPlainOptions.nested);
      });

      it('should merge passed optional values with default ones', () => {
        const optionalOptions = { nested: { optionalValue: 'ABC' } };
        const { optionsController } = setup<ObjectOptions>(
          optionalOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested');

        expect(value.peek()).toStrictEqual({
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

        expect(value.peek()).toStrictEqual(arrayOptions.value);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, defaultArrayOptions);

        const value = optionsController.oneWay('value');

        expect(value.peek()).toStrictEqual(defaultArrayOptions.value);
      });

      it('should have initial value same as passed in config if default not specified', () => {
        const optionalOptions = { optionalValue: ['A_optional', 'B_optional'] };
        const { optionsController } = setup<ArrayOptions>(optionalOptions, defaultArrayOptions);

        const value = optionsController.oneWay('optionalValue');

        expect(value.peek()).toStrictEqual(optionalOptions.optionalValue);
      });

      it('should have undefined value if options not passed with config and doesnt have default value', () => {
        const { optionsController } = setup<ArrayOptions>(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('optionalValue');

        expect(value.peek()).toBe(undefined);
      });
    });

    describe('function options', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(functionOptions, defaultFunctionOptions);

        const value = optionsController.oneWay('value');

        expect(value.peek()?.name).toBe(functionOptions.value?.name);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, defaultFunctionOptions);

        const value = optionsController.oneWay('value');

        expect(value.peek()?.name).toBe(defaultFunctionOptions.value?.name);
      });

      it('should have initial value same as passed in config if default not specified', () => {
        const optionalOptions = { optionalValue: function optionalFnValue() {} };
        const { optionsController } = setup<FunctionOptions>(
          optionalOptions,
          defaultFunctionOptions,
        );

        const value = optionsController.oneWay('optionalValue');

        expect(value.peek()?.name).toBe('optionalFnValue');
      });

      it('should have undefined value if options not passed with config and doesnt have default value', () => {
        const { optionsController } = setup<FunctionOptions>(
          functionOptions,
          defaultFunctionOptions,
        );

        const value = optionsController.oneWay('optionalValue');

        expect(value.peek()).toBe(undefined);
      });
    });

    describe('mixed options child subscription', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(mixedComplexOptions, mixedPlainOptions);

        const value = optionsController.oneWay('value.valueA');

        expect(value.peek()).toStrictEqual((mixedComplexOptions.value as any).valueA);
      });

      it('should have initial value undefined if parent is plain value', () => {
        const { optionsController } = setup(mixedPlainOptions, mixedComplexOptions);

        const value = optionsController.oneWay('value.valueA');

        expect(value.peek()).toBe(undefined);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, mixedComplexOptions);

        const value = optionsController.oneWay('value.valueA');

        expect(value.peek()).toBe((mixedComplexOptions.value as any).valueA);
      });
    });

    describe('mixed options self subscription', () => {
      it('should have initial value same as passed in config', () => {
        const { optionsController } = setup(mixedComplexOptions, mixedPlainOptions);

        const value = optionsController.oneWay('value');

        expect(value.peek()).toStrictEqual(mixedComplexOptions.value);
      });

      it('should have initial default value if config options is undefined', () => {
        const { optionsController } = setup({}, mixedPlainOptions);

        const value = optionsController.oneWay('value');

        expect(value.peek()).toBe(mixedPlainOptions.value);
      });
    });
  });

  describe('update values', () => {
    describe('plain options', () => {
      it('should update on option changed', () => {
        const { component, optionsController } = setup(plainOptions, defaultPlainOptions);

        const value = optionsController.oneWay('value');
        component.option('value', 'newValue');

        expect(value.peek()).toBe('newValue');
      });

      it('should update boolean plain option on option changed', () => {
        const { component, optionsController } = setup({}, { value: true });

        const value = optionsController.oneWay('value');
        component.option('value', false);

        expect(value.peek()).toBe(false);
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(plainOptions, defaultPlainOptions);

        const value = optionsController.oneWay('value');
        component.option('value', undefined);

        expect(value.peek()).toBe(defaultPlainOptions.value);
      });

      it('should update initial undefined value to updated value', () => {
        const { component, optionsController } = setup(plainOptions, defaultPlainOptions);

        const value = optionsController.oneWay('optionalValue');
        component.option('optionalValue', 'newValue');

        expect(value.peek()).toBe('newValue');
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

        expect(value.peek()).toBe('newValue');
      });

      it('should update on parent option changed', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.value');
        component.option('nested', { value: 'newValue' });

        expect(value.peek()).toBe('newValue');
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.value');
        component.option('nested.value', undefined);

        expect(value.peek()).toBe(defaultNestedPlainOptions.nested?.value);
      });

      it('should update to default value if parent option updated to undefined', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.value');
        component.option('nested', undefined);

        expect(value.peek()).toBe(defaultNestedPlainOptions.nested?.value);
      });

      it('should update initial undefined value to updated value', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.optionalValue');
        component.option('nested.optionalValue', 'newValue');

        expect(value.peek()).toBe('newValue');
      });

      it('should update initial undefined value to updated value on parent option update', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested.optionalValue');
        component.option('nested', { optionalValue: 'newValue' });

        expect(value.peek()).toBe('newValue');
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

        expect(value.peek()).toStrictEqual(updatedOptions);
      });

      it('should update on child option changed', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested');
        component.option('nested.value', 'newValue');

        expect(value.peek()).toStrictEqual({ value: 'newValue' });
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(
          nestedPlainOptions,
          defaultNestedPlainOptions,
        );

        const value = optionsController.oneWay('nested');
        component.option('nested', undefined);

        expect(value.peek()).toStrictEqual(defaultNestedPlainOptions.nested);
      });
    });

    describe('array options', () => {
      it('should update on whole array option changed', () => {
        const { component, optionsController } = setup(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('value');
        component.option('value', ['F', 'E']);

        expect(value.peek()).toStrictEqual(['F', 'E']);
      });

      it('should update on array element option changed', () => {
        const { component, optionsController } = setup(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('value');
        component.option('value[0]', 'F');

        expect(value.peek()).toStrictEqual(['F', 'B', 'C']);
      });

      it('should update on array element child option changed', () => {
        const { component, optionsController } = setup(
          { value: [{ A: 'A_0', B: 'B_0' }, { A: 'A_1', B: 'B_1' }] },
          {},
        );

        const value = optionsController.oneWay('value');
        component.option('value[0].A', 'F');

        expect(value.peek()).toStrictEqual([{ A: 'F', B: 'B_0' }, { A: 'A_1', B: 'B_1' }]);
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('value');
        component.option('value', undefined);

        expect(value.peek()).toStrictEqual(defaultArrayOptions.value);
      });

      it('should update initial undefined value to updated value', () => {
        const { component, optionsController } = setup(arrayOptions, defaultArrayOptions);

        const value = optionsController.oneWay('optionalValue');
        component.option('optionalValue', ['F', 'E']);

        expect(value.peek()).toStrictEqual(['F', 'E']);
      });
    });

    describe('function options', () => {
      it('should update on option changed', () => {
        const { component, optionsController } = setup(functionOptions, defaultFunctionOptions);

        const value = optionsController.oneWay('value');
        // eslint-disable-next-line prefer-arrow-callback
        component.option('value', function newFn() {});

        expect(value.peek()?.name).toBe('newFn');
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(functionOptions, defaultFunctionOptions);

        const value = optionsController.oneWay('value');
        component.option('value', undefined);

        expect(value.peek()?.name).toBe(defaultFunctionOptions.value?.name);
      });

      it('should update initial undefined value to updated value', () => {
        const { component, optionsController } = setup(functionOptions, defaultFunctionOptions);

        const value = optionsController.oneWay('optionalValue');
        // eslint-disable-next-line prefer-arrow-callback
        component.option('optionalValue', function newFn() {});

        expect(value.peek()?.name).toBe('newFn');
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

        expect(value.peek()).toBe('newValue');
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedComplexOptions,
        );

        const value = optionsController.oneWay('value.valueA');
        component.option('value.valueA', undefined);

        expect(value.peek()).toBe((mixedComplexOptions.value as any)?.valueA);
      });

      it('should update to undefined if parent option update to plain one', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedPlainOptions,
        );

        const value = optionsController.oneWay('value.valueA');
        component.option('value', 'plain');

        expect(value.peek()).toBe(undefined);
      });

      it('should update to default value if parent updated to undefined', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedComplexOptions,
        );

        const value = optionsController.oneWay('value.valueA');
        component.option('value', undefined);

        expect(value.peek()).toBe((mixedComplexOptions.value as any)?.valueA);
      });

      it('should update to undefined if default value is plain', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedPlainOptions,
        );

        const value = optionsController.oneWay('value.valueA');
        component.option('value', undefined);

        expect(value.peek()).toBe(undefined);
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

        expect(value.peek()).toStrictEqual({ valueA: '1', valueB: '2' });
      });

      it('should update on option changed to plain', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedPlainOptions,
        );

        const value = optionsController.oneWay('value');
        component.option('value', 'newValue');

        expect(value.peek()).toBe('newValue');
      });

      it('should update on child option changed', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedComplexOptions,
        );

        const value = optionsController.oneWay('value');
        component.option('value.valueA', 'newValue');

        expect(value.peek()).toStrictEqual({ valueA: 'newValue', valueB: 'B' });
      });

      it('should update to default value if updated to undefined', () => {
        const { component, optionsController } = setup(
          mixedComplexOptions,
          mixedPlainOptions,
        );

        const value = optionsController.oneWay('value');
        component.option('value', undefined);

        expect(value.peek()).toStrictEqual(mixedPlainOptions.value);
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
    expect(value.value).toBe('initialValue');
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
    value.value = 'newValue';

    expect(value.value).toBe('newValue');
  });

  it('should call optionChanged on update', () => {
    const { component, optionsController } = setup(testOptions, defaultTestOptions);

    const value = optionsController.twoWay('value');
    value.value = 'newValue';

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

describe('oneWayWithChanges', () => {
  it('should return changes: null if optionChanged was not called', () => {
    const publicOptions = { value: { str: 'str' } };
    const { optionsController } = setup<{ value?: { str?: string } }>(publicOptions, {});

    const value = optionsController.oneWayWithChanges('value');

    expect(value.peek()).toStrictEqual({ changes: null, value: publicOptions.value });
  });

  it('should return changes if optionChanged was called', () => {
    const publicOptions = { value: 'str' };
    const { component, optionsController } = setup<{ value?: string }>(publicOptions, {});

    component.option('value', 'str_2');
    const value = optionsController.oneWayWithChanges('value');

    const result = value.peek();

    expect(result.changes).toMatchObject({
      name: 'value',
      fullName: 'value',
      value: 'str_2',
      previousValue: 'str',
    });
    expect(result.value).toStrictEqual('str_2');
  });

  it('should return changes of nested option if optionChanged was called', () => {
    const publicOptions = { a: { b: { c: 'C_0' } } };
    const { component, optionsController } = setup<
      { a?: { b?: { c?: string } } }
    >(publicOptions, {});

    component.option('a.b.c', 'C_1');
    const value = optionsController.oneWayWithChanges('a.b.c');

    const result = value.peek();

    expect(result.changes).toMatchObject({
      name: 'a',
      fullName: 'a.b.c',
      value: 'C_1',
      previousValue: 'C_0',
    });
    expect(result.value).toStrictEqual('C_1');
  });

  it('should use different cache with oneWay', () => {
    const publicOptions = { value: '123' };
    const { optionsController } = setup<{ value?: string }>(publicOptions, {});

    const value = optionsController.oneWay('value');
    const valueWithChanges = optionsController.oneWayWithChanges('value');

    expect(value.peek()).toBe('123');
    expect(valueWithChanges.peek()).toStrictEqual({
      changes: null,
      value: '123',
    });
  });
});

describe('notifyColumnOptionChanged', () => {
  it('should not update the internal state', () => {
    const publicOptions = { columns: [{ visible: true }] };
    const { optionsController } = setup<{ columns?: { visible?: boolean }[] }>(publicOptions, {});

    const columnVisible = optionsController.oneWay('columns[0].visible');
    const columnVisibleWithChanges = optionsController.oneWayWithChanges('columns[0].visible');

    optionsController.notifyColumnOptionChanged('columns[0].visible', false, true);

    expect(columnVisible.peek()).toBe(true);
    expect(columnVisibleWithChanges.peek()).toStrictEqual({
      changes: null,
      value: true,
    });
  });
});
