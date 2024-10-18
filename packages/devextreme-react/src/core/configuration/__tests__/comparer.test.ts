import { getChanges } from '../comparer';
import { IConfigNode } from '../config-node';

const emptyNode: IConfigNode = {
  name: '',
  predefinedOptions: {},
  initialOptions: {},
  options: {},
  templates: [],
  configs: {},
  configCollections: {},
};

describe('child config nodes comparing', () => {
  it('detects additions', () => {
    const prevConfig = {
      ...emptyNode,
    };

    const currentConfig = {
      ...emptyNode,
      configs: {
        option: {
          ...emptyNode,
          name: 'option',
          options: { a: 1 },
        },
      },
    };

    const changes = getChanges(currentConfig, prevConfig);
    expect(Object.keys(changes.options).length).toEqual(1);
    expect(changes.options.option).toEqual({ a: 1 });
  });
});

describe('collections comparing', () => {
  it('detects additions', () => {
    const prevConfig: IConfigNode = {
      ...emptyNode,
      name: 'items',
      index: 0,
      configCollections: {
        items: [],
      },
    };

    prevConfig.configCollections.items.push(
      {
        ...emptyNode,
        name: 'items',
        index: 0,
        parentNode: prevConfig,
        configCollections: {
          items: [],
        },
      }
    );

    prevConfig.configCollections.items[0].configCollections.items.push(
      {
        ...emptyNode,
        name: 'items',
        index: 0,
        parentNode: prevConfig.configCollections.items[0],
        options: {
          a: 1,
        },
      },
      {
        ...emptyNode,
        name: 'items',
        index: 1,
        parentNode: prevConfig.configCollections.items[0],
        options: {
          b: 2,
        },
      },
    );


    const currentConfig: IConfigNode = {
      ...emptyNode,
      name: 'items',
      index: 0,
      configCollections: {
        items: [],
      },
    };

    currentConfig.configCollections.items.push(
      {
        ...emptyNode,
        name: 'items',
        index: 0,
        parentNode: currentConfig,
        configCollections: {
          items: [],
        },
      }
    );

    currentConfig.configCollections.items[0].configCollections.items.push(
      {
        ...emptyNode,
        name: 'items',
        index: 0,
        parentNode: currentConfig.configCollections.items[0],
        options: {
          a: 11,
        },
      },
      {
        ...emptyNode,
        name: 'items',
        index: 1,
        parentNode: currentConfig.configCollections.items[0],
        options: {
          b: 22,
        },
      },
      {
        ...emptyNode,
        name: 'items',
        index: 2,
        parentNode: currentConfig.configCollections.items[0],
        options: {
          c: 33,
        },
      },
    );

    const changes = getChanges(currentConfig, prevConfig);
    expect(Object.keys(changes.options).length).toEqual(1);
    expect(changes.options['items[0].items[0].items']).toEqual([{ a: 11 }, { b: 22 }, { c: 33 }]);
  });
});
