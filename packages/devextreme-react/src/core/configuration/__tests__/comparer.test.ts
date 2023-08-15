import { getChanges } from '../comparer';
import { IConfigNode } from '../config-node';

const emptyNode: IConfigNode = {
  fullName: '',
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
          fullName: 'option',
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
    const prevConfig = {
      ...emptyNode,
      fullName: 'items[0].items[0]',
      configCollections: {
        items: [
          {
            ...emptyNode,
            fullName: 'items[0].items[0].items[0]',
            options: {
              a: 1,
            },
          },
          {
            ...emptyNode,
            fullName: 'items[0].items[0].items[1]',
            options: {
              b: 2,
            },
          },
        ],
      },
    };

    const currentConfig = {
      ...emptyNode,
      fullName: 'items[0].items[0]',
      configCollections: {
        items: [
          {
            ...emptyNode,
            fullName: 'items[0].items[0].items[0]',
            options: {
              a: 11,
            },
          },
          {
            ...emptyNode,
            fullName: 'items[0].items[0].items[1]',
            options: {
              b: 22,
            },
          },
          {
            ...emptyNode,
            fullName: 'items[0].items[0].items[2]',
            options: {
              c: 33,
            },
          },
        ],
      },
    };

    const changes = getChanges(currentConfig, prevConfig);
    expect(Object.keys(changes.options).length).toEqual(1);
    expect(changes.options['items[0].items[0].items']).toEqual([{ a: 11 }, { b: 22 }, { c: 33 }]);
  });
});
