import {
  PluginEntity, PluginGetter, createValue, createGetter, Plugins, createPlaceholder,
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
      expect(entity.getValue(1)).toBe(1);
    });
  });
});

describe('PluginGetter', () => {
  describe('getValue', () => {
    it('should call all handlers in right order', () => {
      const getter = new PluginGetter(0);

      const handler = {
        order: 0,
        func: (n: number) => n + 1,
      };

      const handlers = [handler, handler, handler];

      expect(getter.getValue(handlers)).toBe(3);
    });
  });
});

describe('Plugins', () => {
  const someValuePlugin = createValue();
  const someGetterPlugin = createGetter(0);
  const somePlaceholderPlugin = createPlaceholder(0);

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
  });
});
