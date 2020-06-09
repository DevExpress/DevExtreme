import dependencyTree, { DependencyObj, Options } from 'dependency-tree';
import fs from 'fs';
import DependencyCollector from '../../src/metadata/dependency-collector';

const simpleJsDependencies: DependencyObj = {
  'dx.all.js': {
    'datagrid.js': {
      'menu.js': {
        'button.js': {
          'icon.js': {},
        },
        'utils.js': {
          'fx.js': {},
        },
      },
    },
    'menu.js': {
      'button.js': {
        'icon.js': {},
      },
      'utils.js': {
        'fx.js': {},
      },
    },
    'utils.js': {
      'fx.js': {},
    },
  },
};

const readEmptyFile = jest.fn().mockImplementation((): string => '');

jest.mock('dependency-tree', () => ({
  __esModule: true,
  default: jest.fn((config: Options): DependencyObj => {
    if (config.filename === '../js/bundles/dx.all.js'
    && config.directory === '../js/'
    && config.filter('node_modules') === false) {
      return simpleJsDependencies;
    }
    return null;
  }),
}));

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockImplementation((path: string): string => {
    let content = '';
    switch (path) {
      case 'datagrid.js':
        content = '// #STYLE dataGrid';
        break;
      case 'menu.js':
        content = '// #STYLE menu';
        break;
      case 'icon.js':
        content = '// #STYLE icon';
        break;
      default:
        content = '';
    }
    return content;
  }),
  existsSync: (): boolean => true,
}));


describe('DependencyCollector', () => {
  beforeEach(() => {
    (fs.readFileSync as jest.Mock).mockClear();
  });

  test('fillFullDependencyTree', () => {
    const dependencyCollector = new DependencyCollector();
    dependencyCollector.fillFullDependencyTree();

    expect(dependencyCollector.fullDependencyTree).toEqual(simpleJsDependencies);
    expect(dependencyTree).toBeCalledTimes(1);

    (dependencyTree as unknown as jest.Mock).mockClear();
  });

  test('fillStylesDependencyTree - no styles ref in file content', () => {
    const dependencyCollector = new DependencyCollector();
    dependencyCollector.readFile = readEmptyFile;
    dependencyCollector.fullDependencyTree = simpleJsDependencies;
    dependencyCollector.fillStylesDependencyTree();

    expect(dependencyCollector.stylesDependencyTree).toEqual({});
  });

  test('fillStylesDependencyTree - simple dependency tree', () => {
    const dependencyCollector = new DependencyCollector();
    dependencyCollector.fullDependencyTree = simpleJsDependencies;
    dependencyCollector.fillStylesDependencyTree();

    expect(dependencyCollector.stylesDependencyTree).toEqual({
      dataGrid: {
        menu: {
          icon: {},
        },
      },
      menu: {
        icon: {},
      },
    });
  });

  test('getFlatDependencyArray', () => {
    expect(DependencyCollector.getFlatDependencyArray({})).toEqual([]);

    expect(DependencyCollector.getFlatDependencyArray({
      menu: {
        icon: {},
      },
    })).toEqual(['menu', 'icon']);

    expect(DependencyCollector.getFlatDependencyArray({
      menu: {
        button: {
          icon: {},
        },
      },
      contextMenu: {
        buttonGroup: {},
        toolbar: {
          navBar: {
            tab: {},
          },
        },
      },
    })).toEqual([
      'menu',
      'button',
      'icon',
      'contextMenu',
      'buttonGroup',
      'toolbar',
      'navBar',
      'tab',
    ]);

    expect(DependencyCollector.getFlatDependencyArray({
      menu: {
        button: {
          icon: {},
        },
      },
      contextMenu: {
        buttonGroup: {
          icon: {},
          button: {},
        },
        toolbar: {
          icon: {},
          navBar: {
            tab: {
              icon: {},
            },
          },
        },
      },
    })).toEqual([
      'menu',
      'button',
      'icon',
      'contextMenu',
      'buttonGroup',
      'toolbar',
      'navBar',
      'tab',
    ]);
  });

  test('flatStylesDependencyTree', () => {
    const dependencyCollector = new DependencyCollector();
    dependencyCollector.fullDependencyTree = simpleJsDependencies;
    dependencyCollector.fillStylesDependencyTree();
    dependencyCollector.fillFlatStylesDependencyTree();

    expect(dependencyCollector.flatStylesDependencyTree).toEqual({
      dataGrid: ['menu', 'icon'],
      menu: ['icon'],
    });
  });

  test('collect - right result and cache worked', () => {
    const dependencyCollector = new DependencyCollector();
    dependencyCollector.collect();

    expect(fs.readFileSync).toBeCalledTimes(7);
    expect(dependencyCollector.flatStylesDependencyTree).toEqual({
      dataGrid: ['menu', 'icon'],
      menu: ['icon'],
    });
  });
});
