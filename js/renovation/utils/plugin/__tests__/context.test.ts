import {
  PluginEntity, PluginGetter, createValue, createGetter, Plugins, createPlaceholder, createSelector,
} from '../context';

describe('PluginEntity', () => {
  describe('constructor', () => {
    it('should update id', () => {
      const item1 = new PluginEntity();
      const item2 = new PluginEntity();
      const item3 = new PluginEntity();

      const firstId = item1.id;

      expect(item2.id).toBe(firstId + 1);
      expect(item3.id).toBe(firstId + 2);
    });
  });

  describe('getValue', () => {
    it('should return value', () => {
      const entity = new PluginEntity();
      expect(entity.getValue(1, new Plugins())).toBe(1);
    });
  });
});

describe('PluginGetter', () => {
  describe('getValue', () => {
    it('should call all handlers in right order', () => {
      const getter = new PluginGetter(0);

      const handler = {
        order: 0,
        func: ((n: number) => n + 1) as (...args: unknown[]) => number,
      };

      const handlers = [handler, handler, handler];

      expect(getter.getValue(handlers, new Plugins())).toBe(3);
    });
  });
});

describe('PluginSelector', () => {
  it('deps and func fields should be correct', () => {
    const deps = [createValue()];
    const func = () => null;
    const selector = createSelector(deps, func);

    expect(selector.deps).toBe(deps);
    expect(selector.func).toBe(func);
  });
});

describe('Plugins', () => {
  const someValuePlugin = createValue();
  const someGetterPlugin = createGetter(0);
  const somePlaceholderPlugin = createPlaceholder();

  describe('set', () => {
    it('should save value', () => {
      const plugins = new Plugins();
      plugins.set(someValuePlugin, 'some value');

      expect(plugins.getValue(someValuePlugin)).toBe('some value');
    });

    it('should call callbacks', () => {
      const mock = jest.fn();
      const plugins = new Plugins();

      plugins.watch(someValuePlugin, mock);
      plugins.set(someValuePlugin, 'some value');

      expect(mock).toBeCalledWith('some value');
    });

    it('should not call callback if set same value', () => {
      const mock = jest.fn();
      const plugins = new Plugins();

      plugins.set(someValuePlugin, 'test');

      plugins.watch(someValuePlugin, mock);

      mock.mockReset();

      plugins.set(someValuePlugin, 'test');

      expect(mock).not.toHaveBeenCalled();
    });

    it('should call callback if set same value with force true parameter', () => {
      const mock = jest.fn();
      const plugins = new Plugins();

      plugins.set(someValuePlugin, 'test');

      plugins.watch(someValuePlugin, mock);

      mock.mockReset();

      plugins.set(someValuePlugin, 'test', true);

      expect(mock).toHaveBeenCalledWith('test');
    });
  });

  describe('getValue', () => {
    it('should return undefined if PluginValue is not defined', () => {
      const plugins = new Plugins();

      expect(plugins.getValue(someValuePlugin)).toBeUndefined();
    });

    it('should return value from PluginValue', () => {
      const plugins = new Plugins();
      plugins.set(someValuePlugin, 'test');

      expect(plugins.getValue(someValuePlugin)).toBe('test');
    });

    it('should return calculated value from PluginSelector', () => {
      const plugins = new Plugins();
      const Value1 = createValue<number>();
      const Value2 = createValue<number>();
      const SumSelector = createSelector(
        [Value1, Value2],
        (value1: number, value2: number) => value1 + value2,
      );
      plugins.set(Value1, 1);
      plugins.set(Value2, 2);

      expect(plugins.getValue(SumSelector)).toBe(3);
    });
  });

  describe('hasValue', () => {
    it('should return false if set is not called for PluginValue', () => {
      const plugins = new Plugins();

      expect(plugins.hasValue(someValuePlugin)).toBe(false);
    });

    it('should return true if set is called for PluginValue', () => {
      const plugins = new Plugins();

      plugins.set(someValuePlugin, 1);

      expect(plugins.hasValue(someValuePlugin)).toBe(true);
    });

    it('should return true if set is called for PluginValue with undefined value', () => {
      const plugins = new Plugins();

      plugins.set(someValuePlugin, undefined);

      expect(plugins.hasValue(someValuePlugin)).toBe(true);
    });
  });

  describe('extend', () => {
    it('should add new handler in right order', () => {
      const plugins = new Plugins();
      const items = [
        { order: 0, func: jest.fn() },
        { order: 2, func: jest.fn() },
      ];

      plugins.set(someGetterPlugin, items);
      plugins.extend(someGetterPlugin, 1, jest.fn());

      expect((plugins as any).items[someGetterPlugin.id]).toMatchObject([
        { order: 0 },
        { order: 1 },
        { order: 2 },
      ]);
    });

    it('should return dispose callback', () => {
      const plugins = new Plugins();
      const items = [
        { order: 0, func: jest.fn() },
        { order: 2, func: jest.fn() },
      ];

      plugins.set(someGetterPlugin, items);
      const dispose = plugins.extend(someGetterPlugin, 1, jest.fn());

      dispose();

      expect((plugins as any).items[someGetterPlugin.id]).toMatchObject([
        { order: 0 },
        { order: 2 },
      ]);
    });

    it('should throw error if calling dispose twice', () => {
      const plugins = new Plugins();
      const dispose = plugins.extend(someGetterPlugin, 1, jest.fn());

      dispose();
      expect(dispose).not.toThrow();
    });

    it('should work with deps', () => {
      const plugins = new Plugins();

      plugins.set(someValuePlugin, 3);
      plugins.extend(someGetterPlugin, -1, () => 100);
      plugins.extend(
        someGetterPlugin,
        0,
        ((base: number, someValue: number) => base + someValue) as (base: number) => number,
        [someGetterPlugin, someValuePlugin],
      );

      expect(plugins.getValue(someGetterPlugin)).toEqual(103);
    });

    it('should skip extend if deps are not defined', () => {
      const plugins = new Plugins();

      plugins.extend(someGetterPlugin, -1, () => 100);
      plugins.extend(
        someGetterPlugin,
        0,
        ((base: number, someValue: number) => base + someValue) as (base: number) => number,
        [someGetterPlugin, someValuePlugin],
      );

      expect(plugins.getValue(someGetterPlugin)).toEqual(100);
    });

    it('should subscribe to deps', () => {
      const plugins = new Plugins();
      const watchFnMock = jest.fn();

      plugins.set(someValuePlugin, 3);
      plugins.extend(someGetterPlugin, -1, () => 100);
      plugins.extend(
        someGetterPlugin,
        0,
        ((base: number, someValue: number) => base + someValue) as (base: number) => number,
        [someGetterPlugin, someValuePlugin],
      );

      plugins.watch(someGetterPlugin, watchFnMock);
      plugins.set(someValuePlugin, 11);

      expect(watchFnMock).toBeCalledTimes(2);
      expect(watchFnMock).toHaveBeenCalledWith(111);
      expect(plugins.getValue(someGetterPlugin)).toEqual(111);
    });

    it('should unsubscribe from deps on dispose', () => {
      const plugins = new Plugins();
      const watchFnMock = jest.fn();

      plugins.set(someValuePlugin, 3);
      const dispose = plugins.extend(
        someGetterPlugin,
        0,
        ((base: number, someValue: number) => base + someValue) as (base: number) => number,
        [someGetterPlugin, someValuePlugin],
      );
      plugins.watch(someGetterPlugin, watchFnMock);
      dispose();
      watchFnMock.mockClear();

      plugins.set(someValuePlugin, 10);

      expect(watchFnMock).not.toHaveBeenCalled();
      expect(plugins.getValue(someGetterPlugin)).toEqual(0);
    });
  });

  describe('extendPlaceholder', () => {
    it('should add new component in right order', () => {
      const plugins = new Plugins();
      const items = [
        { order: 0, component: {} },
        { order: 2, component: {} },
      ];

      plugins.set(somePlaceholderPlugin, items);
      plugins.extendPlaceholder(somePlaceholderPlugin, 1, {});

      expect((plugins as any).items[somePlaceholderPlugin.id]).toMatchObject([
        { order: 0 },
        { order: 1 },
        { order: 2 },
      ]);
    });

    it('should return dispose callback', () => {
      const plugins = new Plugins();
      const items = [
        { order: 0, component: {} },
        { order: 2, component: {} },
      ];

      plugins.set(somePlaceholderPlugin, items);
      const dispose = plugins.extendPlaceholder(somePlaceholderPlugin, 1, {});

      dispose();

      expect((plugins as any).items[somePlaceholderPlugin.id]).toMatchObject([
        { order: 0 },
        { order: 2 },
      ]);
    });

    it('should throw error if calling dispose twice', () => {
      const plugins = new Plugins();
      const dispose = plugins.extendPlaceholder(somePlaceholderPlugin, 1, jest.fn());

      dispose();
      expect(dispose).not.toThrow();
    });
  });

  describe('watch', () => {
    it('should call callback after changing value', () => {
      const plugins = new Plugins();
      const mock = jest.fn();

      plugins.watch(someValuePlugin, mock);
      expect(mock).not.toBeCalled();

      plugins.set(someValuePlugin, 'some value');
      expect(mock).toBeCalledWith('some value');
    });

    it('should call callback immediately if value was set before', () => {
      const plugins = new Plugins();
      const mock = jest.fn();

      plugins.set(someValuePlugin, 'some value');

      plugins.watch(someValuePlugin, mock);
      expect(mock).toBeCalledWith('some value');
    });

    it('should remove subscription after disposing', () => {
      const plugins = new Plugins();
      const mock = jest.fn();

      const dispose = plugins.watch(someValuePlugin, mock);
      dispose();

      plugins.set(someValuePlugin, 'some value');
      expect(mock).not.toBeCalled();
    });

    it('should throw error if calling dispose twice', () => {
      const plugins = new Plugins();
      const mock = jest.fn();

      const dispose = plugins.watch(someValuePlugin, mock);
      dispose();
      expect(dispose).not.toThrow();
    });

    it('should not call callback immediately for selector if dependecies are not defined', () => {
      const plugins = new Plugins();
      const SomeSelector = createSelector(
        [someValuePlugin],
        (value: number) => value + 1,
      );
      const watchCallback = jest.fn();

      plugins.watch(SomeSelector, watchCallback);

      expect(watchCallback).not.toHaveBeenCalled();
    });

    it('should call callback immediately for selector if dependecies are defined', () => {
      const plugins = new Plugins();
      const SomeSelector = createSelector(
        [someValuePlugin],
        (value: number) => value + 1,
      );
      const watchCallback = jest.fn();

      plugins.set(someValuePlugin, 3);

      plugins.watch(SomeSelector, watchCallback);

      expect(watchCallback).toHaveBeenCalledWith(4);
    });

    it('should call callback for selector on dependency change', () => {
      const plugins = new Plugins();
      const SomeSelector = createSelector(
        [someValuePlugin],
        (value: number) => value + 1,
      );
      const watchCallback = jest.fn();

      plugins.watch(SomeSelector, watchCallback);

      plugins.set(someValuePlugin, 3);

      expect(watchCallback).toHaveBeenCalledWith(4);
    });
  });

  describe('callAction', () => {
    const actionPlugin = createValue<(n: number) => number>();

    it('should return undefined if no such action', () => {
      const plugins = new Plugins();
      expect(plugins.callAction(actionPlugin, 1)).toBeUndefined();
    });

    it('should return func result if such action exists', () => {
      const plugins = new Plugins();
      plugins.set(actionPlugin, (n) => n + 1);
      expect(plugins.callAction(actionPlugin, 1)).toEqual(2);
    });
  });
});
